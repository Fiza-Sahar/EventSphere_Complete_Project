import React, { useState, useEffect } from 'react';
import {
  Users, Eye, MessageSquare, TrendingUp, Star, Package, Calendar,
  Clock, CheckCircle, XCircle, RefreshCw, ArrowRight, Building2,
  Activity, BarChart2, MapPin, Phone, Globe, Mail, Briefcase, Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ExhibitorOverview = () => {
  const { user } = useAuth();
  const [exhibitor, setExhibitor] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const visitorTrend = [
    { day: 'Mon', visitors: 45 }, { day: 'Tue', visitors: 72 }, { day: 'Wed', visitors: 89 },
    { day: 'Thu', visitors: 134 }, { day: 'Fri', visitors: 198 }, { day: 'Sat', visitors: 156 }, { day: 'Sun', visitors: 87 },
  ];

  const leadsByCategory = [
    { category: 'Enterprise', leads: 24 },
    { category: 'Startups', leads: 38 },
    { category: 'Government', leads: 12 },
    { category: 'Academic', leads: 19 },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const [exhibRes, meetRes] = await Promise.all([
          api.get('/exhibitors/my').catch(() => ({ data: null })),
          api.get('/meetings').catch(() => ({ data: [] }))
        ]);

        if (exhibRes.data) setExhibitor(exhibRes.data);
        setMeetings(Array.isArray(meetRes.data) ? meetRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const pendingMeetings = meetings.filter(m => m.status === 'pending');
  const approvedMeetings = meetings.filter(m => m.status === 'approved');

  const handleMeetingStatus = async (id, status) => {
    try {
      const res = await api.put(`/meetings/${id}/status`, { status });
      setMeetings(prev => prev.map(m => m._id === id ? res.data : m));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--heading-color)' }}>
            <Building2 size={20} className="text-primary" />
            Exhibitor Dashboard
          </h4>
          <p className="text-secondary small mb-0">
            {exhibitor?.companyName || user?.name || 'Your Company'} — Real-time booth telemetry & lead analytics
          </p>
        </div>
        <div className="d-flex gap-2">
          <a href="/exhibitor/profile" className="btn btn-sm btn-outline-custom d-flex align-items-center gap-1">
            <Building2 size={13} /> Edit Profile
          </a>
          <a href="/exhibitor/products" className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1">
            <Package size={13} /> Product Catalog
          </a>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: "Booth Visitors Today", value: "198", trend: "+23%", icon: Users, color: "#38bdf8", sub: "vs. yesterday" },
          { label: "Profile Views", value: "1,247", trend: "+15%", icon: Eye, color: "#8b5cf6", sub: "This week" },
          { label: "Lead Inquiries", value: "93", trend: "+31%", icon: TrendingUp, color: "#10b981", sub: "Total captured leads" },
          { label: "Meeting Requests", value: meetings.length.toString(), trend: `${pendingMeetings.length} pending`, icon: MessageSquare, color: "#f59e0b", sub: `${approvedMeetings.length} confirmed` },
        ].map(({ label, value, trend, icon: Icon, color, sub }) => (
          <div key={label} className="col-6 col-lg-3">
            <div className="glass-card p-3 h-100 shadow-sm">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="p-2 rounded-2" style={{ background: color + '20' }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <span className="badge bg-success bg-opacity-20 text-success" style={{ fontSize: '10px' }}>
                  {trend}
                </span>
              </div>
              <div className="fw-bold mb-1" style={{ fontSize: '1.8rem', lineHeight: 1, color: 'var(--heading-color)' }}>
                {loading ? '—' : value}
              </div>
              <div className="fw-semibold small mb-1" style={{ color: 'var(--text-main)' }}>{label}</div>
              <div className="text-secondary" style={{ fontSize: '11px' }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        {/* Visitor Trend */}
        <div className="col-12 col-lg-7">
          <div className="glass-card p-4 h-100 shadow-sm">
            <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Booth Visitor Traffic (7-Day Trend)</h6>
            <p className="text-secondary small mb-3">Daily footfall at your booth location</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={visitorTrend}>
                <defs>
                  <linearGradient id="exhibGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '8px', color: 'var(--text-main)' }}
                  labelStyle={{ color: 'var(--heading-color)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#8b5cf6" strokeWidth={2} fill="url(#exhibGradient)" name="Visitors" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Breakdown */}
        <div className="col-12 col-lg-5">
          <div className="glass-card p-4 h-100 shadow-sm">
            <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Lead Segments</h6>
            <p className="text-secondary small mb-3">By visitor category</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadsByCategory} layout="vertical" barSize={12}>
                <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="category" type="category" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-bright)', borderRadius: '8px', color: 'var(--text-main)' }}
                  labelStyle={{ color: 'var(--heading-color)', fontWeight: 'bold' }}
                />
                <Bar dataKey="leads" fill="#10b981" radius={[0, 4, 4, 0]} name="Leads" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Meeting Requests */}
      <div className="glass-card p-4 mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold mb-0" style={{ color: 'var(--heading-color)' }}>
            <MessageSquare size={16} className="me-2 text-warning" />
            Meeting Requests
          </h6>
          <span className="badge bg-warning bg-opacity-20 text-warning">{pendingMeetings.length} Pending Review</span>
        </div>

        {loading ? (
          <div className="text-center py-4"><div className="loading-spinner mx-auto" /></div>
        ) : meetings.length === 0 ? (
          <div className="text-center py-4 text-secondary small">
            No meeting requests received yet. Your booth profile is live!
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {meetings.slice(0, 8).map((meeting) => (
              <div key={meeting._id} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                <div className="d-flex flex-column gap-0 flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-semibold small" style={{ color: 'var(--text-main)' }}>
                      {meeting.attendeeId?.name || 'Anonymous Visitor'}
                    </span>
                    <span className={`badge ${meeting.status === 'pending' ? 'bg-warning bg-opacity-20 text-warning' : meeting.status === 'approved' ? 'bg-success bg-opacity-20 text-success' : 'bg-danger bg-opacity-20 text-danger'}`} style={{ fontSize: '9px' }}>
                      {meeting.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-secondary small">{meeting.purpose}</div>
                  <div className="text-secondary" style={{ fontSize: '11px' }}>
                    <Calendar size={10} className="me-1" />{meeting.date} at {meeting.time}
                  </div>
                </div>
                {meeting.status === 'pending' && (
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button
                      className="btn btn-sm btn-success py-1 px-2"
                      onClick={() => handleMeetingStatus(meeting._id, 'approved')}
                      title="Approve"
                    >
                      <CheckCircle size={13} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger py-1 px-2"
                      onClick={() => handleMeetingStatus(meeting._id, 'rejected')}
                      title="Reject"
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="row g-3">
        {[
          { label: 'Company Profile', desc: 'Update your corporate bio & logo', href: '/exhibitor/profile', icon: Building2, color: '#38bdf8' },
          { label: 'Products & Services', desc: 'Manage your product catalog & images', href: '/exhibitor/products', icon: Package, color: '#10b981' },
          { label: 'Assigned 3D Booth', desc: 'View 3D booth location & upgrades', href: '/exhibitor/booth', icon: MapPin, color: '#8b5cf6' },
          { label: 'Delegate Messages', desc: 'Inbox & lead communications', href: '/exhibitor/messages', icon: MessageSquare, color: '#f59e0b' },
        ].map(({ label, desc, href, icon: Icon, color }) => (
          <div key={label} className="col-12 col-sm-6">
            <a href={href} className="glass-card p-3 d-flex align-items-center gap-3 text-decoration-none shadow-sm">
              <div className="p-2 rounded-3" style={{ background: color + '20' }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <div className="fw-semibold small" style={{ color: 'var(--text-main)' }}>{label}</div>
                <div className="text-secondary" style={{ fontSize: '11px' }}>{desc}</div>
              </div>
              <ArrowRight size={14} className="text-secondary ms-auto" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitorOverview;
