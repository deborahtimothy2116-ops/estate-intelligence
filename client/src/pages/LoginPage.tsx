import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogIn, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email, password });
      navigate('/properties');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="glass-panel p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="gradient-btn p-3 rounded-circle d-inline-flex mb-2">
                <Building2 size={32} />
              </div>
              <h3 className="fw-bold text-white mb-1">Sign In to EstateIntel</h3>
              <p className="text-secondary small">Access AI recommendations, valuation tools & dashboard</p>
            </div>

            {error && (
              <div className="alert alert-danger small py-2 d-flex align-items-center gap-2">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
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

              <div className="mb-4">
                <label className="form-label small text-secondary">Password</label>
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
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            <div className="p-3 bg-dark rounded border border-secondary mb-3">
              <span className="small text-secondary fw-semibold d-block mb-2">Quick Demo One-Click Sign In:</span>
              <div className="d-flex flex-wrap gap-1">
                <button type="button" className="btn btn-xs btn-outline-light" onClick={() => setDemoUser('buyer@estateintel.com')}>
                  Buyer Demo
                </button>
                <button type="button" className="btn btn-xs btn-outline-light" onClick={() => setDemoUser('agent@estateintel.com')}>
                  Agent Demo
                </button>
                <button type="button" className="btn btn-xs btn-outline-warning" onClick={() => setDemoUser('admin@estateintel.com')}>
                  Admin Demo
                </button>
              </div>
            </div>

            <div className="text-center small text-secondary">
              Don't have an account? <Link to="/register" className="text-indigo text-decoration-none fw-semibold">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
