import { Server as SocketIOServer } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const setSocketIOInstance = (io: SocketIOServer) => {
  ioInstance = io;
};

export class NotificationService {
  static sendToUser(userId: string, event: string, payload: any) {
    if (ioInstance) {
      ioInstance.to(`user:${userId}`).emit(event, payload);
    }
  }

  static sendToRole(role: string, event: string, payload: any) {
    if (ioInstance) {
      ioInstance.to(`role:${role}`).emit(event, payload);
    }
  }

  static broadcast(event: string, payload: any) {
    if (ioInstance) {
      ioInstance.emit(event, payload);
    }
  }
}
