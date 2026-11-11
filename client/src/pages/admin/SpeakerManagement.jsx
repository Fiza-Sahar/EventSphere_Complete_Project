import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Trash2, User } from 'lucide-react';

const SpeakerManagement = () => {
  const [speakers, setSpeakers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    bio: '',
    topic: 'Keynote'
  });

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const res = await api.get('/speakers');
      setSpeakers(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/speakers', formData);
      setShowModal(false);
      fetchSpeakers();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete speaker profile?')) {
      try {
        await api.delete(`/speakers/${id}`);
        fetchSpeakers();
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Speaker Management</h4>
          <p className="text-muted small">Manage keynote speakers, company affiliations, and presentation topics.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary-custom d-flex align-items-center gap-2">
          <Plus size={18} /> Add Speaker
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr className="text-muted border-secondary">
                <th>Speaker Name</th>
                <th>Title</th>
                <th>Company</th>
                <th>Topic</th>
                <th className="text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((sp) => (
                <tr key={sp._id}>
                  <td className="fw-bold  d-flex align-items-center gap-2" style={{ color: "var(--heading-color)" }}>
                    <img src={sp.avatar} alt="" className="rounded-circle" style={{ width: 32, height: 32 }} />
                    {sp.name}
                  </td>
                  <td className="text-muted small">{sp.title}</td>
                  <td className="text-muted small">{sp.company}</td>
                  <td><span className="badge badge-occupied">{sp.topic}</span></td>
                  <td className="text-end">
                    <button onClick={() => handleDelete(sp._id)} className="btn btn-sm btn-danger">
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
                <h5 className="modal-title fw-bold">Add Keynote Speaker</h5>
                <button onClick={() => setShowModal(false)} className="btn-close btn-close-white"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Speaker Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Title / Designation</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Company / Institution</label>
                    <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Presentation Topic</label>
                    <input type="text" required value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Bio</label>
                    <textarea rows="3" required value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="form-control"></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-custom">Cancel</button>
                  <button type="submit" className="btn btn-primary-custom">Save Speaker</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeakerManagement;
