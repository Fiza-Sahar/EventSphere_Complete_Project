import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, Globe, Eye, CheckCircle2 } from 'lucide-react';

const ExpoManagement = () => {
  const [expos, setExpos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    theme: '',
    location: '',
    startDate: '',
    endDate: '',
    category: 'Technology',
    capacity: 5000
  });

  useEffect(() => {
    fetchExpos();
  }, []);

  const fetchExpos = async () => {
    try {
      const res = await api.get('/expos');
      setExpos(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expos', formData);
      setShowModal(false);
      fetchExpos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expo?')) {
      try {
        await api.delete(`/expos/${id}`);
        fetchExpos();
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  const togglePublish = async (expo) => {
    const newStatus = expo.status === 'published' ? 'draft' : 'published';
    try {
      await api.put(`/expos/${expo._id}`, { status: newStatus });
      fetchExpos();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>Expo Management</h4>
          <p className="text-muted small">Create, publish, and configure global trade shows.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary-custom d-flex align-items-center gap-2">
          <Plus size={18} /> Create Expo
        </button>
      </div>

      {/* Expo Table */}
      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle" style={{ color: "var(--text-main)" }}>
            <thead>
              <tr className="text-muted border-secondary">
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Dates</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expos.map((expo) => (
                <tr key={expo._id}>
                  <td className="fw-bold" style={{ color: "var(--heading-color)" }}>{expo.title}</td>
                  <td><span className="badge bg-primary bg-opacity-25 text-primary">{expo.category}</span></td>
                  <td className="text-muted small">{expo.location}</td>
                  <td className="text-muted small">{new Date(expo.startDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${expo.status === 'published' ? 'bg-success' : 'bg-secondary'}`}>
                      {expo.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <button onClick={() => togglePublish(expo)} className="btn btn-sm btn-outline-custom me-2">
                      {expo.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => handleDelete(expo._id)} className="btn btn-sm btn-danger">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card">
              <div className="modal-header border-secondary">
                <h5 className="modal-title fw-bold">Create New Expo</h5>
                <button onClick={() => setShowModal(false)} className="btn-close btn-close-white"></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body d-flex flex-column gap-3">
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Expo Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="form-control" />
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="form-select">
                      <option value="Technology">Technology</option>
                      <option value="Sustainability">Sustainability</option>
                      <option value="Fintech">Fintech</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Location</label>
                    <input type="text" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="form-control" />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Start Date</label>
                      <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="form-control" />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>End Date</label>
                      <input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="form-control" />
                    </div>
                  </div>
                  <div>
                    <label className="form-label small fw-bold" style={{ color: "var(--text-secondary)" }}>Description</label>
                    <textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-control"></textarea>
                  </div>
                </div>
                <div className="modal-footer border-secondary">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline-custom">Cancel</button>
                  <button type="submit" className="btn btn-primary-custom">Create Expo</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpoManagement;
