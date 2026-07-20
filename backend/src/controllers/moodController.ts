import { Request, Response } from 'express';
import MoodEntry from '../models/MoodEntry.js';
import User from '../models/User.js';

// POST /api/mood  - Log a new mood entry
export const logMood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emotion, intensity, note, language } = req.body;
    const userId = (req as any).user._id;

    if (!emotion) {
      res.status(400).json({ message: 'Emotion is required' });
      return;
    }

    const entry = await MoodEntry.create({
      userId,
      emotion,
      intensity: intensity ?? 5,
      note,
      language: language ?? 'English',
    });

    // Gamification Engine: Award points
    const user = await User.findById(userId);
    if (user) {
      user.points = (user.points || 0) + 10;
      
      // Simple Streak Logic: Assume +1 per log, reset if needed in a background job
      // or just increment if they haven't logged today.
      const today = new Date().setHours(0,0,0,0);
      const lastUpdated = user.updatedAt ? new Date(user.updatedAt).setHours(0,0,0,0) : 0;
      
      if (today > lastUpdated) {
        user.currentStreak = (user.currentStreak || 0) + 1;
      }
      
      // Achievements check
      if (user.points === 10 && !user.achievements.includes('First Log')) {
        user.achievements.push('First Log');
      }
      if (user.currentStreak === 3 && !user.achievements.includes('3-Day Streak')) {
        user.achievements.push('3-Day Streak');
      }
      
      await user.save();
    }

    res.status(201).json({ entry, pointsAwarded: 10, totalPoints: user?.points });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ message: 'Server error logging mood' });
  }
};

// GET /api/mood  - Get mood history for the current user
export const getMoodHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const limit = parseInt(req.query.limit as string) || 30;

    const history = await MoodEntry.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving mood history' });
  }
};

// GET /api/mood/stats - Aggregated mood stats for charts
export const getMoodStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;
    const days = parseInt(req.query.days as string) || 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const stats = await MoodEntry.aggregate([
      { $match: { userId, createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            emotion: '$emotion',
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          count: { $sum: 1 },
          avgIntensity: { $avg: '$intensity' },
        },
      },
      { $sort: { '_id.day': 1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving mood stats' });
  }
};
