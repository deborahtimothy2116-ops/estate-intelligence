import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/conversations', authenticate, ChatController.getConversations);
router.get('/messages/:otherUserId', authenticate, ChatController.getMessages);

export default router;
