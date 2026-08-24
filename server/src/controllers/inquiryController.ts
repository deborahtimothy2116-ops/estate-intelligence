import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Inquiry } from '../models/Inquiry';
import { Property } from '../models/Property';
import { Interaction } from '../models/Interaction';
import { NotificationService } from '../services/notificationService';

export class InquiryController {
  static async createInquiry(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { propertyId, name, email, phone, preferredVisitDate, message } = req.body;
      const buyerId = req.userId!;

      const property = await Property.findById(propertyId);
      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      const inquiry = await Inquiry.create({
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

      await Property.findByIdAndUpdate(propertyId, { $inc: { inquiriesCount: 1 } });

      // Interaction tracking
      Interaction.create({
        userId: buyerId,
        propertyId,
        interactionType: 'INQUIRY',
      }).catch(() => {});

      // Real-time WebSocket notification to agent
      NotificationService.sendToUser(property.agentId.toString(), 'new_inquiry', {
        inquiryId: inquiry._id,
        propertyTitle: property.title,
        buyerName: name,
        message,
      });

      res.status(201).json({ success: true, message: 'Inquiry submitted successfully', inquiry });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getInquiries(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const role = req.userRole;

      const filter = role === 'AGENT' ? { agentId: userId } : { buyerId: userId };
      const inquiries = await Inquiry.find(filter)
        .populate('propertyId', 'title price locality city images')
        .populate('buyerId', 'name email phone avatar')
        .populate('agentId', 'name email phone agencyName')
        .sort({ createdAt: -1 });

      res.json({ success: true, inquiries });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateInquiryStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const inquiry = await Inquiry.findById(id);

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
      NotificationService.sendToUser(inquiry.buyerId.toString(), 'inquiry_status_updated', {
        inquiryId: inquiry._id,
        status,
      });

      res.json({ success: true, message: 'Inquiry status updated', inquiry });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
