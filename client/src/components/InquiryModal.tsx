import React, { useState } from 'react';
import { Property } from '../types';
import { inquiryService } from '../services/inquiryService';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface InquiryModalProps {
  property: Property | null;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ property, onClose }) => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('Hi, I am interested in this property. Please share additional pricing and site visit details.');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await inquiryService.createInquiry({
        propertyId: property._id,
        name,
        email,
        phone,
        message,
      });
      setSuccessMsg('Inquiry successfully sent! The agent will reach out shortly.');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry.');
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
              <Send className="text-indigo" size={20} /> Contact Listing Agent
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
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
                <label className="form-label small text-secondary">Your Full Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label small text-secondary">Email Address</label>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control bg-dark text-white border-secondary"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Inquiry Message</label>
                <textarea
                  className="form-control bg-dark text-white border-secondary"
                  rows={3}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-light btn-sm" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn gradient-btn btn-sm" disabled={loading}>
                {loading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
