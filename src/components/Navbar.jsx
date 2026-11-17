import React from 'react';
import { IconGraduationCap, IconRefresh } from './Icons';

export default function Navbar({ onRefresh, isConnected, loading }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <div className="navbar-icon-badge">
            <IconGraduationCap className="icon-main" />
          </div>
          <div>
            <h1 className="navbar-title">Sistem Data Siswa</h1>
            <p className="navbar-subtitle">Pengembangan Web FullStack (Express.js + React.js)</p>
          </div>
        </div>

        <div className="navbar-actions">
          <div className={`status-badge ${isConnected ? 'status-connected' : 'status-disconnected'}`}>
            <span className="status-dot"></span>
            <span>{isConnected ? 'Backend Terhubung' : 'Backend Terputus'}</span>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary btn-icon"
            onClick={onRefresh}
            title="Muat Ulang Data"
            disabled={loading}
          >
            <IconRefresh className={loading ? 'spin' : ''} />
            <span className="btn-label">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
