"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/conversations', authMiddleware_1.authenticate, chatController_1.ChatController.getConversations);
router.get('/messages/:otherUserId', authMiddleware_1.authenticate, chatController_1.ChatController.getMessages);
exports.default = router;
