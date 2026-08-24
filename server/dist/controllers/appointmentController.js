"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const Appointment_1 = require("../models/Appointment");
const Property_1 = require("../models/Property");
const Interaction_1 = require("../models/Interaction");
const notificationService_1 = require("../services/notificationService");
class AppointmentController {
    static async scheduleAppointment(req, res) {
        try {
            const { propertyId, date, timeSlot, notes } = req.body;
            const buyerId = req.userId;
            const property = await Property_1.Property.findById(propertyId);
            if (!property) {
                res.status(404).json({ success: false, message: 'Property not found' });
                return;
            }
            const appointmentDate = new Date(date);
            const startOfDay = new Date(appointmentDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(appointmentDate);
            endOfDay.setHours(23, 59, 59, 999);
            // Check for overlapping / duplicate appointment bookings
            const existing = await Appointment_1.Appointment.findOne({
                propertyId,
                date: { $gte: startOfDay, $lte: endOfDay },
                timeSlot,
                status: { $in: ['PENDING', 'CONFIRMED'] },
            });
            if (existing) {
                res.status(400).json({
                    success: false,
                    message: 'Selected time slot is already booked for this property. Please select another slot.',
                });
                return;
            }
            const appointment = await Appointment_1.Appointment.create({
                propertyId,
                buyerId,
                agentId: property.agentId,
                date: appointmentDate,
                timeSlot,
                notes: notes || '',
                status: 'PENDING',
            });
            // Behavioral signal
            Interaction_1.Interaction.create({
                userId: buyerId,
                propertyId,
                interactionType: 'APPOINTMENT',
            }).catch(() => { });
            // Notify agent
            notificationService_1.NotificationService.sendToUser(property.agentId.toString(), 'new_appointment', {
                appointmentId: appointment._id,
                propertyTitle: property.title,
                date: appointment.date,
                timeSlot: appointment.timeSlot,
            });
            res.status(201).json({ success: true, message: 'Visit scheduled successfully', appointment });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getAppointments(req, res) {
        try {
            const userId = req.userId;
            const role = req.userRole;
            const filter = role === 'AGENT' ? { agentId: userId } : { buyerId: userId };
            const appointments = await Appointment_1.Appointment.find(filter)
                .populate('propertyId', 'title address city locality images')
                .populate('buyerId', 'name email phone avatar')
                .populate('agentId', 'name email phone agencyName')
                .sort({ date: 1 });
            res.json({ success: true, appointments });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async updateAppointmentStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const appointment = await Appointment_1.Appointment.findById(id);
            if (!appointment) {
                res.status(404).json({ success: false, message: 'Appointment not found' });
                return;
            }
            if (req.userRole !== 'ADMIN' && appointment.agentId.toString() !== req.userId && appointment.buyerId.toString() !== req.userId) {
                res.status(403).json({ success: false, message: 'Unauthorized to modify this appointment' });
                return;
            }
            appointment.status = status;
            await appointment.save();
            // Notify recipient
            const notifyUserId = req.userId === appointment.agentId.toString()
                ? appointment.buyerId.toString()
                : appointment.agentId.toString();
            notificationService_1.NotificationService.sendToUser(notifyUserId, 'appointment_status_updated', {
                appointmentId: appointment._id,
                status,
            });
            res.json({ success: true, message: `Appointment status updated to ${status}`, appointment });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AppointmentController = AppointmentController;
