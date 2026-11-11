import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Check, X, Building2, MapPin, Mail, Box } from 'lucide-react';

const ExhibitorManagement = () => {
  const [exhibitors, setExhibitors] = useState([]);

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const fetchExhibitors = async () => {
    try {
      const res = await api.get('/exhibitors');
      setExhibitors(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/exhibitors/${id}/status`, { status });
      fetchExhibitors();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold text-white mb-0">Exhibitor Management</h4>
        <p className="text-muted small">Approve or reject exhibitor registrations and verify assigned booth numbers.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-dark table-hover mb-0 align-middle">
            <thead>
              <tr className="text-muted border-secondary">
                <th>Company</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Assigned Booth</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {exhibitors.map((ex) => (
                <tr key={ex._id}>
                  <td className="fw-bold text-white d-flex align-items-center gap-2">
                    <img src={ex.logo} alt="" className="rounded" style={{ width: 32, height: 32 }} />
                    {ex.companyName}
                  </td>
                  <td><span className="badge badge-occupied">{ex.category}</span></td>
                  <td className="text-muted small">{ex.contactEmail}</td>
                  <td><strong className="text-white">Booth {ex.boothNumber || 'Unassigned'}</strong></td>
                  <td>
                    <span className={`badge ${ex.status === 'approved' ? 'bg-success' : ex.status === 'rejected' ? 'bg-danger' : 'bg-warning'}`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="text-end">
                    {ex.status !== 'approved' && (
                      <button onClick={() => handleStatusUpdate(ex._id, 'approved')} className="btn btn-sm btn-success me-2">
                        <Check size={16} /> Approve
                      </button>
                    )}
                    {ex.status !== 'rejected' && (
                      <button onClick={() => handleStatusUpdate(ex._id, 'rejected')} className="btn btn-sm btn-outline-danger">
                        <X size={16} /> Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorManagement;
