import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Favorite } from '../models/Favorite';
import { Property } from '../models/Property';
import { Interaction } from '../models/Interaction';

export class FavoriteController {
  static async addFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      const userId = req.userId!;

      const existing = await Favorite.findOne({ userId, propertyId });
      if (existing) {
        res.json({ success: true, message: 'Property already in favorites', favorite: existing });
        return;
      }

      const favorite = await Favorite.create({ userId, propertyId });
      await Property.findByIdAndUpdate(propertyId, { $inc: { favoritesCount: 1 } });

      // Track behavioral interaction for recommendation system
      Interaction.create({
        userId,
        propertyId,
        interactionType: 'FAVORITE',
      }).catch(() => {});

      res.status(201).json({ success: true, message: 'Property added to favorites', favorite });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async removeFavorite(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { propertyId } = req.params;
      const userId = req.userId!;

      const favorite = await Favorite.findOneAndDelete({ userId, propertyId });
      if (favorite) {
        await Property.findByIdAndUpdate(propertyId, { $inc: { favoritesCount: -1 } });
      }

      res.json({ success: true, message: 'Property removed from favorites' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getFavorites(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const favorites = await Favorite.find({ userId }).populate({
        path: 'propertyId',
        populate: { path: 'agentId', select: 'name email phone avatar agencyName' },
      });

      res.json({ success: true, favorites });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
