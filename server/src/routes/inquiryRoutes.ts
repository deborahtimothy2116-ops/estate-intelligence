import { Router } from 'express';
import { InquiryController } from '../controllers/inquiryController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { inquirySchema } from '../validators/schemas';

const router = Router();

router.get('/', authenticate, InquiryController.getInquiries);
router.post('/', authenticate, validateBody(inquirySchema), InquiryController.createInquiry);
router.put('/:id', authenticate, InquiryController.updateInquiryStatus);

export default router;
