import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authenticate } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validationMiddleware';
import { appointmentSchema } from '../validators/schemas';

const router = Router();

router.get('/', authenticate, AppointmentController.getAppointments);
router.post('/', authenticate, validateBody(appointmentSchema), AppointmentController.scheduleAppointment);
router.put('/:id', authenticate, AppointmentController.updateAppointmentStatus);

export default router;
