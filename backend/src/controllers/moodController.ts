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
      
      const today = new Date();
      today.setHours(0,0,0,0);
      
      // We need to check the last mood entry before this one to accurately calculate streaks
      // Or we can just use the user's last updated time if we only update user on mood logs.
      // But better: use the date.
      const lastUpdatedDate = user.updatedAt ? new Date(user.updatedAt) : new Date(0);
      lastUpdatedDate.setHours(0,0,0,0);
      
      const timeDiff = today.getTime() - lastUpdatedDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      if (daysDiff === 1) {
        // Logged consecutive day
        user.currentStreak = (user.currentStreak || 0) + 1;
      } else if (daysDiff > 1) {
        // Missed a day, reset streak
        user.currentStreak = 1; 
      } else if (user.currentStreak === 0) {
        // First log ever
        user.currentStreak = 1;
      }
      
      // Achievements check
      const newAchievements = new Set(user.achievements);
      
      if (user.points >= 10) newAchievements.add('First Log 🌱');
      if (user.currentStreak >= 3) newAchievements.add('3-Day Streak 🔥');
      if (user.currentStreak >= 7) newAchievements.add('7-Day Streak 🌟');
      if (user.currentStreak >= 30) newAchievements.add('Mood Master 👑');
      if (user.points >= 500) newAchievements.add('500 Points Club 💎');
      
      user.achievements = Array.from(newAchievements);
      
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
