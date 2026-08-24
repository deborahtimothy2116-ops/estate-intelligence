import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, UserPlus, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'BUYER' | 'AGENT'>('BUYER');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register({
        name,
        email,
        password,
        role,
        phone,
        agencyName: role === 'AGENT' ? agencyName : undefined,
      });
      navigate('/properties');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="glass-panel p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="gradient-btn p-3 rounded-circle d-inline-flex mb-2">
                <UserPlus size={32} />
              </div>
              <h3 className="fw-bold text-white mb-1">Create an Account</h3>
              <p className="text-secondary small">Join as a Property Buyer or Registered Real Estate Agent</p>
            </div>

            {error && (
              <div className="alert alert-danger small py-2 d-flex align-items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small text-secondary">Select Your Account Role</label>
                <div className="btn-group w-100">
                  <button
                    type="button"
                    className={`btn ${role === 'BUYER' ? 'gradient-btn' : 'btn-dark text-secondary border-secondary'}`}
                    onClick={() => setRole('BUYER')}
                  >
                    Buyer Account
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === 'AGENT' ? 'gradient-btn' : 'btn-dark text-secondary border-secondary'}`}
                    onClick={() => setRole('AGENT')}
                  >
                    Real Estate Agent
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small text-secondary">Full Name</label>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  placeholder="John Doe"
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
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label small text-secondary">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {role === 'AGENT' && (
                <div className="mb-3">
                  <label className="form-label small text-secondary">Agency / Brokerage Name</label>
                  <input
                    type="text"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Apex Realty Solutions"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="form-label small text-secondary">Password (Min 6 characters)</label>
                <input
                  type="password"
                  className="form-control bg-dark text-white border-secondary"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn gradient-btn w-100 py-2 fw-semibold mb-3" disabled={loading}>
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>

            <div className="text-center small text-secondary">
              Already have an account? <Link to="/login" className="text-indigo text-decoration-none fw-semibold">Sign in here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
