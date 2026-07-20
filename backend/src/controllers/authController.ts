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

    // Check if user exists - use .lean() for fast plain object return
    const userExists = await User.findOne({ $or: [{ email }, { username }] }).select('_id').lean();
    if (userExists) {
      res.status(400).json({ message: 'User with this email or username already exists' });
      return;
    }

    // Password validation (8 chars, upper, lower, number, special)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({ message: 'Password does not meet complexity requirements' });
      return;
    }

    // Hash password (rounds=12 is a good security/performance balance)
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
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
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
