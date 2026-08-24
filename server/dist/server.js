"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.server = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
exports.app = app_1.default;
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const chatSocket_1 = require("./socket/chatSocket");
const notificationService_1 = require("./services/notificationService");
const seedData_1 = require("./utils/seedData");
const server = http_1.default.createServer(app_1.default);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
(0, notificationService_1.setSocketIOInstance)(io);
(0, chatSocket_1.setupSocketIO)(io);
const startServer = async () => {
    await (0, db_1.connectDB)();
    await (0, seedData_1.seedInitialData)();
    server.listen(env_1.config.port, () => {
        console.log(`================================================`);
        console.log(`🚀 Server running in ${env_1.config.nodeEnv} mode`);
        console.log(`🌐 API listening on http://localhost:${env_1.config.port}/api`);
        console.log(`⚡ WebSockets active on ws://localhost:${env_1.config.port}`);
        console.log(`================================================`);
    });
};
if (env_1.config.nodeEnv !== 'test') {
    startServer();
}
