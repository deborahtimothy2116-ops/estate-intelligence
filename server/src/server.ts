import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { config } from './config/env';
import { connectDB } from './config/db';
import { setupSocketIO } from './socket/chatSocket';
import { setSocketIOInstance } from './services/notificationService';
import { seedInitialData } from './utils/seedData';

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setSocketIOInstance(io);
setupSocketIO(io);

const startServer = async () => {
  await connectDB();
  await seedInitialData();

  server.listen(config.port, () => {
    console.log(`================================================`);
    console.log(`🚀 Server running in ${config.nodeEnv} mode`);
    console.log(`🌐 API listening on http://localhost:${config.port}/api`);
    console.log(`⚡ WebSockets active on ws://localhost:${config.port}`);
    console.log(`================================================`);
  });
};

if (config.nodeEnv !== 'test') {
  startServer();
}

export { server, app };
