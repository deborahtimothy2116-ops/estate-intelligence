import { Router } from 'express';
import { AiController } from '../controllers/aiController';
import { optionalAuthenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/search', optionalAuthenticate, AiController.nlpSearch);
router.post('/chat', optionalAuthenticate, AiController.chatAssistant);
router.post('/predict-price', optionalAuthenticate, AiController.predictPrice);
router.post('/fraud-check', optionalAuthenticate, AiController.fraudCheck);
router.get('/recommendations', optionalAuthenticate, AiController.getRecommendations);

export default router;
