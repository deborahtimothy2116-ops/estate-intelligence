"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../../.env') });
exports.config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/real_estate_db',
    jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_real_estate_2026',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    aiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
};
