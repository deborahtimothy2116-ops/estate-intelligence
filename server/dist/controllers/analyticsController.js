"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const Property_1 = require("../models/Property");
const User_1 = require("../models/User");
const Inquiry_1 = require("../models/Inquiry");
const Appointment_1 = require("../models/Appointment");
class AnalyticsController {
    static async getAgentAnalytics(req, res) {
        try {
            const agentId = req.userId;
            const properties = await Property_1.Property.find({ agentId });
            const totalListings = properties.length;
            let totalViews = 0;
            let totalFavorites = 0;
            properties.forEach((p) => {
                totalViews += p.views || 0;
                totalFavorites += p.favoritesCount || 0;
            });
            const totalInquiries = await Inquiry_1.Inquiry.countDocuments({ agentId });
            const totalAppointments = await Appointment_1.Appointment.countDocuments({ agentId });
            const conversionRate = totalViews > 0 ? ((totalInquiries / totalViews) * 100).toFixed(2) : '0.00';
            const mostViewedProperty = properties.length
                ? properties.reduce((prev, current) => (prev.views > current.views ? prev : current))
                : null;
            const mostFavoritedProperty = properties.length
                ? properties.reduce((prev, current) => (prev.favoritesCount > current.favoritesCount ? prev : current))
                : null;
            // Group properties by locality
            const locationCounts = {};
            properties.forEach((p) => {
                const loc = p.locality || p.city || 'Unknown';
                locationCounts[loc] = (locationCounts[loc] || 0) + 1;
            });
            // Price trends aggregation
            const priceTrends = properties.map((p) => ({
                title: p.title.substring(0, 15) + '...',
                price: p.price,
                views: p.views,
                inquiries: p.inquiriesCount,
            }));
            res.json({
                success: true,
                analytics: {
                    totalListings,
                    totalViews,
                    totalFavorites,
                    totalInquiries,
                    totalAppointments,
                    conversionRate: `${conversionRate}%`,
                    mostViewedProperty,
                    mostFavoritedProperty,
                    popularLocations: locationCounts,
                    priceTrends,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getAdminAnalytics(req, res) {
        try {
            const userCount = await User_1.User.countDocuments({ role: 'BUYER' });
            const agentCount = await User_1.User.countDocuments({ role: 'AGENT' });
            const propertyCount = await Property_1.Property.countDocuments();
            const pendingApprovals = await Property_1.Property.countDocuments({ verificationStatus: 'PENDING' });
            const suspiciousListings = await Property_1.Property.countDocuments({ fraudRiskScore: { $gte: 60 } });
            const propertyTypeDistribution = await Property_1.Property.aggregate([
                { $group: { _id: '$propertyType', count: { $sum: 1 } } },
            ]);
            const verificationStatusDistribution = await Property_1.Property.aggregate([
                { $group: { _id: '$verificationStatus', count: { $sum: 1 } } },
            ]);
            const popularLocations = await Property_1.Property.aggregate([
                { $group: { _id: '$city', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 6 },
            ]);
            res.json({
                success: true,
                analytics: {
                    userCount,
                    agentCount,
                    propertyCount,
                    pendingApprovals,
                    suspiciousListings,
                    propertyTypeDistribution,
                    verificationStatusDistribution,
                    popularLocations,
                },
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
