import React, { useState } from 'react';
import { 
  MapPin, Info, CheckCircle2, Clock, Building2, 
  Utensils, Mic, Briefcase, Crown, AlertTriangle, Zap, HeartPulse, Navigation
} from 'lucide-react';

const FloorPlan2D = ({ 
  booths = [], 
  selectedBooth, 
  onSelectBooth,
  facilities = [],
  activeLayers = {},
  selectedSector = 'ALL',
  navigationRoute = null,
  isEmergency = false,
  onNavigate = null
}) => {
  const [filter, setFilter] = useState('ALL');

  const filteredBooths = booths.filter(b => {
    const statusMatch = filter === 'ALL' || b.status === filter;
    const sectorMatch = selectedSector === 'ALL' || b.boothNumber.startsWith(selectedSector);
    return statusMatch && sectorMatch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="badge-available">AVAILABLE</span>;
      case 'RESERVED':
        return <span className="badge-reserved">RESERVED</span>;
      case 'OCCUPIED':
        return <span className="badge-occupied">OCCUPIED</span>;
      case 'MAINTENANCE':
        return <span className="badge bg-danger text-white">MAINTENANCE</span>;
      case 'UNAVAILABLE':
      default:
        return <span className="badge bg-secondary text-muted">UNAVAILABLE</span>;
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* 2D Interactive Venue Overview Layout */}
      <div className="glass-card p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
          <div>
            <h5 className="fw-bold text-white mb-1 d-flex align-items-center gap-2">
              <MapPin className="text-primary" /> 2D Vector Architectural Floor Plan
            </h5>
            <p className="text-secondary small mb-0">Synchronized real-time sector grid & facility layout</p>
          </div>

          {/* Status Filter */}
          <div className="d-flex flex-wrap gap-1.5">
            {['ALL', 'AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE'].map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`btn btn-sm ${filter === st ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Active Navigation Route Alert in 2D */}
        {navigationRoute && (
          <div className="alert alert-primary d-flex align-items-center justify-content-between p-2.5 rounded-3 mb-4 shadow-sm" style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary-500)' }}>
            <div className="d-flex align-items-center gap-2">
              <Navigation size={18} className="text-primary animate-pulse flex-shrink-0" />
              <div>
                <div className="fw-bold small" style={{ color: 'var(--heading-color)' }}>
                  Active Route to {navigationRoute.target?.name || navigationRoute.target?.title || 'Destination'}
                </div>
                <div className="text-muted small font-monospace" style={{ fontSize: '11px' }}>
                  Distance: {navigationRoute.distance}m • Est. Walk Time: ~{navigationRoute.walkTime}s
                </div>
              </div>
            </div>
            {onNavigate && (
              <button className="btn btn-sm btn-outline-custom py-1 px-2.5 font-monospace" style={{ fontSize: '11px' }} onClick={() => onNavigate(null)}>
                Clear Route
              </button>
            )}
          </div>
        )}

        {/* Venue Designated Zones Grid */}
        <div className="row g-2 mb-4">
          <div className="col-6 col-md-3">
            <div className="p-2.5 text-center rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-warning small fw-semibold d-flex align-items-center justify-content-center gap-1.5">
              <Utensils size={14} /> Food Court & Dining
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2.5 text-center rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-info small fw-semibold d-flex align-items-center justify-content-center gap-1.5">
              <Mic size={14} /> Arena Keynote Stage
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2.5 text-center rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-primary small fw-semibold d-flex align-items-center justify-content-center gap-1.5">
              <Users size={14} /> VIP Networking Hub
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="p-2.5 text-center rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25 text-success small fw-semibold d-flex align-items-center justify-content-center gap-1.5">
              <CheckCircle2 size={14} /> Registration Portal
            </div>
          </div>
        </div>

        {/* 2D Booths Vector Grid */}
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
          {filteredBooths.map((booth) => {
            const isSelected = selectedBooth && selectedBooth._id === booth._id;
            let borderStyle = '1px solid rgba(255, 255, 255, 0.08)';
            let bgColor = 'rgba(15, 23, 42, 0.6)';

            if (booth.status === 'AVAILABLE') {
              borderStyle = '1px solid rgba(16, 185, 129, 0.35)';
              bgColor = 'rgba(16, 185, 129, 0.08)';
            } else if (booth.status === 'RESERVED') {
              borderStyle = '1px solid rgba(245, 158, 11, 0.35)';
              bgColor = 'rgba(245, 158, 11, 0.08)';
            } else if (booth.status === 'OCCUPIED') {
              borderStyle = '1px solid rgba(59, 130, 246, 0.35)';
              bgColor = 'rgba(59, 130, 246, 0.08)';
            } else if (booth.status === 'MAINTENANCE') {
              borderStyle = '1px solid rgba(239, 68, 68, 0.35)';
              bgColor = 'rgba(239, 68, 68, 0.08)';
            }

            if (isSelected) {
              borderStyle = '2px solid #38bdf8';
              bgColor = 'rgba(56, 189, 248, 0.2)';
            }

            return (
              <div key={booth._id || booth.boothNumber} className="col">
                <div
                  onClick={() => onSelectBooth(booth)}
                  className="p-3 text-center rounded-3 cursor-pointer transition-all position-relative h-100 d-flex flex-column justify-content-between"
                  style={{
                    background: bgColor,
                    border: borderStyle,
                    minHeight: '120px',
                    boxShadow: isSelected ? '0 0 16px rgba(56, 189, 248, 0.3)' : 'none'
                  }}
                >
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="badge bg-dark bg-opacity-70 text-secondary font-monospace" style={{ fontSize: '9px' }}>
                        Sector {booth.boothNumber.charAt(0)}
                      </span>
                      <span className="font-monospace fw-bold text-white small">{booth.boothNumber}</span>
                    </div>
                    <div className="small text-truncate text-light fw-medium mb-2" title={booth.companyName || 'Available'}>
                      {booth.companyName || 'Open Space'}
                    </div>
                  </div>
                  <div>{getStatusBadge(booth.status)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloorPlan2D;
