"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const Message_1 = require("../models/Message");
const onlineUsers = new Map(); // userId -> socketId
const setupSocketIO = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Authentication required for WebSockets'));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
            socket.userId = decoded.id;
            socket.userRole = decoded.role;
            next();
        }
        catch (err) {
            next(new Error('Invalid socket token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        const userRole = socket.userRole;
        onlineUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        socket.join(`role:${userRole}`);
        // Broadcast online status to connected clients
        io.emit('user_status_changed', { userId, status: 'online' });
        // Handle real-time messaging
        socket.on('send_message', async (data) => {
            try {
                const { receiverId, propertyId, content } = data;
                if (!receiverId || !content)
                    return;
                const message = await Message_1.Message.create({
                    senderId: userId,
                    receiverId,
                    propertyId,
                    content,
                    read: false,
                });
                const populatedMessage = await Message_1.Message.findById(message._id).populate('propertyId', 'title price images');
                // Deliver message to recipient if online
                io.to(`user:${receiverId}`).emit('receive_message', populatedMessage);
                // Acknowledge sender
                socket.emit('message_sent', populatedMessage);
            }
            catch (err) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        });
        // Typing indicators
        socket.on('typing_start', (data) => {
            io.to(`user:${data.receiverId}`).emit('user_typing', { senderId: userId });
        });
        socket.on('typing_stop', (data) => {
            io.to(`user:${data.receiverId}`).emit('user_stopped_typing', { senderId: userId });
        });
        socket.on('disconnect', () => {
            onlineUsers.delete(userId);
            io.emit('user_status_changed', { userId, status: 'offline' });
        });
    });
};
exports.setupSocketIO = setupSocketIO;
