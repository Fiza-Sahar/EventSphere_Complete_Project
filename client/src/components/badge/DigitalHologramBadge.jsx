import React, { useState } from 'react';
import { QrCode, Sparkles, Shield, X, Download, Share2, Award, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DigitalHologramBadge = ({ isOpen, onClose, user = { name: 'VIP Delegate', email: 'delegate@eventsphere.com', role: 'attendee' } }) => {
  const { isNeon } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const passId = `EVT-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(passId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        backdropFilter: 'blur(10px)',
        zIndex: 2000 
      }}
      onClick={onClose}
    >
      <div 
        className="glass-card p-4 p-md-5 shadow-lg position-relative animate-fade-in"
        style={{ 
          maxWidth: '440px', 
          width: '100%',
          borderRadius: '28px',
          border: isNeon ? '2px solid rgba(0, 255, 136, 0.5)' : '2px solid rgba(37, 211, 102, 0.4)',
          background: isNeon 
            ? 'linear-gradient(145deg, #091710 0%, #050d09 100%)' 
            : 'linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%)',
          boxShadow: isNeon 
            ? '0 0 50px rgba(0, 255, 136, 0.35)' 
            : '0 20px 50px rgba(37, 211, 102, 0.25)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn btn-sm position-absolute top-0 end-0 m-3 p-1 rounded-circle"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>

        {/* Lanyard Slot Design */}
        <div className="mx-auto mb-4 rounded-pill" style={{ width: '60px', height: '6px', background: isNeon ? '#00ff88' : '#128c7e', opacity: 0.6 }}></div>

        {/* Badge Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center gap-2">
            <Award className="text-primary" size={24} />
            <div>
              <span className="fw-extrabold fs-5 lh-1 d-block" style={{ color: 'var(--heading-color)' }}>
                EVENT<span className="text-gradient">SPHERE</span>
              </span>
              <span className="text-muted" style={{ fontSize: '9px', letterSpacing: '0.1em', fontWeight: 700 }}>
                VIP ACCESS PASS
              </span>
            </div>
          </div>
          <span className="badge btn-primary-custom px-3 py-1.5 rounded-pill text-uppercase" style={{ fontSize: '10px' }}>
            ALL ACCESS
          </span>
        </div>

        {/* Holographic QR Code Card */}
        <div 
          className="p-4 rounded-4 text-center my-3 position-relative overflow-hidden shadow-sm"
          style={{ 
            background: isNeon ? '#040906' : '#ffffff',
            border: isNeon ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* Hologram Shimmer Line */}
          <div 
            className="position-absolute w-100 h-100 top-0 start-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
              animation: 'shimmer 2.5s infinite'
            }}
          />

          {/* QR Code SVG Graphic */}
          <div className="d-inline-block p-3 rounded-3 bg-white shadow-sm mb-3">
            <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="white"/>
              {/* Corner Targets */}
              <rect x="5" y="5" width="26" height="26" stroke="#111827" strokeWidth="4" fill="none"/>
              <rect x="11" y="11" width="14" height="14" fill="#111827"/>
              <rect x="69" y="5" width="26" height="26" stroke="#111827" strokeWidth="4" fill="none"/>
              <rect x="75" y="11" width="14" height="14" fill="#111827"/>
              <rect x="5" y="69" width="26" height="26" stroke="#111827" strokeWidth="4" fill="none"/>
              <rect x="11" y="75" width="14" height="14" fill="#111827"/>
              {/* Data Pattern */}
              <rect x="36" y="8" width="6" height="6" fill="#10b981"/>
              <rect x="46" y="8" width="6" height="6" fill="#111827"/>
              <rect x="56" y="8" width="6" height="6" fill="#10b981"/>
              <rect x="36" y="24" width="26" height="6" fill="#111827"/>
              <rect x="8" y="36" width="26" height="6" fill="#111827"/>
              <rect x="68" y="36" width="26" height="6" fill="#10b981"/>
              <rect x="38" y="38" width="24" height="24" fill="#111827"/>
              <rect x="44" y="44" width="12" height="12" fill="#10b981"/>
              <rect x="8" y="48" width="12" height="12" fill="#10b981"/>
              <rect x="24" y="48" width="6" height="12" fill="#111827"/>
              <rect x="70" y="48" width="22" height="6" fill="#111827"/>
              <rect x="70" y="58" width="10" height="6" fill="#10b981"/>
              <rect x="36" y="68" width="18" height="6" fill="#111827"/>
              <rect x="58" y="68" width="34" height="6" fill="#10b981"/>
              <rect x="36" y="78" width="28" height="6" fill="#10b981"/>
              <rect x="68" y="78" width="12" height="14" fill="#111827"/>
              <rect x="36" y="88" width="14" height="6" fill="#111827"/>
            </svg>
          </div>

          <div className="fw-bold font-monospace small" style={{ color: 'var(--heading-color)' }}>
            {passId}
          </div>
          <div className="text-success small d-flex align-items-center justify-content-center gap-1 mt-1 font-monospace">
            <CheckCircle2 size={13} />
            Cryptographically Verified Pass
          </div>
        </div>

        {/* Delegate Details */}
        <div className="p-3 rounded-3 mb-3" style={{ background: 'var(--bg-subtle)' }}>
          <div className="fw-bold fs-6" style={{ color: 'var(--heading-color)' }}>{user.name}</div>
          <div className="text-muted small mb-2">{user.email}</div>
          <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-subtle)', fontSize: '11px' }}>
            <span className="text-muted">Venue: Silicon Valley Convention Hall</span>
            <span className="fw-bold text-primary">Booth Fast-Pass</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <button 
            onClick={handleCopy}
            className="btn btn-outline-custom flex-grow-1 btn-sm py-2 d-flex align-items-center justify-content-center gap-1.5"
          >
            {copied ? <CheckCircle2 size={14} className="text-success" /> : <QrCode size={14} />}
            <span>{copied ? 'Copied ID' : 'Copy Pass ID'}</span>
          </button>
          <button 
            onClick={() => alert('Digital Pass saved to your wallet!')}
            className="btn btn-primary-custom flex-grow-1 btn-sm py-2 d-flex align-items-center justify-content-center gap-1.5"
          >
            <Download size={14} />
            <span>Save Wallet Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalHologramBadge;
