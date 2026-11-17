import React from 'react';
import { IconCheckCircle, IconAlertCircle, IconClose } from './Icons';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`toast-container ${isSuccess ? 'toast-success' : 'toast-error'}`}>
      <div className="toast-icon">
        {isSuccess ? <IconCheckCircle /> : <IconAlertCircle />}
      </div>
      <div className="toast-message">
        <span>{toast.message}</span>
      </div>
      <button type="button" className="toast-close" onClick={onClose}>
        <IconClose className="w-4 h-4" />
      </button>
    </div>
  );
}
