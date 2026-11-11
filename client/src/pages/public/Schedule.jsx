import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, MapPin, Bookmark, CheckCircle2, AlertTriangle, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Schedule = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [category, setCategory] = useState('');
  const [registeredIds, setRegisteredIds] = useState([]);
  const [alertMsg, setAlertMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSessions();
  }, [category]);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions', { params: { category } });
      setSessions(res.data);
      if (user) {
        const userIds = res.data
          .filter(s => s.attendees?.includes(user._id))
          .map(s => s._id);
        setRegisteredIds(userIds);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleRegisterSession = async (sessionId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      const res = await api.post(`/sessions/${sessionId}/register`);
      setAlertMsg({ type: 'success', text: res.data.message });
      if (res.data.registered) {
        setRegisteredIds(prev => [...prev, sessionId]);
      } else {
        setRegisteredIds(prev => prev.filter(id => id !== sessionId));
      }
      fetchSessions();
    } catch (err) {
      setAlertMsg({ type: 'danger', text: err.message });
    }
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-extrabold mb-2" style={{ color: 'var(--heading-color)' }}>
          Event <span className="text-gradient">Schedule</span>
        </h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>
          Explore keynotes, technical workshops, panel discussions, and bookmark your personal timetable.
        </p>
      </div>

      {alertMsg.text && (
        <div className={`alert alert-${alertMsg.type} d-flex align-items-center gap-2 mb-4 p-3 rounded-3`}>
          {alertMsg.type === 'danger' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
        {['', 'Artificial Intelligence', 'Cybersecurity', 'Cloud Computing', 'Robotics', 'Clean Technology', 'Fintech'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`btn btn-sm ${category === cat ? 'btn-primary-custom' : 'btn-outline-custom'}`}
            style={{ borderRadius: '9999px', padding: '6px 16px', fontSize: '0.84rem' }}
          >
            {cat || 'All Categories'}
          </button>
        ))}
      </div>

      {/* Sessions Timetable Cards */}
      <div className="d-flex flex-column gap-3">
        {sessions.map((session) => {
          const isBookmarked = registeredIds.includes(session._id);
          return (
            <div key={session._id} className="glass-card p-4 shadow-sm">
              <div className="row align-items-center g-3">
                <div className="col-md-3">
                  <span className="badge bg-primary bg-opacity-20 text-primary mb-2 px-2.5 py-1 rounded-pill">
                    {session.category}
                  </span>
                  <div className="d-flex align-items-center gap-2 fw-bold" style={{ color: 'var(--text-main)' }}>
                    <Clock size={16} className="text-primary" /> {session.startTime} - {session.endTime}
                  </div>
                  <div className="text-secondary small d-flex align-items-center gap-1 mt-1">
                    <Calendar size={14} /> {session.date}
                  </div>
                  <div className="text-secondary small d-flex align-items-center gap-1 mt-1">
                    <MapPin size={14} className="text-info" /> {session.location}
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>{session.title}</h5>
                  <p className="text-secondary small mb-2">{session.description}</p>
                  <div className="text-secondary small d-flex align-items-center gap-1">
                    <User size={14} className="text-primary" /> Speaker: <strong style={{ color: 'var(--text-main)' }}>{session.speakerName || 'Featured Speaker'}</strong>
                  </div>
                </div>

                <div className="col-md-3 text-md-end">
                  <button
                    onClick={() => handleRegisterSession(session._id)}
                    className={`btn ${isBookmarked ? 'btn-primary-custom' : 'btn-outline-custom'} w-100 d-flex align-items-center justify-content-center gap-2 py-2.5`}
                  >
                    <Bookmark size={16} />
                    <span>{isBookmarked ? 'Saved to Schedule' : 'Add to Schedule'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Schedule;
