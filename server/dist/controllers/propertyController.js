"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const Property_1 = require("../models/Property");
const propertyService_1 = require("../services/propertyService");
const Interaction_1 = require("../models/Interaction");
const aiIntegrationService_1 = require("../services/aiIntegrationService");
const notificationService_1 = require("../services/notificationService");
class PropertyController {
    static async search(req, res) {
        try {
            const filters = {
                city: req.query.city,
                locality: req.query.locality,
                propertyType: req.query.propertyType,
                listingType: req.query.listingType,
                minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
                maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
                bedrooms: req.query.bedrooms ? Number(req.query.bedrooms) : undefined,
                bathrooms: req.query.bathrooms ? Number(req.query.bathrooms) : undefined,
                minArea: req.query.minArea ? Number(req.query.minArea) : undefined,
                maxArea: req.query.maxArea ? Number(req.query.maxArea) : undefined,
                furnishedStatus: req.query.furnishedStatus,
                constructionStatus: req.query.constructionStatus,
                parking: req.query.parking ? req.query.parking === 'true' : undefined,
                amenities: req.query.amenities ? req.query.amenities.split(',') : undefined,
                lat: req.query.lat ? Number(req.query.lat) : undefined,
                lng: req.query.lng ? Number(req.query.lng) : undefined,
                radiusKm: req.query.radiusKm ? Number(req.query.radiusKm) : undefined,
                verificationStatus: req.query.verificationStatus,
                agentId: req.query.agentId,
                search: req.query.search,
                sortBy: req.query.sortBy,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 12,
            };
            // Record interaction if user is logged in and search term exists
            if (req.userId && filters.search) {
                Interaction_1.Interaction.create({
                    userId: req.userId,
                    interactionType: 'SEARCH',
                    searchQuery: filters.search,
                }).catch(() => { });
            }
            const result = await propertyService_1.PropertyService.searchProperties(filters);
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const property = await propertyService_1.PropertyService.getById(id);
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found.' });
                return;
            }
            // Increment view count asynchronously
            propertyService_1.PropertyService.incrementViews(id).catch(() => { });
            // Record view interaction for recommendation engine
            if (req.userId) {
                Interaction_1.Interaction.create({
                    userId: req.userId,
                    propertyId: property._id,
                    interactionType: 'VIEW',
                    dwellTimeSeconds: req.body.dwellTime || 10,
                }).catch(() => { });
            }
            res.json({ success: true, property });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async create(req, res) {
        try {
            if (!req.userId) {
                res.status(401).json({ success: false, message: 'Unauthorized' });
                return;
            }
            const propertyData = {
                ...req.body,
                agentId: req.userId,
                verificationStatus: 'PENDING',
            };
            // Run AI Fraud / Anomaly check on listing parameters
            const fraudCheckResult = await aiIntegrationService_1.AiIntegrationService.checkFraud(propertyData);
            propertyData.fraudRiskScore = fraudCheckResult.fraudRiskScore || 0;
            propertyData.fraudReasons = fraudCheckResult.reasons || [];
            const property = await Property_1.Property.create(propertyData);
            // Invalidate property search cache
            await propertyService_1.PropertyService.invalidateCache();
            // If fraud risk score is high, notify admins
            if (property.fraudRiskScore >= 70) {
                notificationService_1.NotificationService.sendToRole('ADMIN', 'suspicious_listing_alert', {
                    propertyId: property._id,
                    title: property.title,
                    fraudRiskScore: property.fraudRiskScore,
                    reasons: property.fraudReasons,
                });
            }
            res.status(201).json({
                success: true,
                message: 'Property created successfully and submitted for verification.',
                property,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const property = await Property_1.Property.findById(id);
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            // Check ownership (Agents can only edit their own listings unless ADMIN)
            if (req.userRole !== 'ADMIN' && property.agentId.toString() !== req.userId) {
                res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
                return;
            }
            // Re-run fraud check if price or images updated
            const updatedData = { ...req.body };
            if (updatedData.price || updatedData.images) {
                const check = await aiIntegrationService_1.AiIntegrationService.checkFraud({ ...property.toObject(), ...updatedData });
                updatedData.fraudRiskScore = check.fraudRiskScore;
                updatedData.fraudReasons = check.reasons;
            }
            const updatedProperty = await Property_1.Property.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
            await propertyService_1.PropertyService.invalidateCache();
            res.json({ success: true, message: 'Property updated successfully', property: updatedProperty });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const property = await Property_1.Property.findById(id);
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            if (req.userRole !== 'ADMIN' && property.agentId.toString() !== req.userId) {
                res.status(403).json({ success: false, message: 'Forbidden. You do not own this listing.' });
                return;
            }
            await Property_1.Property.findByIdAndDelete(id);
            await propertyService_1.PropertyService.invalidateCache();
            res.json({ success: true, message: 'Property deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getCompareProperties(req, res) {
        try {
            const { propertyIds } = req.body;
            if (!Array.isArray(propertyIds) || propertyIds.length === 0) {
                res.status(400).json({ success: false, message: 'Array of propertyIds required.' });
                return;
            }
            const properties = await Property_1.Property.find({ _id: { $in: propertyIds } }).populate('agentId', 'name email phone agencyName');
            // Record compare interaction
            if (req.userId) {
                Interaction_1.Interaction.create({
                    userId: req.userId,
                    interactionType: 'COMPARE',
                    metadata: { propertyIds },
                }).catch(() => { });
            }
            res.json({ success: true, properties });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.PropertyController = PropertyController;
