import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/properties/pending', AdminController.getPendingProperties);
router.get('/properties/suspicious', AdminController.getSuspiciousProperties);
router.put('/properties/:id/approve', AdminController.approveProperty);
router.put('/properties/:id/reject', AdminController.rejectProperty);
router.put('/properties/:id/suspend', AdminController.suspendProperty);
router.get('/users', AdminController.getUsers);
router.put('/users/:id/verify', AdminController.verifyAgent);
router.get('/reports', AdminController.getReports);

export default router;
