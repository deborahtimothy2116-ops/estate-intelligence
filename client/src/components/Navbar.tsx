import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { Building2, Search, Heart, GitCompare, MessageSquare, Sun, Moon, LogOut, User as UserIcon, ShieldAlert, BarChart3 } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-nav px-3 py-2">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand d-flex align-items-center text-white fw-bold">
          <div className="p-2 rounded-3 me-2 gradient-btn d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
            <Building2 size={24} />
          </div>
          <span>Estate<span className="gradient-text">Intel</span></span>
        </Link>

        <button className="navbar-toggler border-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-center">
            <li className="nav-item">
              <Link to="/properties" className="nav-link text-white-50 d-flex align-items-center gap-1 fw-medium">
                <Search size={16} /> Search Listings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/compare" className="nav-link text-white-50 d-flex align-items-center gap-1 fw-medium">
                <GitCompare size={16} /> Compare
              </Link>
            </li>
            {user && user.role === 'BUYER' && (
              <li className="nav-item">
                <Link to="/favorites" className="nav-link text-white-50 d-flex align-items-center gap-1 fw-medium">
                  <Heart size={16} /> Saved Favorites
                </Link>
              </li>
            )}
            {user && (user.role === 'AGENT' || user.role === 'ADMIN') && (
              <li className="nav-item">
                <Link to="/agent/dashboard" className="nav-link text-white-50 d-flex align-items-center gap-1 fw-medium">
                  <BarChart3 size={16} /> Agent Workspace
                </Link>
              </li>
            )}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link text-warning d-flex align-items-center gap-1 fw-medium">
                  <ShieldAlert size={16} /> Admin Portal
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm btn-outline-secondary text-white rounded-circle p-2" onClick={toggleTheme} title="Toggle Dark/Light Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user ? (
              <>
                <Link to="/chat" className="btn btn-sm btn-outline-light position-relative d-flex align-items-center gap-1">
                  <MessageSquare size={18} /> Chat
                  {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="dropdown">
                  <button className="btn btn-sm glass-panel text-white dropdown-toggle d-flex align-items-center gap-2" type="button" data-bs-toggle="dropdown">
                    <UserIcon size={16} />
                    <span className="fw-semibold">{user.name}</span>
                    <span className="badge bg-secondary ms-1">{user.role}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end glass-panel border-secondary text-white">
                    <li><div className="dropdown-header text-secondary">Signed in as {user.email}</div></li>
                    <li><hr className="dropdown-divider border-secondary" /></li>
                    <li>
                      <button className="dropdown-item text-danger d-flex align-items-center gap-2" onClick={handleLogout}>
                        <LogOut size={16} /> Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-sm btn-outline-light">Sign In</Link>
                <Link to="/register" className="btn btn-sm gradient-btn">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
