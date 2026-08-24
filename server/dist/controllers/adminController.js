"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const Property_1 = require("../models/Property");
const User_1 = require("../models/User");
const Report_1 = require("../models/Report");
const propertyService_1 = require("../services/propertyService");
const notificationService_1 = require("../services/notificationService");
class AdminController {
    static async getPendingProperties(req, res) {
        try {
            const properties = await Property_1.Property.find({ verificationStatus: 'PENDING' })
                .populate('agentId', 'name email phone agencyName')
                .sort({ createdAt: -1 });
            res.json({ success: true, properties });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getSuspiciousProperties(req, res) {
        try {
            const properties = await Property_1.Property.find({ fraudRiskScore: { $gte: 50 } })
                .populate('agentId', 'name email phone agencyName')
                .sort({ fraudRiskScore: -1 });
            res.json({ success: true, properties });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async approveProperty(req, res) {
        try {
            const { id } = req.params;
            const property = await Property_1.Property.findByIdAndUpdate(id, { $set: { verificationStatus: 'APPROVED' } }, { new: true });
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            await propertyService_1.PropertyService.invalidateCache();
            notificationService_1.NotificationService.sendToUser(property.agentId.toString(), 'property_approved', {
                propertyId: property._id,
                title: property.title,
            });
            res.json({ success: true, message: 'Property approved successfully', property });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async rejectProperty(req, res) {
        try {
            const { id } = req.params;
            const property = await Property_1.Property.findByIdAndUpdate(id, { $set: { verificationStatus: 'REJECTED' } }, { new: true });
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            await propertyService_1.PropertyService.invalidateCache();
            notificationService_1.NotificationService.sendToUser(property.agentId.toString(), 'property_rejected', {
                propertyId: property._id,
                title: property.title,
            });
            res.json({ success: true, message: 'Property rejected', property });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async suspendProperty(req, res) {
        try {
            const { id } = req.params;
            const property = await Property_1.Property.findByIdAndUpdate(id, { $set: { verificationStatus: 'SUSPENDED' } }, { new: true });
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            await propertyService_1.PropertyService.invalidateCache();
            notificationService_1.NotificationService.sendToUser(property.agentId.toString(), 'property_suspended', {
                propertyId: property._id,
                title: property.title,
            });
            res.json({ success: true, message: 'Property suspended due to fraud risk', property });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getUsers(req, res) {
        try {
            const users = await User_1.User.find().select('-password').sort({ createdAt: -1 });
            res.json({ success: true, users });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async verifyAgent(req, res) {
        try {
            const { id } = req.params;
            const user = await User_1.User.findByIdAndUpdate(id, { $set: { isVerified: true } }, { new: true });
            res.json({ success: true, message: 'Agent verification status updated', user });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getReports(req, res) {
        try {
            const reports = await Report_1.Report.find()
                .populate('propertyId', 'title price locality city images')
                .populate('reporterId', 'name email')
                .sort({ createdAt: -1 });
            res.json({ success: true, reports });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AdminController = AdminController;
