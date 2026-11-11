import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, Calendar, Clock, MapPin } from 'lucide-react';

const ScheduleManagement = () => {
  const [sessions, setSessions] = useState([]);
  const [expos, setExpos] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    speakerName: '',
    expoId: '',
    category: 'Artificial Intelligence',
    date: '2026-09-15',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    location: 'Main Auditorium'
  });

  useEffect(() => {
    fetchSessions();
    fetchExposAndSpeakers();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/sessions');
      setSessions(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchExposAndSpeakers = async () => {
    try {
      const [eRes, sRes] = await Promise.all([api.get('/expos'), api.get('/speakers')]);
      setExpos(eRes.data);
      setSpeakers(sRes.data);
      if (eRes.data.length > 0) setFormData(prev => ({ ...prev, expoId: eRes.data[0]._id }));
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/sessions', formData);
      setShowModal(false);
      fetchSessions();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete session?')) {
      try {
        await api.delete(`/sessions/${id}`);
        fetchSessions();
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Schedule & Session Management</h4>
          <p className="text-muted small">Manage keynote presentations, panel sessions, and room assignments.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary-custom d-flex align-items-center gap-2">
          <Plus size={18} /> Add Session
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr className="text-muted border-secondary">
                <th>Session Title</th>
                <th>Speaker</th>
                <th>Category</th>
                <th>Time & Date</th>
                <th>Room</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s._id}>
                  <td className="fw-bold " style={{ color: "var(--heading-color)" }}>{s.title}</td>
                  <td className="text-muted small">{s.speakerName || 'Featured Speaker'}</td>
                  <td><span className="badge badge-occupied">{s.category}</span></td>
                  <td className="text-muted small">{s.date} ({s.startTime} - {s.endTime})</td>
                  <td className="text-muted small">{s.location}</td>
                  <td className="text-end">
                    <button onClick={() => handleDelete(s._id)} className="btn btn-sm btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Create Event Session</h5>
                <button onClick={() => setShowModal(false)} className="btn-close btn-close-white"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Session Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Speaker Name</label>
                    <input type="text" required value={formData.speakerName} onChange={e => setFormData({...formData, speakerName: e.target.value})} className="form-control" />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Date</label>
                      <input type="text" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="form-control" placeholder="2026-09-15" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Start Time</label>
                      <input type="text" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="form-control" placeholder="10:00 AM" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Location / Room</label>
                    <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Description</label>
                    <textarea rows="2" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-control"></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-custom">Cancel</button>
                  <button type="submit" className="btn btn-primary-custom">Create Session</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManagement;
