import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Ticket, Bookmark, Heart, Box, ArrowRight, Clock, MapPin, Users, Sparkles, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const AttendeeOverview = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <h4 className="fw-bold mb-0" style={{ color: 'var(--heading-color)' }}>
              Welcome back, {user?.name || 'Delegate'}
            </h4>
            <Sparkles size={18} className="text-primary" />
          </div>
          <p className="text-secondary small mb-0">Here's your conference status at a glance.</p>
        </div>
        <div className="text-end d-none d-md-block">
          <small className="text-muted d-block">Next Session Starts In</small>
          <span className="fw-bold text-primary fs-5">02h 45m</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="glass-card p-4 h-100 border-start border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>Active Pass</span>
              <Ticket className="text-primary" size={20} />
            </div>
            <h4 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>VIP All Access</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-primary bg-opacity-25 text-primary">Verified</span>
              <small className="text-muted">ID: #CONF-8829</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-card p-4 h-100 border-start border-4 border-info">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>My Schedule</span>
              <Calendar className="text-info" size={20} />
            </div>
            <h4 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>4 Sessions Today</h4>
            <div className="d-flex align-items-center gap-2">
              <Clock className="text-muted" size={14} />
              <small className="text-muted">Next: 10:00 AM - Keynote</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="glass-card p-4 h-100 border-start border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>Saved Booths</span>
              <Heart className="text-warning" size={20} />
            </div>
            <h4 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>6 Exhibitors</h4>
            <div className="d-flex align-items-center gap-2">
              <MapPin className="text-muted" size={14} />
              <small className="text-muted">Sector A & B Layout</small>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Hall Banner */}
      <div className="glass-card p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-4">
          <div className="p-3 rounded-circle bg-primary bg-opacity-10 flex-shrink-0">
            <Box className="text-primary" size={32} />
          </div>
          <div>
            <h5 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Interactive 3D Exhibition Hall</h5>
            <p className="text-secondary mb-0 small">Explore live booths, network with exhibitors, and view 3D product demos.</p>
          </div>
        </div>
        <Link to="/floor-plan" className="btn btn-primary-custom px-4 py-2 d-flex align-items-center gap-2 flex-shrink-0">
          Explore Hall <ArrowRight size={18} />
        </Link>
      </div>

      {/* Bottom Row */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="glass-card p-4">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Upcoming Highlights</h6>
            <div className="d-flex flex-column gap-3">
              {['Future of AI', 'Sustainability Workshop', 'Founder Q&A'].map((session, i) => (
                <div key={i} className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="btn-primary-custom px-2.5 py-1 rounded small fw-bold" style={{ fontSize: '11px' }}>10:00</div>
                    <span className="fw-medium" style={{ color: 'var(--text-main)' }}>{session}</span>
                  </div>
                  <Link to="/schedule" className="btn btn-sm btn-outline-custom">View</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="glass-card p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center">
            <Users size={40} className="text-primary mb-3" />
            <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Networking Hub</h6>
            <p className="text-secondary small mb-3">Join the community chat to connect with other attendees.</p>
            <Link to="/attendee/messages" className="btn btn-outline-custom w-100 d-flex align-items-center justify-content-center gap-2">
              <MessageSquare size={16} /> Open Discussions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeOverview;
