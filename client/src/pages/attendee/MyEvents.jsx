import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Star, StarOff, Plus, Trash2, Clock, Navigation,
  BookOpen, Heart, Building2, Mic, Coffee, ArrowRight, X, RefreshCw,
  CheckCircle, Circle, GripVertical, Download, QrCode, Badge, Eye,
  Store, FileText, Users as UsersIcon, Pin
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const MyEvents = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('itinerary');
  const [itinerary, setItinerary] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ time: '', title: '', location: '', category: 'Session', type: 'session', notes: '' });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [itinRes, favRes, meetRes] = await Promise.all([
          api.get('/itinerary').catch(() => ({ data: [] })),
          api.get('/favorites').catch(() => ({ data: [] })),
          api.get('/meetings').catch(() => ({ data: [] }))
        ]);
        setItinerary(Array.isArray(itinRes.data) ? itinRes.data : []);
        setFavorites(Array.isArray(favRes.data) ? favRes.data : []);
        setMeetings(Array.isArray(meetRes.data) ? meetRes.data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.time || !newItem.location) return;
    try {
      const res = await api.post('/itinerary', {
        ...newItem,
        expoId: '660000000000000000000001',
        orderIndex: itinerary.length
      });
      setItinerary(prev => [...prev, res.data]);
      setNewItem({ time: '', title: '', location: '', category: 'Session', type: 'session', notes: '' });
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await api.delete(`/itinerary/${id}`);
      setItinerary(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleComplete = async (item) => {
    try {
      const res = await api.put(`/itinerary/${item._id}`, { completed: !item.completed });
      setItinerary(prev => prev.map(i => i._id === item._id ? res.data : i));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFavorite = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryIcon = (cat) => {
    const icons = { keynote: Mic, booth: Store, meal: Coffee, session: FileText, meeting: UsersIcon, custom: Pin };
    return icons[cat] || Pin;
  };

  const tabs = [
    { id: 'itinerary', label: 'My Itinerary', icon: BookOpen },
    { id: 'favorites', label: 'Saved Items', icon: Heart },
    { id: 'meetings', label: 'My Meetings', icon: Calendar },
    { id: 'badge', label: 'Visitor Pass', icon: QrCode },
  ];

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold  mb-1" style={{ color: "var(--heading-color)" }}>My Expo Hub</h4>
          <p className="text-secondary small mb-0">Personalized schedule, favorites, meetings & digital visitor pass</p>
        </div>
        {activeTab === 'itinerary' && (
          <button className="btn btn-sm btn-primary-custom d-flex align-items-center gap-1" onClick={() => setShowAddModal(true)}>
            <Plus size={13} /> Add to Itinerary
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="d-flex gap-1 mb-4 p-1 rounded-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', width: 'fit-content' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`btn btn-sm d-flex align-items-center gap-1 rounded-2 ${activeTab === id ? 'btn-primary-custom' : 'text-secondary'}`}
            style={{ fontSize: '0.82rem' }}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="loading-spinner mx-auto" /></div>
      ) : (
        <>
          {/* ============= ITINERARY TAB ============= */}
          {activeTab === 'itinerary' && (
            <div>
              {itinerary.length === 0 ? (
                <div className="glass-card text-center py-5">
                  <BookOpen size={36} className="text-primary mb-3" />
                  <h5 className=" fw-bold mb-2" style={{ color: "var(--heading-color)" }}>Your Itinerary is Empty</h5>
                  <p className="text-secondary small mb-3">Build your personal expo schedule for the day</p>
                  <button className="btn btn-primary-custom btn-sm" onClick={() => setShowAddModal(true)}>
                    <Plus size={13} className="me-1" /> Add First Item
                  </button>
                </div>
              ) : (
                <div className="glass-card p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h6 className=" fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Today's Expo Schedule</h6>
                    <span className="badge bg-primary bg-opacity-20 text-primary small">{itinerary.length} items planned</span>
                  </div>

                  {/* Timeline */}
                  <div className="d-flex flex-column gap-2">
                    {[...itinerary].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)).map((item, idx) => (
                      <div
                        key={item._id}
                        className="d-flex gap-3 align-items-start p-3 rounded-3"
                        style={{
                          background: item.completed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${item.completed ? 'rgba(255,255,255,0.05)' : 'rgba(99, 102, 241, 0.25)'}`,
                          opacity: item.completed ? 0.6 : 1,
                          textDecoration: item.completed ? 'line-through' : 'none'
                        }}
                      >
                        <button className="btn p-0 mt-1 flex-shrink-0" onClick={() => handleToggleComplete(item)}>
                          {item.completed
                            ? <CheckCircle size={18} className="text-success" />
                            : <Circle size={18} className="text-secondary" />}
                        </button>

                        <div className="flex-shrink-0 text-center" style={{ minWidth: '64px' }}>
                          <div className="text-primary fw-bold small font-monospace">{item.time}</div>
                          {idx < itinerary.length - 1 && (
                            <div className="mx-auto mt-1" style={{ width: '2px', height: '24px', background: 'rgba(99, 102, 241, 0.3)' }} />
                          )}
                        </div>

                        <div className="flex-grow-1">
                          <div className="d-flex align-items-start gap-2">
                            {(() => {
                              const CatIcon = getCategoryIcon(item.type);
                              return <CatIcon size={16} className="text-primary mt-0.5 flex-shrink-0" />;
                            })()}
                            <div>
                              <div className=" fw-semibold small mb-1" style={{ color: "var(--heading-color)" }}>{item.title}</div>
                              <div className="d-flex gap-2 flex-wrap align-items-center">
                                <span className="text-secondary small">
                                  <MapPin size={11} className="me-1" />{item.location}
                                </span>
                                {item.category && (
                                  <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: '9px' }}>
                                    {item.category}
                                  </span>
                                )}
                              </div>
                              {item.notes && (
                                <div className="text-secondary mt-1" style={{ fontSize: '11px' }}>{item.notes}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-1 flex-shrink-0">
                          <a
                            href="/floor-plan"
                            className="btn btn-sm py-1 px-2 text-secondary"
                            title="View on Map"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                          >
                            <Navigation size={12} />
                          </a>
                          <button
                            className="btn btn-sm py-1 px-2 text-danger"
                            style={{ background: 'rgba(255,255,255,0.04)' }}
                            onClick={() => handleDeleteItem(item._id)}
                            title="Remove"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============= FAVORITES TAB ============= */}
          {activeTab === 'favorites' && (
            <div>
              {favorites.length === 0 ? (
                <div className="glass-card text-center py-5">
                  <Heart size={36} className="text-danger mb-3" />
                  <h5 className=" fw-bold mb-2" style={{ color: "var(--heading-color)" }}>No Saved Items</h5>
                  <p className="text-secondary small mb-3">Browse exhibitors, sessions, and speakers to save items here</p>
                  <a href="/exhibitors" className="btn btn-primary-custom btn-sm">Browse Exhibitors</a>
                </div>
              ) : (
                <div className="row g-3">
                  {favorites.map(fav => (
                    <div key={fav._id} className="col-12 col-md-6">
                      <div className="glass-card p-3 d-flex align-items-start gap-3">
                        <div className="p-2 rounded-2" style={{ background: 'rgba(239, 68, 68, 0.15)', flexShrink: 0 }}>
                          <Heart size={16} className="text-danger" />
                        </div>
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className=" fw-semibold small text-truncate" style={{ color: "var(--heading-color)" }}>{fav.title}</span>
                            <span className="badge bg-primary bg-opacity-15 text-primary flex-shrink-0" style={{ fontSize: '9px', textTransform: 'capitalize' }}>{fav.itemType}</span>
                          </div>
                          {fav.subtitle && <div className="text-secondary small text-truncate">{fav.subtitle}</div>}
                          {fav.location && (
                            <div className="text-secondary small">
                              <MapPin size={10} className="me-1" />{fav.location}
                            </div>
                          )}
                        </div>
                        <div className="d-flex gap-1 flex-shrink-0">
                          {fav.itemType === 'booth' && (
                            <a href="/floor-plan" className="btn btn-sm p-1 text-primary" title="View on Map">
                              <Navigation size={12} />
                            </a>
                          )}
                          <button className="btn btn-sm p-1 text-danger" onClick={() => handleRemoveFavorite(fav._id)} title="Remove">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============= MEETINGS TAB ============= */}
          {activeTab === 'meetings' && (
            <div>
              {meetings.length === 0 ? (
                <div className="glass-card text-center py-5">
                  <Calendar size={36} className="text-primary mb-3" />
                  <h5 className=" fw-bold mb-2" style={{ color: "var(--heading-color)" }}>No Meetings Scheduled</h5>
                  <p className="text-secondary small mb-3">Book meetings with exhibitors from their profile pages</p>
                  <a href="/exhibitors" className="btn btn-primary-custom btn-sm">Browse Exhibitors</a>
                </div>
              ) : (
                <div className="glass-card p-4">
                  <h6 className=" fw-bold mb-3" style={{ color: "var(--heading-color)" }}>Scheduled Meetings ({meetings.length})</h6>
                  <div className="d-flex flex-column gap-2">
                    {meetings.map(m => (
                      <div key={m._id} className="d-flex align-items-center gap-3 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="p-2 rounded-2 flex-shrink-0" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                          <Calendar size={16} className="text-primary" />
                        </div>
                        <div className="flex-grow-1">
                          <div className=" fw-semibold small mb-1" style={{ color: "var(--heading-color)" }}>
                            {m.exhibitorId?.companyName || 'Exhibitor Company'}
                          </div>
                          <div className="text-secondary small">{m.purpose}</div>
                          <div className="text-secondary small">
                            <Clock size={10} className="me-1" />{m.date} at {m.time} • {m.location}
                          </div>
                        </div>
                        <span className={`badge flex-shrink-0 ${m.status === 'approved' ? 'bg-success bg-opacity-20 text-success' : m.status === 'rejected' ? 'bg-danger bg-opacity-20 text-danger' : 'bg-warning bg-opacity-20 text-warning'}`}>
                          {m.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============= DIGITAL VISITOR BADGE TAB ============= */}
          {activeTab === 'badge' && (
            <div className="d-flex justify-content-center">
              <div style={{ maxWidth: '400px', width: '100%' }}>
                <div className="glass-card overflow-hidden">
                  {/* Badge Header Gradient */}
                  <div className="p-4 text-center" style={{ background: 'linear-gradient(135deg, #0f1629, #1e1b4b)', borderBottom: '1px solid rgba(99, 102, 241, 0.4)' }}>
                    <div className="text-primary fw-bold mb-1" style={{ letterSpacing: '0.3em', fontSize: '0.7rem' }}>OFFICIAL DELEGATE PASS</div>
                    <div className=" fw-bold fs-4 mb-0" style={{ color: "var(--heading-color)" }}>EVENTSPHERE 2026</div>
                    <div className="text-secondary small">World Technology Expo • Convention Center</div>
                  </div>

                  <div className="p-4">
                    {/* Avatar */}
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                        style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #6366f1, #3b82f6)', fontSize: '1.5rem' }}
                      >
                        {(user?.name || 'A').charAt(0)}
                      </div>
                      <div>
                        <div className=" fw-bold fs-5 mb-0" style={{ color: "var(--heading-color)" }}>{user?.name || 'Delegate'}</div>
                        <div className="text-secondary small">{user?.email}</div>
                        <div className="text-secondary small">{user?.company || 'Registered Attendee'}</div>
                        <span className="badge bg-primary bg-opacity-20 text-primary mt-1" style={{ fontSize: '10px' }}>ATTENDEE</span>
                      </div>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="text-center mb-4">
                      <div
                        className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-3"
                        style={{ width: '160px', height: '160px', background: 'white', padding: '8px' }}
                      >
                        {/* Simulated QR Pattern */}
                        <svg viewBox="0 0 120 120" width="144" height="144" xmlns="http://www.w3.org/2000/svg">
                          {/* QR corners */}
                          <rect x="5" y="5" width="32" height="32" fill="none" stroke="#000" strokeWidth="4" />
                          <rect x="12" y="12" width="18" height="18" fill="#000" />
                          <rect x="83" y="5" width="32" height="32" fill="none" stroke="#000" strokeWidth="4" />
                          <rect x="90" y="12" width="18" height="18" fill="#000" />
                          <rect x="5" y="83" width="32" height="32" fill="none" stroke="#000" strokeWidth="4" />
                          <rect x="12" y="90" width="18" height="18" fill="#000" />
                          {/* Random modules */}
                          {[45,50,55,65,70,45,55,65,75,50,60,70,45,65,75,50,60,45,55,75].map((x, i) => (
                            <rect key={i} x={x} y={45 + (i % 7) * 7} width="5" height="5" fill="#000" />
                          ))}
                          <text x="60" y="116" textAnchor="middle" fontSize="7" fill="#000" fontFamily="monospace">EventSphere • Pass ID: {(user?.name || 'A').substring(0,4).toUpperCase()}2026</text>
                        </svg>
                      </div>
                      <div className="text-secondary small font-monospace">Scan for Digital Booth Check-In</div>
                    </div>

                    {/* Badge Details */}
                    <div className="row g-2 mb-4">
                      {[
                        { label: 'Badge Type', value: 'Delegate' },
                        { label: 'Access Level', value: 'Full Exhibition' },
                        { label: 'Valid Date', value: 'Aug 25-28, 2026' },
                        { label: 'Venue', value: 'Hall A, B, C, D' },
                      ].map(({ label, value }) => (
                        <div key={label} className="col-6">
                          <div className="rounded-2 p-2 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="text-secondary" style={{ fontSize: '9px', textTransform: 'uppercase' }}>{label}</div>
                            <div className=" small fw-semibold" style={{ color: "var(--heading-color)" }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary-custom btn-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={() => window.print()}
                      >
                        <Download size={14} /> Download / Print Badge
                      </button>
                      <button
                        className="btn btn-outline-custom btn-sm d-flex align-items-center justify-content-center gap-2"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: 'My EventSphere Badge', text: `${user?.name} — EventSphere 2026 Delegate Pass`, url: window.location.href });
                          }
                        }}
                      >
                        Share Badge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add to Itinerary Modal */}
      {showAddModal && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 9999 }}>
          <div className="glass-card p-4" style={{ width: '100%', maxWidth: '460px' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Add to My Itinerary</h5>
              <button className="btn p-0 text-secondary" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="row g-2">
                <div className="col-5">
                  <label className="form-label text-secondary small">Time</label>
                  <input type="text" className="form-control form-control-sm border-secondary " style={{ color: "var(--heading-color)" }} placeholder="e.g. 10:00 AM"
                    value={newItem.time} onChange={e => setNewItem(p => ({ ...p, time: e.target.value }))} />
                </div>
                <div className="col-7">
                  <label className="form-label text-secondary small">Category</label>
                  <select className="form-select form-select-sm"
                    value={newItem.type} onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))}>
                    <option value="session">Session</option>
                    <option value="keynote">Keynote</option>
                    <option value="booth">Booth Visit</option>
                    <option value="meal">Dining</option>
                    <option value="meeting">Meeting</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="form-label text-secondary small">Title</label>
                <input type="text" className="form-control form-control-sm border-secondary " style={{ color: "var(--heading-color)" }} placeholder="Activity title..."
                  value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div>
                <label className="form-label text-secondary small">Location</label>
                <input type="text" className="form-control form-control-sm border-secondary " style={{ color: "var(--heading-color)" }} placeholder="e.g. Hall A, Booth B-204..."
                  value={newItem.location} onChange={e => setNewItem(p => ({ ...p, location: e.target.value }))} />
              </div>
              <div>
                <label className="form-label text-secondary small">Notes (optional)</label>
                <input type="text" className="form-control form-control-sm border-secondary " style={{ color: "var(--heading-color)" }} placeholder="Optional reminder notes..."
                  value={newItem.notes} onChange={e => setNewItem(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-outline-custom btn-sm flex-fill" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button className="btn btn-primary-custom btn-sm flex-fill" onClick={handleAddItem}>
                  <Plus size={13} className="me-1" /> Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
