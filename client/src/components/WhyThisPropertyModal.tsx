import React from 'react';
import { RecommendationItem } from '../types';
import { Sparkles, CheckCircle2, X } from 'lucide-react';

interface WhyThisPropertyModalProps {
  recommendation: RecommendationItem | null;
  onClose: () => void;
}

export const WhyThisPropertyModal: React.FC<WhyThisPropertyModalProps> = ({ recommendation, onClose }) => {
  if (!recommendation) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass-panel border-indigo text-white">
          <div className="modal-header border-secondary">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2">
              <Sparkles className="text-indigo" size={20} /> Why This Property? ({recommendation.matchScore}% Match)
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p className="text-secondary small mb-3">
              Our hybrid recommendation engine generated this personalized score by analyzing your behavioral signals, price preferences, and candidate property vectors:
            </p>
            <ul className="list-group list-group-flush bg-transparent">
              {recommendation.explainableReasons.map((reason, idx) => (
                <li key={idx} className="list-group-item bg-transparent text-white border-secondary d-flex align-items-start gap-2 py-2">
                  <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-1" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="modal-footer border-secondary">
            <button type="button" className="btn btn-outline-light btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
