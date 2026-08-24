import React, { useState, useEffect } from 'react';
import { propertyService } from '../services/propertyService';
import { inquiryService } from '../services/inquiryService';
import { appointmentService } from '../services/appointmentService';
import { analyticsService } from '../services/analyticsService';
import { Property, Inquiry, Appointment, AgentAnalytics } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit, Trash2, ShieldAlert, BarChart3, Building, MessageSquare, Calendar, CheckCircle2, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [analytics, setAnalytics] = useState<AgentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'inquiries' | 'appointments' | 'analytics'>('listings');

  // Create Property Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: 'Apartment',
    listingType: 'Sale',
    price: 7500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 1500,
    address: '',
    city: 'Chennai',
    locality: 'OMR',
    latitude: 12.9348,
    longitude: 80.2321,
    images: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
    amenities: 'Gymnasium, Swimming Pool, 24x7 Security, Power Backup',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user) {
        const propData = await propertyService.searchProperties({ agentId: user.id });
        setProperties(propData.properties);

        const inqData = await inquiryService.getInquiries();
        setInquiries(inqData);

        const apptData = await appointmentService.getAppointments();
        setAppointments(apptData);

        const statsData = await analyticsService.getAgentAnalytics();
        setAnalytics(statsData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
        amenities: formData.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await propertyService.createProperty(payload);
      setShowCreateModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create listing');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this property listing?')) return;
    try {
      await propertyService.deleteProperty(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInquiry = async (id: string, status: string) => {
    try {
      await inquiryService.updateStatus(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppointment = async (id: string, status: string) => {
    try {
      await appointmentService.updateStatus(id, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-white mb-1">Agent Control Center</h2>
          <p className="text-secondary small mb-0">Manage listings, buyer inquiries, visit schedules & listing performance</p>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn gradient-btn d-flex align-items-center gap-2">
          <Plus size={18} /> Post New Listing
        </button>
      </div>

      {/* KPI Cards Header */}
      {analytics && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Total Listings</div>
              <div className="fs-3 fw-bold text-white">{analytics.totalListings}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Total Views</div>
              <div className="fs-3 fw-bold text-indigo">{analytics.totalViews}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Total Inquiries</div>
              <div className="fs-3 fw-bold text-success">{analytics.totalInquiries}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Conversion Rate</div>
              <div className="fs-3 fw-bold text-warning">{analytics.conversionRate}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs glass-panel p-1 mb-4 border-secondary">
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'listings' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            <Building size={16} className="me-1" /> My Listings ({properties.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'inquiries' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <MessageSquare size={16} className="me-1" /> Inquiries ({inquiries.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'appointments' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <Calendar size={16} className="me-1" /> Appointments ({appointments.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'analytics' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 size={16} className="me-1" /> Performance Analytics
          </button>
        </li>
      </ul>

      {/* Tab Contents */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-indigo"></div>
        </div>
      ) : (
        <>
          {activeTab === 'listings' && (
            <div className="table-responsive glass-panel p-3">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom border-secondary text-secondary small">
                    <th>Property Title</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Fraud Risk</th>
                    <th>Views</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <div className="fw-semibold text-white">{p.title}</div>
                        <span className="small text-secondary">{p.bedrooms} BHK | {p.propertyType}</span>
                      </td>
                      <td>{p.locality}, {p.city}</td>
                      <td className="fw-bold text-indigo">₹{(p.price / 100000).toFixed(1)} Lakhs</td>
                      <td>
                        <span className={`badge ${p.verificationStatus === 'APPROVED' ? 'bg-success' : 'bg-warning'}`}>
                          {p.verificationStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${p.fraudRiskScore >= 50 ? 'bg-danger' : 'bg-secondary'}`}>
                          {p.fraudRiskScore}/100
                        </span>
                      </td>
                      <td>{p.views}</td>
                      <td className="text-end">
                        <button onClick={() => handleDeleteProperty(p._id)} className="btn btn-sm btn-outline-danger p-1">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="glass-panel p-3">
              <div className="row g-3">
                {inquiries.map((inq) => (
                  <div key={inq._id} className="col-md-6">
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold text-white mb-0">{inq.name}</h6>
                        <span className="badge bg-primary">{inq.status}</span>
                      </div>
                      <p className="small text-secondary mb-1">Email: {inq.email} | Phone: {inq.phone}</p>
                      <p className="small text-white-50 mb-2">"{inq.message}"</p>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleUpdateInquiry(inq._id, 'CONTACTED')} className="btn btn-xs btn-outline-success">
                          Mark Contacted
                        </button>
                        <button onClick={() => handleUpdateInquiry(inq._id, 'RESOLVED')} className="btn btn-xs btn-outline-primary">
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="glass-panel p-3">
              <div className="row g-3">
                {appointments.map((appt) => (
                  <div key={appt._id} className="col-md-6">
                    <div className="p-3 bg-dark rounded border border-secondary">
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold text-white mb-0">Visit on {new Date(appt.date).toLocaleDateString()}</h6>
                        <span className="badge bg-info">{appt.status}</span>
                      </div>
                      <p className="small text-indigo mb-1">Time Slot: {appt.timeSlot}</p>
                      <p className="small text-secondary mb-2">Notes: {appt.notes || 'No special instructions'}</p>
                      <div className="d-flex gap-2">
                        <button onClick={() => handleUpdateAppointment(appt._id, 'CONFIRMED')} className="btn btn-xs btn-success">
                          Confirm Visit
                        </button>
                        <button onClick={() => handleUpdateAppointment(appt._id, 'CANCELLED')} className="btn btn-xs btn-outline-danger">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && analytics && (
            <div className="glass-panel p-4">
              <h5 className="fw-bold text-white mb-3">Listing Performance Trends</h5>
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.priceTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="title" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569' }} />
                    <Bar dataKey="views" fill="#6366f1" name="Views" />
                    <Bar dataKey="inquiries" fill="#10b981" name="Inquiries" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal to Create New Property */}
      {showCreateModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content glass-panel border-secondary text-white">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Post New Property Listing</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateProperty}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Property Title</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Type</label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      >
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Independent House">Independent House</option>
                        <option value="Commercial Property">Commercial Property</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Price (₹)</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small text-secondary">Super Area (sq.ft)</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                        required
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Bedrooms (BHK)</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Bathrooms</label>
                      <input
                        type="number"
                        className="form-control bg-dark text-white border-secondary"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">City</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small text-secondary">Locality</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-white border-secondary"
                        required
                        value={formData.locality}
                        onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Full Address</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Image URLs (comma separated)</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-white border-secondary"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Description</label>
                    <textarea
                      className="form-control bg-dark text-white border-secondary"
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" className="btn btn-outline-light btn-sm" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn gradient-btn btn-sm">
                    Submit Property Listing
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
