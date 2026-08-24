"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiryController = void 0;
const Inquiry_1 = require("../models/Inquiry");
const Property_1 = require("../models/Property");
const Interaction_1 = require("../models/Interaction");
const notificationService_1 = require("../services/notificationService");
class InquiryController {
    static async createInquiry(req, res) {
        try {
            const { propertyId, name, email, phone, preferredVisitDate, message } = req.body;
            const buyerId = req.userId;
            const property = await Property_1.Property.findById(propertyId);
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            const inquiry = await Inquiry_1.Inquiry.create({
                propertyId,
                buyerId,
                agentId: property.agentId,
                name,
                email,
                phone,
                preferredVisitDate: preferredVisitDate ? new Date(preferredVisitDate) : undefined,
                message,
                status: 'PENDING',
            });
            await Property_1.Property.findByIdAndUpdate(propertyId, { $inc: { inquiriesCount: 1 } });
            // Interaction tracking
            Interaction_1.Interaction.create({
                userId: buyerId,
                propertyId,
                interactionType: 'INQUIRY',
            }).catch(() => { });
            // Real-time WebSocket notification to agent
            notificationService_1.NotificationService.sendToUser(property.agentId.toString(), 'new_inquiry', {
                inquiryId: inquiry._id,
                propertyTitle: property.title,
                buyerName: name,
                message,
            });
            res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getInquiries(req, res) {
        try {
            const userId = req.userId;
            const role = req.userRole;
            const filter = role === 'AGENT' ? { agentId: userId } : { buyerId: userId };
            const inquiries = await Inquiry_1.Inquiry.find(filter)
                .populate('propertyId', 'title price locality city images')
                .populate('buyerId', 'name email phone avatar')
                .populate('agentId', 'name email phone agencyName')
                .sort({ createdAt: -1 });
            res.json({ success: true, inquiries });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async updateInquiryStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const inquiry = await Inquiry_1.Inquiry.findById(id);
            if (!inquiry) {
                res.status(404).json({ success: false, message: 'Inquiry not found' });
                return;
            }
            if (req.userRole !== 'ADMIN' && inquiry.agentId.toString() !== req.userId) {
                res.status(403).json({ success: false, message: 'Unauthorized to update this inquiry' });
                return;
            }
            inquiry.status = status;
            await inquiry.save();
            // Notify buyer of status update
            notificationService_1.NotificationService.sendToUser(inquiry.buyerId.toString(), 'inquiry_status_updated', {
                inquiryId: inquiry._id,
                status,
            });
            res.json({ success: true, message: 'Inquiry status updated', inquiry });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.InquiryController = InquiryController;
