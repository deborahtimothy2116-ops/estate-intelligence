import React from 'react';
import { useSocket } from '../context/SocketContext';
import { X, Bell } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useSocket();

  if (toasts.length === 0) return null;

  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      {toasts.map((toast) => (
        <div key={toast.id} className="toast show glass-panel mb-2 text-white border border-secondary shadow-lg" style={{ minWidth: 280 }}>
          <div className="toast-header bg-dark text-white border-secondary d-flex justify-content-between">
            <span className="fw-bold d-flex align-items-center gap-1">
              <Bell size={14} className="text-indigo" /> {toast.title}
            </span>
            <button type="button" className="btn-close btn-close-white" onClick={() => removeToast(toast.id)}></button>
          </div>
          <div className="toast-body small text-white-50">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
