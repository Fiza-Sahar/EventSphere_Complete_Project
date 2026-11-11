import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, TrendingUp, Wifi, Activity, BarChart2,
  AlertTriangle, CheckCircle, Clock, Zap, MapPin, Eye,
  Calendar, ArrowRight, Shield, Radio, RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area } from 'recharts';
import api from '../../services/api';

const BOOTH_STATUS_COLORS = {
  AVAILABLE: '#10b981',
  RESERVED: '#f59e0b',
  OCCUPIED: '#3b82f6',
  MAINTENANCE: '#ef4444',
  UNAVAILABLE: '#6b7280'
};

const AdminOverview = () => {
  const [stats, setStats] = useState({ total: 0, available: 0, reserved: 0, occupied: 0, maintenance: 0, unavailable: 0 });
  const [booths, setBooths] = useState([]);
  const [expos, setExpos] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const sectorData = [
    { name: 'Sector A', available: 8, occupied: 6, reserved: 4, maintenance: 1 },
    { name: 'Sector B', available: 6, occupied: 8, reserved: 5, maintenance: 0 },
    { name: 'Sector C', available: 5, occupied: 9, reserved: 3, maintenance: 2 },
    { name: 'Sector D', available: 4, occupied: 7, reserved: 6, maintenance: 1 },
  ];

  const visitorTrafficData = [
    { time: '8am', visitors: 120 },
    { time: '9am', visitors: 380 },
    { time: '10am', visitors: 820 },
    { time: '11am', visitors: 1250 },
    { time: '12pm', visitors: 980 },
    { time: '1pm', visitors: 760 },
    { time: '2pm', visitors: 1100 },
    { time: '3pm', visitors: 1420 },
    { time: '4pm', visitors: 940 },
    { time: '5pm', visitors: 480 },
  ];

  const load = async () => {
    setLoading(true);
    try {
      const [boothsRes, exposRes, exhibitorsRes] = await Promise.all([
        api.get('/booths'),
        api.get('/expos'),
        api.get('/exhibitors')
      ]);

      const boothData = Array.isArray(boothsRes.data) ? boothsRes.data : boothsRes.data?.booths || [];
      const expoData = Array.isArray(exposRes.data) ? exposRes.data : exposRes.data?.expos || [];
      const exhibitorData = Array.isArray(exhibitorsRes.data) ? exhibitorsRes.data : exhibitorsRes.data?.exhibitors || [];

      setBooths(boothData);
      setExpos(expoData);
      setExhibitors(exhibitorData);

      setStats({
        total: boothData.length,
        available: boothData.filter(b => b.status === 'AVAILABLE').length,
        reserved: boothData.filter(b => b.status === 'RESERVED').length,
        occupied: boothData.filter(b => b.status === 'OCCUPIED').length,
        maintenance: boothData.filter(b => b.status === 'MAINTENANCE').length,
        unavailable: boothData.filter(b => b.status === 'UNAVAILABLE').length
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error('AdminOverview load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const occupancyPct = stats.total > 0 ? Math.round((stats.occupied / stats.total) * 100) : 0;
  const revenuePct = stats.total > 0 ? Math.round(((stats.reserved + stats.occupied) / stats.total) * 100) : 0;

  const pieData = [
    { name: 'Available', value: stats.available, color: '#10b981' },
    { name: 'Reserved', value: stats.reserved, color: '#f59e0b' },
    { name: 'Occupied', value: stats.occupied, color: '#3b82f6' },
    { name: 'Maintenance', value: stats.maintenance, color: '#ef4444' },
    { name: 'Unavailable', value: stats.unavailable, color: '#6b7280' },
  ].filter(d => d.value > 0);

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--heading-color)' }}>
            <Shield size={20} className="text-primary" />
            Admin Command Center
          </h4>
          <p className="text-secondary small mb-0">
            Real-time expo platform intelligence & booth telemetry
          </p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <span className="text-secondary small">
            <Radio size={12} className="me-1 text-success" style={{ animation: 'emergencyPulse 2s infinite' }} />
            Live • Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <button className="btn btn-sm btn-outline-custom d-flex align-items-center gap-1" onClick={load}>
            <RefreshCw size={13} /> Refresh
          </button>
          <a href="/admin/booths" className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1">
            <Building2 size={13} /> Manage Booths
          </a>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Booths', value: stats.total, icon: Building2, color: '#38bdf8', sub: 'Convention floor spaces' },
          { label: 'Available', value: stats.available, icon: CheckCircle, color: '#10b981', sub: `${stats.total > 0 ? Math.round((stats.available / stats.total) * 100) : 0}% open capacity` },
          { label: 'Occupied', value: stats.occupied, icon: Users, color: '#3b82f6', sub: `${occupancyPct}% occupancy rate` },
          { label: 'Reserved', value: stats.reserved, icon: Clock, color: '#f59e0b', sub: 'Pending move-in' },
          { label: 'Registered Exhibitors', value: exhibitors.length, icon: Building2, color: '#8b5cf6', sub: 'Active company accounts' },
          { label: 'Active Expos', value: expos.length, icon: Calendar, color: '#ec4899', sub: 'Live event collections' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="col-6 col-md-4 col-xl-2">
            <div className="glass-card p-3 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="p-2 rounded-2" style={{ background: color + '20' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="fw-bold" style={{ fontSize: '1.6rem', lineHeight: 1, color: 'var(--heading-color)' }}>
                  {loading ? '—' : value}
                </span>
              </div>
              <div className="fw-semibold small mb-1" style={{ color: 'var(--text-main)' }}>{label}</div>
              <div className="text-secondary" style={{ fontSize: '11px' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Occupancy Gauge & Charts */}
      <div className="row g-3 mb-4">
        {/* Sector Occupancy */}
        <div className="col-12 col-lg-7">
          <div className="glass-card p-4 h-100 shadow-sm">
            <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Sector Occupancy Breakdown</h6>
            <p className="text-secondary small mb-3">Real-time booth status distribution per sector</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={sectorData} barSize={12}>
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '8px', color: 'var(--text-main)' }}
                  labelStyle={{ color: 'var(--heading-color)', fontWeight: 'bold' }}
                />
                <Bar dataKey="available" fill="#10b981" radius={[3, 3, 0, 0]} name="Available" />
                <Bar dataKey="reserved" fill="#f59e0b" radius={[3, 3, 0, 0]} name="Reserved" />
                <Bar dataKey="occupied" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Occupied" />
                <Bar dataKey="maintenance" fill="#ef4444" radius={[3, 3, 0, 0]} name="Maintenance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie Chart */}
        <div className="col-12 col-lg-5">
          <div className="glass-card p-4 h-100 shadow-sm">
            <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Booth Status Distribution</h6>
            <p className="text-secondary small mb-3">Current venue utilization snapshot</p>
            {loading ? (
              <div className="d-flex align-items-center justify-content-center" style={{ height: 180 }}>
                <div className="loading-spinner" />
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <ResponsiveContainer width={140} height={140}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={38} outerRadius={62} paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-grow-1 d-flex flex-column gap-1">
                  {pieData.map(d => (
                    <div key={d.name} className="d-flex align-items-center justify-content-between gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle" style={{ width: '8px', height: '8px', background: d.color, flexShrink: 0 }} />
                        <span className="text-secondary small">{d.name}</span>
                      </div>
                      <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Gauge */}
            <div className="mt-3">
              <div className="d-flex justify-content-between mb-1">
                <span className="text-secondary small">Overall Occupancy</span>
                <span className="fw-bold small" style={{ color: 'var(--heading-color)' }}>{occupancyPct}%</span>
              </div>
              <div className="rounded-pill overflow-hidden" style={{ height: '6px', background: 'var(--border-subtle)' }}>
                <div className="rounded-pill h-100" style={{ width: `${occupancyPct}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)', transition: 'width 0.8s ease' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visitor Traffic Chart */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="glass-card p-4 shadow-sm">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Visitor Footfall — Today (Simulated Live Telemetry)</h6>
                <p className="text-secondary small mb-0">Total: <strong style={{ color: 'var(--heading-color)' }}>8,250</strong> delegates tracked today</p>
              </div>
              <span className="badge bg-success bg-opacity-20 text-success small">
                <Activity size={10} className="me-1" />LIVE TRACKING
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={visitorTrafficData}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '8px', color: 'var(--text-main)' }}
                  labelStyle={{ color: 'var(--heading-color)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#38bdf8" strokeWidth={2} fill="url(#visitorGradient)" name="Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="row g-3">
        {[
          { label: 'Manage Booths', desc: 'Edit status, assign exhibitors, bulk actions', href: '/admin/booths', icon: Building2, color: '#38bdf8' },
          { label: 'Exhibitor Accounts', desc: 'Approve registrations, manage profiles', href: '/admin/exhibitors', icon: Users, color: '#8b5cf6' },
          { label: 'Session Schedule', desc: 'Sessions, speakers, venue assignments', href: '/admin/schedule', icon: Calendar, color: '#10b981' },
          { label: 'Analytics & Reports', desc: 'Revenue, traffic, engagement metrics', href: '/admin/analytics', icon: BarChart2, color: '#f59e0b' },
          { label: '3D Floor Builder', desc: 'Interactive venue layout editor', href: '/admin/floor-builder', icon: MapPin, color: '#ec4899' },
          { label: 'Notifications', desc: 'Send announcements to all delegates', href: '/admin/notifications', icon: Zap, color: '#ef4444' },
        ].map(({ label, desc, href, icon: Icon, color }) => (
          <div key={label} className="col-12 col-sm-6 col-xl-4">
            <a href={href} className="glass-card p-3 d-flex align-items-center gap-3 text-decoration-none shadow-sm" style={{ transition: 'all 0.2s' }}>
              <div className="p-2 rounded-3 flex-shrink-0" style={{ background: color + '20' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold small" style={{ color: 'var(--text-main)' }}>{label}</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>{desc}</div>
              </div>
              <ArrowRight size={14} className="text-secondary flex-shrink-0" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
