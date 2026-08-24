"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = exports.setSocketIOInstance = void 0;
let ioInstance = null;
const setSocketIOInstance = (io) => {
    ioInstance = io;
};
exports.setSocketIOInstance = setSocketIOInstance;
class NotificationService {
    static sendToUser(userId, event, payload) {
        if (ioInstance) {
            ioInstance.to(`user:${userId}`).emit(event, payload);
        }
    }
    static sendToRole(role, event, payload) {
        if (ioInstance) {
            ioInstance.to(`role:${role}`).emit(event, payload);
        }
    }
    static broadcast(event, payload) {
        if (ioInstance) {
            ioInstance.emit(event, payload);
        }
    }
}
exports.NotificationService = NotificationService;
