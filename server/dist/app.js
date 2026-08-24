"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const rateLimiter_1 = require("./middleware/rateLimiter");
const errorHandler_1 = require("./middleware/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const propertyRoutes_1 = __importDefault(require("./routes/propertyRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const inquiryRoutes_1 = __importDefault(require("./routes/inquiryRoutes"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use((0, rateLimiter_1.rateLimiter)(150, 15 * 60 * 1000)); // 150 requests per 15 min
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Healthcheck Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        service: 'AI Real Estate Intelligence API',
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/properties', propertyRoutes_1.default);
app.use('/api/favorites', favoriteRoutes_1.default);
app.use('/api/inquiries', inquiryRoutes_1.default);
app.use('/api/appointments', appointmentRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
