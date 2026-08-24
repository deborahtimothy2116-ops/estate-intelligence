"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const Message_1 = require("../models/Message");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatController {
    static async getConversations(req, res) {
        try {
            const userId = new mongoose_1.default.Types.ObjectId(req.userId);
            // Find all distinct users the current user has exchanged messages with
            const conversationPartners = await Message_1.Message.aggregate([
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
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getMessages(req, res) {
        try {
            const currentUserId = req.userId;
            const { otherUserId } = req.params;
            const messages = await Message_1.Message.find({
                $or: [
                    { senderId: currentUserId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: currentUserId },
                ],
            })
                .sort({ createdAt: 1 })
                .populate('propertyId', 'title price locality images');
            // Mark unread messages as read
            await Message_1.Message.updateMany({ senderId: otherUserId, receiverId: currentUserId, read: false }, { $set: { read: true } });
            res.json({ success: true, messages });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.ChatController = ChatController;
