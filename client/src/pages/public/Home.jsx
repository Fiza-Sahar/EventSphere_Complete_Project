import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Sparkles, Calendar, MapPin, Users, ArrowRight, Star, Zap, 
  Shield, Globe, CheckCircle2, Box, Layers, Play, Award, ChevronRight,
  MessageSquare, QrCode, BarChart3
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { soundFX } from '../../utils/soundFX';

const Home = () => {
  const { isNeon } = useTheme();
  const [expos, setExpos] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exposRes, exhibRes] = await Promise.all([
          api.get('/expos'),
          api.get('/exhibitors')
        ]);
        setExpos(exposRes.data.slice(0, 3));
        setExhibitors(exhibRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openAIChat = () => {
    soundFX.playClick();
    const aiBtn = document.querySelector('button.btn-primary-custom[style*="borderRadius: 30px"], button.position-fixed.bottom-0.end-0');
    if (aiBtn) aiBtn.click();
  };

  const openVIPBadge = () => {
    soundFX.playTeleport();
    const vipBtn = document.querySelector('button[title*="VIP Pass"]');
    if (vipBtn) vipBtn.click();
  };

  return (
    <div className="d-flex flex-column gap-5 bg-ambient-mesh overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="position-relative py-5 py-lg-6 text-center">
        <div className="hero-glow-orb top-0 start-50 translate-middle-x"></div>
        <div className="container position-relative py-4" style={{ zIndex: 1 }}>
          <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill mb-4 glass-card shadow-sm" style={{ borderColor: 'var(--primary-glow)' }}>
            <Sparkles className="text-primary" size={16} />
            <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>Next-Gen Virtual & Hybrid Expo Ecosystem</span>
            <span className="badge btn-primary-custom rounded-pill px-2.5 py-0.5 text-white" style={{ fontSize: '10px' }}>2.0</span>
          </div>

          <h1 className="display-3 fw-extrabold mb-4 tracking-tight" style={{ lineHeight: 1.15, color: 'var(--heading-color)' }}>
            The Modern Standard for <br className="d-none d-md-block" />
            <span className="text-gradient">Global Trade Shows & Expos</span>
          </h1>

          <p className="lead mx-auto mb-5" style={{ maxWidth: '720px', fontSize: '1.2rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            Transform how conventions, corporate trade fairs, and exhibitions operate with real-time 3D spatial floor plans, AI matchmaking concierge, and instant QR badge verification.
          </p>

          <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-5">
            <Link to="/expos" onClick={() => soundFX.playClick()} className="btn btn-primary-custom px-4 py-3 fs-6">
              <span>Explore Upcoming Expos</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/floor-plan" onClick={() => soundFX.playTeleport()} className="btn btn-outline-custom px-4 py-3 fs-6">
              <Box size={18} className="text-primary" />
              <span>Launch 3D Expo Hall</span>
            </Link>
          </div>

          {/* Real-Time Platform Numbers Banner */}
          <div className="row g-3 justify-content-center mx-auto" style={{ maxWidth: '960px' }}>
            {[
              { label: 'Expos Hosted', value: '500+', sub: 'Globally across 42 cities' },
              { label: 'Registered Exhibitors', value: '12,400+', sub: 'Fortune 500 & Startups' },
              { label: 'Verified Delegates', value: '1.2M+', sub: 'Active attendees worldwide' },
              { label: 'Platform Uptime', value: '99.98%', sub: 'Zero-latency sync' }
            ].map((stat, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="glass-card p-3 p-md-4 text-center h-100 shadow-sm">
                  <div className="fs-3 fw-extrabold mb-1 text-gradient">{stat.value}</div>
                  <div className="fw-semibold small mb-0.5" style={{ color: 'var(--heading-color)' }}>{stat.label}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3D HALL FEATURE TEASER BANNER ================= */}
      <section className="container py-3">
        <div className="glass-card p-4 p-md-5 position-relative overflow-hidden shadow-lg" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="row align-items-center g-4 position-relative" style={{ zIndex: 1 }}>
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 bg-primary bg-opacity-20 text-primary small fw-bold">
                <Box size={14} /> LIVE SPATIAL TWIN
              </div>
              <h2 className="display-6 fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>
                Explore the Exhibition Hall in Full <span className="text-gradient">Interactive 3D</span>
              </h2>
              <p className="mb-4" style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                Walk through exhibition sectors, inspect corporate booths with real-time occupancy status, reserve prime booth locations, and plan your delegate tour before arriving at the venue.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/floor-plan" onClick={() => soundFX.playTeleport()} className="btn btn-primary-custom">
                  <Box size={16} /> Open 3D Floor Plan
                </Link>
                <Link to="/schedule" onClick={() => soundFX.playClick()} className="btn btn-outline-custom">
                  View Arena Keynotes
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center">
              <div className="p-4 rounded-4 glass-card shadow-lg" style={{ background: 'var(--bg-subtle)' }}>
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="small text-muted font-monospace">HALL A-1 • STATUS</span>
                  <span className="badge-available">LIVE SYNC ACTIVE</span>
                </div>
                <div className="row g-2 text-start small">
                  <div className="col-6 p-2 rounded" style={{ background: 'var(--bg-surface)' }}>
                    <span className="text-muted d-block" style={{ fontSize: '11px' }}>Total Booths</span>
                    <strong style={{ color: 'var(--heading-color)' }}>50 Units</strong>
                  </div>
                  <div className="col-6 p-2 rounded" style={{ background: 'var(--bg-surface)' }}>
                    <span className="text-muted d-block" style={{ fontSize: '11px' }}>Available</span>
                    <strong className="text-success">28 Open</strong>
                  </div>
                  <div className="col-6 p-2 rounded" style={{ background: 'var(--bg-surface)' }}>
                    <span className="text-muted d-block" style={{ fontSize: '11px' }}>Reserved</span>
                    <strong className="text-warning">12 Under Review</strong>
                  </div>
                  <div className="col-6 p-2 rounded" style={{ background: 'var(--bg-surface)' }}>
                    <span className="text-muted d-block" style={{ fontSize: '11px' }}>Occupied</span>
                    <strong className="text-primary">10 Verified</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 🌟 INTERACTIVE CORE PLATFORM CAPABILITIES ================= */}
      <section className="container py-4">
        <div className="text-center mb-5">
          <span className="text-primary fw-bold text-uppercase small tracking-wider">Enterprise Architecture</span>
          <h2 className="display-6 fw-bold mt-1" style={{ color: 'var(--heading-color)' }}>Engineered for Massive Scale</h2>
          <p className="mx-auto" style={{ maxWidth: '600px', color: 'var(--text-secondary)' }}>
            Every component is fully connected and interactive. Click any capability to launch it directly:
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              icon: Box,
              title: '3D Spatial Floor Plan',
              desc: 'WebGL-powered 3D visualization with Three.js. Real-time booth reservation, sector navigation, and multi-floor elevator.',
              color: '#10b981',
              actionType: 'link',
              actionUrl: '/floor-plan',
              actionLabel: 'Launch 3D Floor Plan'
            },
            {
              icon: Sparkles,
              title: 'AI Event Concierge',
              desc: 'Intelligent bilingual AI assistant with voice speech synthesis trained on building floors, schedules, and exhibitor booths.',
              color: '#0284c7',
              actionType: 'ai',
              actionLabel: 'Chat with AI Assistant'
            },
            {
              icon: Zap,
              title: 'Live Telemetry & Ticker',
              desc: 'Instant real-time sync across thousands of concurrent attendees when booths are booked and keynotes go live.',
              color: '#f59e0b',
              actionType: 'link',
              actionUrl: '/schedule',
              actionLabel: 'View Live Schedule'
            },
            {
              icon: QrCode,
              title: 'Verified 3D Hologram Passes',
              desc: 'Cryptographically verified digital VIP delegate passes with metallic shimmer, QR fast-pass, and wallet saving.',
              color: '#25d366',
              actionType: 'badge',
              actionLabel: 'Open Holographic VIP Pass'
            },
            {
              icon: Users,
              title: 'Role-Based Ecosystem',
              desc: 'Dedicated high-performance directories and portals for Platform Organizers, Corporate Exhibitors, and Registered Attendees.',
              color: '#8b5cf6',
              actionType: 'link',
              actionUrl: '/exhibitors',
              actionLabel: 'Explore Exhibitors'
            },
            {
              icon: Globe,
              title: 'Global Convention Complex',
              desc: 'Complete 3D exterior architectural modeling with 60m innovation tower, 5G autonomous shuttle, and solar parking plaza.',
              color: '#06b6d4',
              actionType: 'link',
              actionUrl: '/floor-plan',
              actionLabel: 'View 3D Exterior & Parking'
            }
          ].map((feature, i) => (
            <div key={i} className="col-md-6 col-lg-4">
              <div className="glass-card glass-card-hover p-4 h-100 d-flex flex-column justify-content-between shadow-sm">
                <div>
                  <div 
                    className="p-3 rounded-3 d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                  >
                    <feature.icon size={24} style={{ color: feature.color }} />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>{feature.title}</h5>
                  <p className="small mb-3" style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>{feature.desc}</p>
                </div>

                <div className="pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                  {feature.actionType === 'link' && (
                    <Link 
                      to={feature.actionUrl} 
                      onClick={() => soundFX.playClick()} 
                      className="btn btn-outline-custom btn-sm w-100 d-flex align-items-center justify-content-center gap-1.5"
                    >
                      <span>{feature.actionLabel}</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                  {feature.actionType === 'ai' && (
                    <button 
                      onClick={openAIChat} 
                      className="btn btn-primary-custom btn-sm w-100 d-flex align-items-center justify-content-center gap-1.5"
                    >
                      <Sparkles size={14} />
                      <span>{feature.actionLabel}</span>
                    </button>
                  )}
                  {feature.actionType === 'badge' && (
                    <button 
                      onClick={openVIPBadge} 
                      className="btn btn-outline-custom btn-sm w-100 d-flex align-items-center justify-content-center gap-1.5"
                    >
                      <QrCode size={14} className="text-warning" />
                      <span>{feature.actionLabel}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED EXPOS SHOWCASE ================= */}
      <section className="container py-4">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
          <div>
            <span className="text-primary fw-bold text-uppercase small tracking-wider">Upcoming Schedule</span>
            <h2 className="display-6 fw-bold mt-1" style={{ color: 'var(--heading-color)' }}>Featured Global Expos</h2>
          </div>
          <Link to="/expos" className="btn btn-outline-custom d-flex align-items-center gap-2">
            <span>View All Expos</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="row g-4">
          {expos.map((expo) => (
            <div key={expo._id} className="col-md-6 col-lg-4">
              <div className="glass-card glass-card-hover h-100 d-flex flex-column justify-content-between shadow-sm">
                <div className="position-relative" style={{ height: '200px' }}>
                  <img 
                    src={expo.image} 
                    alt={expo.title} 
                    className="w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge btn-primary-custom px-3 py-1.5 rounded-pill shadow">
                      {expo.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>{expo.title}</h5>
                    <p className="small mb-3 line-clamp-2" style={{ minHeight: '40px', color: 'var(--text-secondary)' }}>
                      {expo.description}
                    </p>

                    <div className="d-flex flex-column gap-2 mb-4 small" style={{ color: 'var(--text-secondary)' }}>
                      <span className="d-flex align-items-center gap-2">
                        <Calendar size={15} className="text-primary" />
                        {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        <MapPin size={15} className="text-primary" />
                        {expo.location}
                      </span>
                    </div>
                  </div>

                  <Link to={`/expos/${expo._id}`} className="btn btn-primary-custom w-100 py-2">
                    <span>Reserve Pass</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EXHIBITORS SHOWCASE ================= */}
      <section className="container py-4 mb-4">
        <div className="glass-card p-4 p-md-5 shadow-sm">
          <div className="text-center mb-4">
            <span className="text-primary fw-bold text-uppercase small tracking-wider">Industry Leaders</span>
            <h3 className="fw-bold mt-1" style={{ color: 'var(--heading-color)' }}>Leading Exhibitors Participating in 2026</h3>
          </div>

          <div className="row g-3">
            {exhibitors.map((ex) => (
              <div key={ex._id} className="col-6 col-md-4 col-lg-2">
                <Link 
                  to={`/exhibitors/${ex._id}`} 
                  onClick={() => soundFX.playClick()}
                  className="p-3 rounded-3 text-center glass-card glass-card-hover h-100 d-flex flex-column align-items-center justify-content-center shadow-sm text-decoration-none"
                >
                  <img 
                    src={ex.logo} 
                    alt={ex.companyName} 
                    className="rounded-circle mb-2 object-fit-cover" 
                    style={{ width: '48px', height: '48px', border: '2px solid var(--primary-glow)' }} 
                  />
                  <div className="fw-bold small text-truncate w-100" style={{ color: 'var(--heading-color)' }}>{ex.companyName}</div>
                  <span className="badge bg-secondary bg-opacity-25 mt-1" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {ex.category || 'Tech'}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
