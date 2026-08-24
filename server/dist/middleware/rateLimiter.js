"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const ipHits = new Map();
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
        const now = Date.now();
        const hitInfo = ipHits.get(ip);
        if (!hitInfo || hitInfo.resetTime < now) {
            ipHits.set(ip, { count: 1, resetTime: now + windowMs });
            next();
            return;
        }
        if (hitInfo.count >= maxRequests) {
            res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
            });
            return;
        }
        hitInfo.count += 1;
        next();
    };
};
exports.rateLimiter = rateLimiter;
