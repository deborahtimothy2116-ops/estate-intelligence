import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Property } from '../models/Property';
import { User } from '../models/User';
import { Report } from '../models/Report';
import { PropertyService } from '../services/propertyService';
import { NotificationService } from '../services/notificationService';

export class AdminController {
  static async getPendingProperties(req: AuthRequest, res: Response): Promise<void> {
    try {
      const properties = await Property.find({ verificationStatus: 'PENDING' })
        .populate('agentId', 'name email phone agencyName')
        .sort({ createdAt: -1 });

      res.json({ success: true, properties });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getSuspiciousProperties(req: AuthRequest, res: Response): Promise<void> {
    try {
      const properties = await Property.find({ fraudRiskScore: { $gte: 50 } })
        .populate('agentId', 'name email phone agencyName')
        .sort({ fraudRiskScore: -1 });

      res.json({ success: true, properties });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async approveProperty(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await Property.findByIdAndUpdate(
        id,
        { $set: { verificationStatus: 'APPROVED' } },
        { new: true }
      );

      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      await PropertyService.invalidateCache();
      NotificationService.sendToUser(property.agentId.toString(), 'property_approved', {
        propertyId: property._id,
        title: property.title,
      });

      res.json({ success: true, message: 'Property approved successfully', property });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async rejectProperty(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await Property.findByIdAndUpdate(
        id,
        { $set: { verificationStatus: 'REJECTED' } },
        { new: true }
      );

      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      await PropertyService.invalidateCache();
      NotificationService.sendToUser(property.agentId.toString(), 'property_rejected', {
        propertyId: property._id,
        title: property.title,
      });

      res.json({ success: true, message: 'Property rejected', property });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async suspendProperty(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await Property.findByIdAndUpdate(
        id,
        { $set: { verificationStatus: 'SUSPENDED' } },
        { new: true }
      );

      if (!property) {
        res.status(404).json({ success: false, message: 'Property not found' });
        return;
      }

      await PropertyService.invalidateCache();
      NotificationService.sendToUser(property.agentId.toString(), 'property_suspended', {
        propertyId: property._id,
        title: property.title,
      });

      res.json({ success: true, message: 'Property suspended due to fraud risk', property });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json({ success: true, users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async verifyAgent(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(id, { $set: { isVerified: true } }, { new: true });
      res.json({ success: true, message: 'Agent verification status updated', user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getReports(req: AuthRequest, res: Response): Promise<void> {
    try {
      const reports = await Report.find()
        .populate('propertyId', 'title price locality city images')
        .populate('reporterId', 'name email')
        .sort({ createdAt: -1 });

      res.json({ success: true, reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
