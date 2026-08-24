import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { analyticsService } from '../services/analyticsService';
import { Property, User, AdminAnalytics } from '../types';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle, Users, Building, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [suspiciousProperties, setSuspiciousProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'suspicious' | 'users' | 'analytics'>('pending');

  const fetchData = async () => {
    setLoading(true);
    try {
      const pending = await adminService.getPendingProperties();
      setPendingProperties(pending);

      const suspicious = await adminService.getSuspiciousProperties();
      setSuspiciousProperties(suspicious);

      const userList = await adminService.getUsers();
      setUsers(userList);

      const stats = await analyticsService.getAdminAnalytics();
      setAnalytics(stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveProperty(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.rejectProperty(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await adminService.suspendProperty(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyAgent = async (id: string) => {
    try {
      await adminService.verifyAgent(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center gap-2 mb-4">
        <ShieldAlert className="text-warning" size={28} />
        <div>
          <h2 className="fw-bold text-white mb-0">Platform Governance & Fraud Control</h2>
          <p className="text-secondary small mb-0">Review pending listings, inspect AI anomaly alerts, and manage platform users</p>
        </div>
      </div>

      {/* KPI Cards */}
      {analytics && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-2">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Total Buyers</div>
              <div className="fs-4 fw-bold text-white">{analytics.userCount}</div>
            </div>
          </div>
          <div className="col-6 col-md-2">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Total Agents</div>
              <div className="fs-4 fw-bold text-indigo">{analytics.agentCount}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-panel p-3 text-center">
              <div className="text-secondary small">Total Listings</div>
              <div className="fs-4 fw-bold text-white">{analytics.propertyCount}</div>
            </div>
          </div>
          <div className="col-6 col-md-2">
            <div className="glass-panel p-3 text-center border-warning">
              <div className="text-warning small">Pending Verification</div>
              <div className="fs-4 fw-bold text-warning">{analytics.pendingApprovals}</div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="glass-panel p-3 text-center border-danger">
              <div className="text-danger small">Suspicious / Flagged</div>
              <div className="fs-4 fw-bold text-danger">{analytics.suspiciousListings}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs glass-panel p-1 mb-4 border-secondary">
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'pending' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Verification ({pendingProperties.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'suspicious' ? 'active bg-danger' : ''}`}
            onClick={() => setActiveTab('suspicious')}
          >
            Fraud Alerts ({suspiciousProperties.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link text-white small fw-semibold ${activeTab === 'users' ? 'active bg-primary' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            User Management ({users.length})
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-indigo"></div>
        </div>
      ) : (
        <>
          {activeTab === 'pending' && (
            <div className="table-responsive glass-panel p-3">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom border-secondary text-secondary small">
                    <th>Listing Title</th>
                    <th>Agent</th>
                    <th>Price</th>
                    <th>Locality</th>
                    <th className="text-end">Verification Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingProperties.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4 text-secondary">
                        No pending property listings awaiting approval.
                      </td>
                    </tr>
                  ) : (
                    pendingProperties.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div className="fw-semibold text-white">{p.title}</div>
                          <span className="small text-secondary">{p.bedrooms} BHK | {p.propertyType}</span>
                        </td>
                        <td>{typeof p.agentId === 'object' ? p.agentId.name : 'Agent'}</td>
                        <td className="fw-bold text-indigo">₹{(p.price / 100000).toFixed(1)} Lakhs</td>
                        <td>{p.locality}, {p.city}</td>
                        <td className="text-end">
                          <button onClick={() => handleApprove(p._id)} className="btn btn-sm btn-success me-2">
                            <CheckCircle size={16} me-1 /> Approve
                          </button>
                          <button onClick={() => handleReject(p._id)} className="btn btn-sm btn-outline-danger">
                            <XCircle size={16} me-1 /> Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'suspicious' && (
            <div className="glass-panel p-3">
              <div className="row g-3">
                {suspiciousProperties.length === 0 ? (
                  <div className="text-center py-4 text-secondary">No suspicious fraud risk listings detected.</div>
                ) : (
                  suspiciousProperties.map((p) => (
                    <div key={p._id} className="col-md-6">
                      <div className="p-3 bg-dark rounded border border-danger">
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="fw-bold text-white mb-0">{p.title}</h6>
                          <span className="badge bg-danger">Risk Score: {p.fraudRiskScore}/100</span>
                        </div>
                        <p className="small text-secondary mb-2">Price: ₹{(p.price / 100000).toFixed(1)} Lakhs | Rate: ₹{p.pricePerSqFt}/sq.ft</p>
                        <div className="p-2 mb-3 bg-danger bg-opacity-10 rounded border border-danger small text-danger">
                          <strong>Fraud Risk Reasons:</strong>
                          <ul className="mb-0 ps-3">
                            {p.fraudReasons?.map((r, idx) => <li key={idx}>{r}</li>)}
                          </ul>
                        </div>
                        <div className="d-flex gap-2">
                          <button onClick={() => handleApprove(p._id)} className="btn btn-xs btn-outline-success">
                            Dismiss Risk & Approve
                          </button>
                          <button onClick={() => handleSuspend(p._id)} className="btn btn-xs btn-danger">
                            Suspend Listing
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="table-responsive glass-panel p-3">
              <table className="table table-dark table-hover align-middle mb-0">
                <thead>
                  <tr className="border-bottom border-secondary text-secondary small">
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Agency / Phone</th>
                    <th>Verification</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="fw-semibold text-white">{u.name}</td>
                      <td className="text-secondary">{u.email}</td>
                      <td><span className="badge bg-secondary">{u.role}</span></td>
                      <td className="small text-secondary">{u.agencyName || u.phone || '-'}</td>
                      <td>
                        {u.isVerified ? (
                          <span className="badge bg-success">Verified</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Unverified</span>
                        )}
                      </td>
                      <td className="text-end">
                        {u.role === 'AGENT' && !u.isVerified && (
                          <button onClick={() => handleVerifyAgent(u.id)} className="btn btn-xs btn-outline-success">
                            Verify Agent
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
