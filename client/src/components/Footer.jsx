import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Mail, Phone, MapPin } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isNeon } = useTheme();

  return (
    <footer className="mt-5 border-top" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
      <div className="container py-5">
        <div className="row g-4 justify-content-between">
          {/* Brand Col */}
          <div className="col-lg-4">
            <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-3">
              <div 
                className="p-2 rounded-3 shadow-sm"
                style={{ 
                  background: isNeon 
                    ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.25) 0%, rgba(0, 242, 254, 0.25) 100%)' 
                    : 'linear-gradient(135deg, rgba(37, 211, 102, 0.2) 0%, rgba(18, 140, 126, 0.2) 100%)', 
                  border: `1px solid ${isNeon ? 'rgba(0, 255, 136, 0.4)' : 'rgba(37, 211, 102, 0.4)'}` 
                }}
              >
                <Layers className={isNeon ? 'text-success' : 'text-primary'} size={20} />
              </div>
              <span className="fw-extrabold fs-4" style={{ color: 'var(--heading-color)' }}>
                Event<span className="text-gradient">Sphere</span>
              </span>
            </Link>
            <p className="small mb-4" style={{ lineHeight: '1.7', maxWidth: '340px', color: 'var(--text-secondary)' }}>
              The next-generation enterprise expo & event intelligence platform. Uniting physical exhibitions with interactive 3D virtual twins and AI concierges.
            </p>
            <div className="d-flex align-items-center gap-2 text-success small font-monospace">
              <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', background: isNeon ? '#00ff88' : '#25d366' }}></span>
              <span>All Systems Operational (MongoDB & WebSocket Sync)</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Exhibition</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/expos" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Upcoming Expos</Link></li>
              <li><Link to="/floor-plan" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>3D Spatial Hall</Link></li>
              <li><Link to="/exhibitors" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Exhibitor Directory</Link></li>
              <li><Link to="/schedule" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Keynote Agenda</Link></li>
              <li><Link to="/speakers" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Keynote Speakers</Link></li>
            </ul>
          </div>

          {/* Platform Portal */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Workspaces</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/admin" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Organizer Portal</Link></li>
              <li><Link to="/exhibitor" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Exhibitor Studio</Link></li>
              <li><Link to="/attendee" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Delegate Passes</Link></li>
              <li><Link to="/login" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Account Login</Link></li>
              <li><Link to="/register" className="text-decoration-none" style={{ color: 'var(--text-secondary)' }}>Delegate Register</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-lg-3">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Convention HQ</h6>
            <div className="d-flex flex-column gap-2 small" style={{ color: 'var(--text-secondary)' }}>
              <div className="d-flex align-items-start gap-2">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <span>500 Innovation Way, Silicon Valley Convention Center, CA</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Mail size={16} className="text-primary flex-shrink-0" />
                <span>support@eventsphere.com</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Phone size={16} className="text-primary flex-shrink-0" />
                <span>+1 (800) 555-EXPO-2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-top pt-4 mt-5 d-flex flex-wrap justify-content-between align-items-center gap-2 small text-muted" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            © 2026 EventSphere Platform Inc. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="cursor-pointer">Security Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
