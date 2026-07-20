import { Request, Response } from 'express';
import User from '../models/User.js';
import Friendship from '../models/Friendship.js';
import mongoose from 'mongoose';

// GET /api/friends - get accepted friends list with their latest mood
export const getFriends = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId((req as any).user._id);

    const friendships = await Friendship.find({
      $or: [{ requester: userId }, { recipient: userId }],
      status: 'accepted',
    }).lean();

    const friendIds = friendships.map((f) =>
      f.requester.toString() === userId.toString() ? f.recipient : f.requester
    );

    const friends = await User.find({ _id: { $in: friendIds } })
      .select('username fullName profilePicture')
      .lean();

    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving friends' });
  }
};

// POST /api/friends/request - send a friend request
export const sendFriendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const requesterId = (req as any).user._id;
    const { recipientUsername } = req.body;

    if (!recipientUsername) {
      res.status(400).json({ message: 'Recipient username is required' });
      return;
    }

    const recipient = await User.findOne({ 
      username: { $regex: new RegExp(`^${recipientUsername}$`, 'i') } 
    });

    if (!recipient) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const recipientId = recipient._id;

    if (requesterId.toString() === recipientId.toString()) {
      res.status(400).json({ message: 'You cannot add yourself as a friend' });
      return;
    }

    const existing = await Friendship.findOne({
      $or: [
        { requester: requesterId, recipient: recipientId },
        { requester: recipientId, recipient: requesterId },
      ],
    });

    if (existing) {
      res.status(400).json({ message: 'Friend request already exists', status: existing.status });
      return;
    }

    const friendship = await Friendship.create({
      requester: requesterId,
      recipient: recipientId,
    });

    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Server error sending friend request' });
  }
};

// PUT /api/friends/respond - accept or reject a friend request
export const respondToRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipientId = (req as any).user._id;
    const { friendshipId, action } = req.body;

    if (!['accepted', 'rejected'].includes(action)) {
      res.status(400).json({ message: 'Action must be accepted or rejected' });
      return;
    }

    const friendship = await Friendship.findOneAndUpdate(
      { _id: friendshipId, recipient: recipientId, status: 'pending' },
      { status: action },
      { new: true }
    );

    if (!friendship) {
      res.status(404).json({ message: 'Pending friend request not found' });
      return;
    }

    res.json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Server error responding to friend request' });
  }
};

// GET /api/friends/pending - get incoming pending requests
export const getPendingRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const pending = await Friendship.find({ recipient: userId, status: 'pending' })
      .populate('requester', 'username fullName profilePicture')
      .lean();

    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving pending requests' });
  }
};
