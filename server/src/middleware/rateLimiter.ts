import { Request, Response, NextFunction } from 'express';

const ipHits = new Map<string, { count: number; resetTime: number }>();

export const rateLimiter = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
