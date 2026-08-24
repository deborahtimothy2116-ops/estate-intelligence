import { Router } from 'express';
import { PropertyController } from '../controllers/propertyController';
import { authenticate, optionalAuthenticate } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { propertyCreateSchema } from '../validators/schemas';

const router = Router();

router.get('/', optionalAuthenticate, PropertyController.search);
router.post('/compare', optionalAuthenticate, PropertyController.getCompareProperties);
router.get('/:id', optionalAuthenticate, PropertyController.getById);

// Protected Agent/Admin routes
router.post('/', authenticate, authorize('AGENT', 'ADMIN'), validateBody(propertyCreateSchema), PropertyController.create);
router.put('/:id', authenticate, authorize('AGENT', 'ADMIN'), PropertyController.update);
router.delete('/:id', authenticate, authorize('AGENT', 'ADMIN'), PropertyController.delete);

export default router;
