import { Router } from 'express';
import { FavoriteController } from '../controllers/favoriteController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, FavoriteController.getFavorites);
router.post('/:propertyId', authenticate, FavoriteController.addFavorite);
router.delete('/:propertyId', authenticate, FavoriteController.removeFavorite);

export default router;
