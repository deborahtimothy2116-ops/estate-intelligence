import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { Message } from '../models/Message';

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupSocketIO = (io: SocketIOServer) => {
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication required for WebSockets'));
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string; role: string };
      (socket as any).userId = decoded.id;
      (socket as any).userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Invalid socket token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    const userRole = (socket as any).userRole;

    onlineUsers.set(userId, socket.id);
    socket.join(`user:${userId}`);
    socket.join(`role:${userRole}`);

    // Broadcast online status to connected clients
    io.emit('user_status_changed', { userId, status: 'online' });

    // Handle real-time messaging
    socket.on('send_message', async (data: { receiverId: string; propertyId?: string; content: string }) => {
      try {
        const { receiverId, propertyId, content } = data;
        if (!receiverId || !content) return;

        const message = await Message.create({
          senderId: userId,
          receiverId,
          propertyId,
          content,
          read: false,
        });

        const populatedMessage = await Message.findById(message._id).populate('propertyId', 'title price images');

        // Deliver message to recipient if online
        io.to(`user:${receiverId}`).emit('receive_message', populatedMessage);
        // Acknowledge sender
        socket.emit('message_sent', populatedMessage);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing_start', (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit('user_typing', { senderId: userId });
    });

    socket.on('typing_stop', (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit('user_stopped_typing', { senderId: userId });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(userId);
      io.emit('user_status_changed', { userId, status: 'offline' });
    });
  });
};
