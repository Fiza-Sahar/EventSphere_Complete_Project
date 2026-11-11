import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEMES } from '../context/ThemeContext';
import { soundFX } from '../utils/soundFX';
import { Layers, LayoutDashboard, LogOut, User, Box, Sparkles, Menu, X, Zap, MessageSquare, Award } from 'lucide-react';

const Navbar = ({ onOpenBadge }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme, isNeon, isWhatsApp } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    soundFX.playClick();
    logout();
    navigate('/login');
  };

  const switchToTheme = (targetTheme) => {
    if (theme !== targetTheme) {
      soundFX.playThemeSwitch();
      setTheme(targetTheme);
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'exhibitor') return '/exhibitor';
    return '/attendee';
  };

  const navLinks = [
    { label: 'Expos', path: '/expos' },
    { label: '3D Expo & Booth Booking', path: '/floor-plan', highlight: true },
    { label: 'Exhibitors', path: '/exhibitors' },
    { label: 'Schedule', path: '/schedule' },
    { label: 'Speakers', path: '/speakers' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-card rounded-0 border-top-0 border-start-0 border-end-0 px-3 px-md-4 py-2" style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link to="/" onClick={() => soundFX.playClick()} className="navbar-brand d-flex align-items-center gap-2.5 text-decoration-none me-3" style={{ transition: 'transform 0.2s ease' }}>
          <div 
            className="d-flex align-items-center justify-content-center shadow-sm"
            style={{ 
              background: isNeon 
                ? 'linear-gradient(135deg, #059669 0%, #00d66f 50%, #06b6d4 100%)' 
                : 'linear-gradient(135deg, #047857 0%, #10b981 50%, #0284c7 100%)',
              borderRadius: '12px',
              width: '38px',
              height: '38px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer sweep */}
            <div style={{
              position: 'absolute', top: 0, left: '-100%', width: '200%', height: '100%',
              background: 'linear-gradient(90deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%)',
              animation: 'logoShimmer 3s ease-in-out infinite',
              pointerEvents: 'none'
            }} />
            <Layers color="#fff" size={20} />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-extrabold lh-1 tracking-tight" style={{ color: 'var(--heading-color)', fontSize: '1.35rem' }}>
              Event<span className="text-gradient">Sphere</span>
            </span>
            <span style={{ fontSize: '8.5px', letterSpacing: '0.14em', fontWeight: 700, color: 'var(--text-secondary)', opacity: 0.75 }}>
              EXPO • BOOKING • 3D
            </span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0 p-1 d-lg-none" 
          type="button" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ color: 'var(--text-main)' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show mt-3' : ''}`} id="navbarContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-1.5">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    className={`nav-link px-3 py-1.5 rounded-pill fw-medium transition-all ${
                      isActive 
                        ? 'text-white btn-primary-custom fw-semibold shadow-sm' 
                        : item.cta 
                          ? 'text-primary fw-semibold' 
                          : 'hover-text-white'
                    } ${item.highlight ? 'd-flex align-items-center gap-1.5' : ''}`} 
                    to={item.path}
                    onClick={() => {
                      soundFX.playClick();
                      setMobileMenuOpen(false);
                    }}
                    style={{ 
                      fontSize: '0.88rem',
                      color: isActive ? '#ffffff' : item.cta ? 'var(--primary-500)' : 'var(--text-secondary)',
                      border: item.cta && !isActive ? '1px solid var(--primary-glow)' : 'none',
                      background: item.cta && !isActive ? 'var(--primary-glow)' : 'transparent'
                    }}
                  >
                    {item.highlight && <Box size={14} />}
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Bar: Compact Icon Theme Switcher + VIP Pass + User Profile */}
          <div className="d-flex align-items-center gap-2 pt-2 pt-lg-0 border-top border-lg-0 border-secondary border-opacity-25">
            
            {/* 🌟 SLEEK COMPACT ICON-ONLY THEME TOGGLE */}
            <div 
              className="d-flex align-items-center rounded-pill p-1 shadow-sm"
              style={{ 
                background: 'var(--bg-card)', 
                border: '1.5px solid var(--border-bright)',
                gap: '2px'
              }}
            >
              <button
                type="button"
                onClick={() => switchToTheme(THEMES.WHATSAPP)}
                className="btn btn-sm p-1.5 rounded-circle d-flex align-items-center justify-content-center border-0"
                style={{
                  width: '32px',
                  height: '32px',
                  background: isWhatsApp ? 'var(--primary-gradient)' : 'transparent',
                  color: isWhatsApp ? '#ffffff' : 'var(--text-muted)',
                  boxShadow: isWhatsApp ? '0 2px 8px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title="Switch to WhatsApp Clean White Theme"
              >
                <MessageSquare size={16} />
              </button>

              <button
                type="button"
                onClick={() => switchToTheme(THEMES.NEON)}
                className="btn btn-sm p-1.5 rounded-circle d-flex align-items-center justify-content-center border-0"
                style={{
                  width: '32px',
                  height: '32px',
                  background: isNeon ? 'var(--primary-gradient)' : 'transparent',
                  color: isNeon ? '#050d08' : 'var(--text-muted)',
                  boxShadow: isNeon ? '0 2px 8px var(--primary-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title="Switch to Cyber Neon Green Theme"
              >
                <Zap size={16} />
              </button>
            </div>

            {/* VIP Pass Button */}
            {onOpenBadge && (
              <button
                onClick={() => {
                  soundFX.playTeleport();
                  onOpenBadge();
                }}
                className="btn btn-sm btn-outline-custom d-flex align-items-center gap-1.5"
                title="View 3D Holographic VIP Pass"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <Award size={14} className="text-warning" />
                <span className="d-none d-xl-inline">VIP Pass</span>
              </button>
            )}

            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-custom dropdown-toggle d-flex align-items-center gap-2 py-1.5 px-3"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{ borderRadius: '9999px' }}
                >
                  <div className="rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ background: 'var(--primary-glow)' }}>
                    <User size={15} className="text-primary" />
                  </div>
                  <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>{user.name}</span>
                  <span className="badge text-capitalize small" style={{ background: 'var(--primary-glow)', color: 'var(--text-main)' }}>
                    {user.role}
                  </span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end glass-card shadow-lg p-2 mt-2" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                  <li>
                    <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 mb-1">
                      <div className="fw-bold small" style={{ color: 'var(--heading-color)' }}>{user.name}</div>
                      <div className="text-muted small" style={{ fontSize: '11px' }}>{user.email}</div>
                    </div>
                  </li>
                  <li>
                    <Link className="dropdown-item rounded d-flex align-items-center gap-2 small py-2" to={getDashboardPath()} style={{ color: 'var(--text-main)' }}>
                      <LayoutDashboard size={15} className="text-primary" /> My Workspace
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary border-opacity-25 my-1" /></li>
                  <li>
                    <button className="dropdown-item rounded text-danger d-flex align-items-center gap-2 small py-2" onClick={handleLogout}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-custom py-1.5 px-3 small">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-custom py-1.5 px-3.5 small">
                  <Sparkles size={14} /> Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
