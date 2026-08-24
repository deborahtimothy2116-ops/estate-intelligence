"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole) {
            res.status(401).json({ success: false, message: 'Authentication required.' });
            return;
        }
        if (!allowedRoles.includes(req.userRole)) {
            res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to roles: [${allowedRoles.join(', ')}]. Your role: ${req.userRole}`,
            });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
