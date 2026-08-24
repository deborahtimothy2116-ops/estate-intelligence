import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Message } from '../models/Message';
import { User } from '../models/User';
import mongoose from 'mongoose';

export class ChatController {
  static async getConversations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = new mongoose.Types.ObjectId(req.userId!);

      // Find all distinct users the current user has exchanged messages with
      const conversationPartners = await Message.aggregate([
        {
          $match: {
            $or: [{ senderId: userId }, { receiverId: userId }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [{ $eq: ['$senderId', userId] }, '$receiverId', '$senderId'],
            },
            lastMessage: { $first: '$content' },
            lastMessageDate: { $first: '$createdAt' },
            unreadCount: {
              $sum: {
                $cond: [
                  { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$read', false] }] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            lastMessage: 1,
            lastMessageDate: 1,
            unreadCount: 1,
            'user.name': 1,
            'user.email': 1,
            'user.role': 1,
            'user.avatar': 1,
            'user.agencyName': 1,
          },
        },
        { $sort: { lastMessageDate: -1 } },
      ]);

      res.json({ success: true, conversations: conversationPartners });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getMessages(req: AuthRequest, res: Response): Promise<void> {
    try {
      const currentUserId = req.userId!;
      const { otherUserId } = req.params;

      const messages = await Message.find({
        $or: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      })
        .sort({ createdAt: 1 })
        .populate('propertyId', 'title price locality images');

      // Mark unread messages as read
      await Message.updateMany(
        { senderId: otherUserId, receiverId: currentUserId, read: false },
        { $set: { read: true } }
      );

      res.json({ success: true, messages });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
