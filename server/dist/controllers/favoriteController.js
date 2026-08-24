"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteController = void 0;
const Favorite_1 = require("../models/Favorite");
const Property_1 = require("../models/Property");
const Interaction_1 = require("../models/Interaction");
class FavoriteController {
    static async addFavorite(req, res) {
        try {
            const { propertyId } = req.params;
            const userId = req.userId;
            const existing = await Favorite_1.Favorite.findOne({ userId, propertyId });
            if (existing) {
                res.json({ success: true, message: 'Property already in favorites', favorite: existing });
                return;
            }
            const favorite = await Favorite_1.Favorite.create({ userId, propertyId });
            await Property_1.Property.findByIdAndUpdate(propertyId, { $inc: { favoritesCount: 1 } });
            // Track behavioral interaction for recommendation system
            Interaction_1.Interaction.create({
                userId,
                propertyId,
                interactionType: 'FAVORITE',
            }).catch(() => { });
            res.status(201).json({ success: true, message: 'Property added to favorites', favorite });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async removeFavorite(req, res) {
        try {
            const { propertyId } = req.params;
            const userId = req.userId;
            const favorite = await Favorite_1.Favorite.findOneAndDelete({ userId, propertyId });
            if (favorite) {
                await Property_1.Property.findByIdAndUpdate(propertyId, { $inc: { favoritesCount: -1 } });
            }
            res.json({ success: true, message: 'Property removed from favorites' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getFavorites(req, res) {
        try {
            const userId = req.userId;
            const favorites = await Favorite_1.Favorite.find({ userId }).populate({
                path: 'propertyId',
                populate: { path: 'agentId', select: 'name email phone avatar agencyName' },
            });
            res.json({ success: true, favorites });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.FavoriteController = FavoriteController;
