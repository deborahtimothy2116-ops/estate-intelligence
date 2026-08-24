import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.get('/agent', authenticate, authorize('AGENT', 'ADMIN'), AnalyticsController.getAgentAnalytics);
router.get('/admin', authenticate, authorize('ADMIN'), AnalyticsController.getAdminAnalytics);

export default router;
