import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface NotificationToast {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

interface SocketContextType {
  socket: Socket | null;
  unreadCount: number;
  toasts: NotificationToast[];
  removeToast: (id: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'alert' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const token = localStorage.getItem('estate_token');
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => {
      console.log('⚡ Socket.IO connected');
    });

    newSocket.on('receive_message', (data: any) => {
      setUnreadCount((prev) => prev + 1);
      addToast('New Message', data.content?.substring(0, 40) || 'You received a new message', 'info');
    });

    newSocket.on('new_inquiry', (data: any) => {
      addToast('New Inquiry Received!', `${data.buyerName} inquired about ${data.propertyTitle}`, 'success');
    });

    newSocket.on('new_appointment', (data: any) => {
      addToast('New Visit Scheduled!', `Visit scheduled for ${data.propertyTitle}`, 'success');
    });

    newSocket.on('suspicious_listing_alert', (data: any) => {
      addToast('🚨 Fraud Risk Alert', `Listing "${data.title}" flagged with risk score ${data.fraudRiskScore}/100`, 'alert');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, unreadCount, toasts, removeToast }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
