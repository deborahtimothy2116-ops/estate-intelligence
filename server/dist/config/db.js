"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.config.mongoUri);
        console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`[MongoDB Connection Error]:`, error);
        // Don't exit process in test environment
        if (env_1.config.nodeEnv !== 'test') {
            process.exit(1);
        }
    }
};
exports.connectDB = connectDB;
