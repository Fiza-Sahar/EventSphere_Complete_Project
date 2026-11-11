import React, { useState, useEffect } from 'react';
import { Activity, Radio, Users, Sparkles, Zap, ChevronRight, Mic, Store, Wifi, Coffee } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LiveExpoTicker = () => {
  const { isNeon } = useTheme();
  const [index, setIndex] = useState(0);

  const updates = [
    { tag: 'KEYNOTE', text: 'Dr. Sarah Connor is live on the Main Keynote Stage presenting Autonomous Agent Frontiers', icon: Mic },
    { tag: 'BOOTH BOOKED', text: 'Aether AI Labs just reserved Booth A04 in Sector A (AI Innovation Arena)', icon: Store },
    { tag: 'TELEMETRY', text: 'Exhibition Hall foot traffic at 84% capacity • WiFi Zone 5G Ultra Wideband Active', icon: Wifi },
    { tag: 'AI CONCIERGE', text: 'Smart AI Matchmaking updated 42 personalized delegate itineraries', icon: Zap },
    { tag: 'NETWORKING', text: 'Executive VIP Coffee & B2B Matchmaking starting in Executive Lounge & Cafe', icon: Coffee }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % updates.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [updates.length]);

  const curr = updates[index];

  return (
    <div 
      className="position-fixed start-0 end-0 glass-card rounded-0 border-start-0 border-end-0 border-bottom-0 px-3 py-1.5 d-none d-lg-flex align-items-center justify-content-between shadow-lg"
      style={{ 
        bottom: 0, 
        zIndex: 1040,
        height: '36px',
        background: isNeon ? 'rgba(5, 10, 7, 0.94)' : 'rgba(255, 255, 255, 0.95)',
        borderTop: isNeon ? '1px solid rgba(0, 255, 136, 0.3)' : '1px solid rgba(18, 140, 126, 0.25)'
      }}
    >
      {/* Live Badge */}
      <div className="d-flex align-items-center gap-2 flex-shrink-0 pe-3 border-end" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="d-flex align-items-center gap-1.5 fw-bold font-monospace" style={{ fontSize: '11px', color: isNeon ? '#00ff88' : '#128c7e' }}>
          <span className="rounded-circle d-inline-block animate-pulse" style={{ width: '7px', height: '7px', background: isNeon ? '#00ff88' : '#25d366' }} />
          LIVE EXPO FEED
        </span>
      </div>

      {/* Animated Update Content */}
      <div className="flex-grow-1 px-3 d-flex align-items-center gap-2 overflow-hidden animate-fade-in" key={index}>
        <curr.icon size={14} className="text-primary flex-shrink-0" />
        <span className="badge" style={{ fontSize: '9px', background: isNeon ? 'rgba(0,255,136,0.15)' : 'rgba(18,140,126,0.12)', color: isNeon ? '#00ff88' : '#075e54' }}>
          {curr.tag}
        </span>
        <span className="small text-truncate" style={{ color: 'var(--text-main)', fontSize: '0.82rem' }}>
          {curr.text}
        </span>
      </div>

      {/* Right Stats Preview */}
      <div className="d-flex align-items-center gap-3 flex-shrink-0 ps-3 border-start" style={{ borderColor: 'var(--border-subtle)', fontSize: '11px' }}>
        <span className="text-muted d-flex align-items-center gap-1">
          <Users size={12} className="text-primary" />
          <strong style={{ color: 'var(--heading-color)' }}>1,480</strong> Online
        </span>
        <span className="text-muted d-flex align-items-center gap-1">
          <Activity size={12} className="text-success" />
          <strong style={{ color: 'var(--heading-color)' }}>99.9%</strong> Sync
        </span>
      </div>
    </div>
  );
};

export default LiveExpoTicker;
