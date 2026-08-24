"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = void 0;
const zod_1 = require("zod");
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const issueMessages = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: issueMessages,
                });
                return;
            }
            res.status(400).json({ success: false, message: 'Invalid request data' });
        }
    };
};
exports.validateBody = validateBody;
