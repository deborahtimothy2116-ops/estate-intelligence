import React from 'react';
import { Building2, ShieldCheck, Sparkles, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-nav mt-5 py-4 border-top border-secondary text-secondary">
      <div className="container">
        <div className="row gy-4">
          <div className="col-lg-4">
            <div className="d-flex align-items-center gap-2 mb-2 text-white fw-bold fs-5">
              <Building2 className="text-indigo" size={24} />
              <span>Estate<span className="gradient-text">Intel</span></span>
            </div>
            <p className="small mb-0">
              Next-generation AI real estate intelligence platform powering smart property searches, machine learning price valuations, hybrid recommendation engines, and automated listing anomaly detection.
            </p>
          </div>
          <div className="col-md-4 col-lg-2">
            <h6 className="text-white fw-semibold mb-3">Platform</h6>
            <ul className="list-unstyled small">
              <li className="mb-2"><a href="/properties" className="text-secondary text-decoration-none">Search Properties</a></li>
              <li className="mb-2"><a href="/compare" className="text-secondary text-decoration-none">Compare Properties</a></li>
              <li className="mb-2"><a href="/favorites" className="text-secondary text-decoration-none">Saved Properties</a></li>
            </ul>
          </div>
          <div className="col-md-4 col-lg-3">
            <h6 className="text-white fw-semibold mb-3">AI & Analytics</h6>
            <ul className="list-unstyled small">
              <li className="mb-2 d-flex align-items-center gap-2"><Sparkles size={14} /> XGBoost Valuation Engine</li>
              <li className="mb-2 d-flex align-items-center gap-2"><Cpu size={14} /> NLP Search Parser</li>
              <li className="mb-2 d-flex align-items-center gap-2"><ShieldCheck size={14} /> Anomaly & Fraud Guard</li>
            </ul>
          </div>
          <div className="col-md-4 col-lg-3">
            <h6 className="text-white fw-semibold mb-3">System Health</h6>
            <p className="small mb-2 text-success d-flex align-items-center gap-2">
              <span className="spinner-grow spinner-grow-sm text-success"></span> API Gateway & AI Microservice Operational
            </p>
            <span className="badge bg-dark border border-secondary text-secondary">v1.0.0 Production Build</span>
          </div>
        </div>
        <hr className="my-4 border-secondary" />
        <div className="text-center small">
          © {new Date().getFullYear()} AI Real Estate Intelligence Platform. Developed with React, Node.js, Mongoose, Socket.IO & Python FastAPI.
        </div>
      </div>
    </footer>
  );
};
