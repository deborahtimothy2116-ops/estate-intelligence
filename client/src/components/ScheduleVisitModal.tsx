import React, { useState } from 'react';
import { Property } from '../types';
import { appointmentService } from '../services/appointmentService';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface ScheduleVisitModalProps {
  property: Property | null;
  onClose: () => void;
}

export const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ property, onClose }) => {
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 11:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!property) return null;

  const timeSlots = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '02:00 PM - 03:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await appointmentService.scheduleAppointment({
        propertyId: property._id,
        date,
        timeSlot,
        notes,
      });
      setSuccessMsg('Property visit successfully scheduled! The agent has been notified.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to schedule visit. Duplicate time slot may exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-panel border-secondary text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Calendar className="text-indigo" size={20} /> Schedule Property Visit
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="p-2 mb-3 bg-dark rounded border border-secondary d-flex gap-2 align-items-center">
                <img
                  src={property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'}
                  alt={property.title}
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }}
                />
                <div>
                  <h6 className="fw-semibold text-white mb-0">{property.title}</h6>
                  <span className="small text-indigo">₹{(property.price / 100000).toFixed(1)} Lakhs | {property.locality}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="alert alert-danger small py-2 d-flex align-items-center gap-2">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="alert alert-success small py-2 d-flex align-items-center gap-2">
                  <CheckCircle2 size={16} /> {successMsg}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small text-secondary">Preferred Date</label>
                <input
                  type="date"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Available Time Slot</label>
                <select
                  className="form-select bg-dark text-white border-secondary"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Notes for Agent (Optional)</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows={2}
                  placeholder="e.g. Please bring floor plan copies"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-light btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn gradient-btn btn-sm" disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
