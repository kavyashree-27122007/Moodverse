import { Request, Response } from 'express';
import MoodEntry from '../models/MoodEntry';
import EmotionalMemory from '../models/EmotionalMemory';
import { aiEngine } from '../services/ai.service';

export const getInsights = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    
    // Fetch last 30 moods for better context
    const moods = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
      
    // Fetch memory
    let memory = await EmotionalMemory.findOne({ userId }).lean();
    if (!memory) {
      memory = await EmotionalMemory.create({ userId });
    }
      
    const analysis = await aiEngine.analyzeEmotion(moods, memory);
    
    res.json({ success: true, insights: analysis });
  } catch (error) {
    console.error('AI Insights Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    
    const latestMood = await MoodEntry.findOne({ userId })
      .sort({ createdAt: -1 })
      .select('emotion')
      .lean();
    
    const moodStr = latestMood ? latestMood.emotion : 'Neutral';
    const recs = await aiEngine.getRecommendations(moodStr);
    
    res.json({ success: true, recommendations: recs, basedOn: moodStr });
  } catch (error) {
    console.error('AI Recs Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const memory = await EmotionalMemory.findOne({ userId }).lean();
    res.json({ success: true, memory });
  } catch (error) {
    console.error('Get Memory Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    await EmotionalMemory.findOneAndDelete({ userId });
    res.json({ success: true, message: 'Memory reset successfully' });
  } catch (error) {
    console.error('Delete Memory Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const exportMemory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const memory = await EmotionalMemory.findOne({ userId }).lean();
    const moods = await MoodEntry.find({ userId }).sort({ createdAt: -1 }).lean();
    
    const exportData = {
      user: (req as any).user.username,
      exportDate: new Date().toISOString(),
      memory,
      moodHistory: moods
    };
    
    res.json({ success: true, data: exportData });
  } catch (error) {
    console.error('Export Memory Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
