import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] }).select('_id').lean();
    if (userExists) {
      res.status(400).json({ message: 'User with this email or username already exists' });
      return;
    }

    // Relaxed password: min 6 chars
    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      fullName,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('[Auth] Registration error:', error?.message || error);
    // Handle MongoDB duplicate key error
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      res.status(400).json({ message: `An account with that ${field} already exists` });
      return;
    }
    res.status(500).json({ message: 'Server error during registration', detail: error?.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // lean() + select for minimal data transfer
    const user = await User.findById((req as any).user._id).select('-passwordHash').lean();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};
