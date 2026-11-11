import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Users, Mail, Ticket, Building, CheckCircle2, RefreshCw, Search } from 'lucide-react';

const AttendeeManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations');
      setRegistrations(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCheckIn = async (regId) => {
    setActionLoading(regId);
    try {
      const res = await api.put(`/registrations/${regId}/check-in`);
      setRegistrations(prev => prev.map(r => r._id === regId ? res.data.registration : r));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = registrations.filter(r => {
    const term = search.toLowerCase();
    const name = r.userId?.name?.toLowerCase() || '';
    const email = r.userId?.email?.toLowerCase() || '';
    const code = r.ticketCode?.toLowerCase() || '';
    return name.includes(term) || email.includes(term) || code.includes(term);
  });

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h4 className="fw-bold text-white mb-0">Delegate Pass & Attendee Management</h4>
          <p className="text-muted small mb-0">Verify tickets, scan badges, and confirm on-site delegate check-ins.</p>
        </div>

        <div className="position-relative" style={{ minWidth: '260px' }}>
          <input
            type="text"
            placeholder="Search by name, email, or ticket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control ps-4"
            style={{ fontSize: '0.85rem' }}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-5 text-center text-muted d-flex align-items-center justify-content-center gap-2">
            <RefreshCw className="animate-spin text-primary" size={20} /> Loading delegates...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-5 text-center text-muted">
            No delegate registrations matching your filter.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0 align-middle">
              <thead>
                <tr className="text-secondary border-secondary small">
                  <th className="ps-4">Delegate Name</th>
                  <th>Email</th>
                  <th>Expo Title</th>
                  <th>Ticket Tier</th>
                  <th>Ticket Code</th>
                  <th>Status</th>
                  <th className="pe-4 text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((reg) => (
                  <tr key={reg._id} className="border-secondary border-opacity-25">
                    <td className="ps-4 fw-bold text-white">
                      {reg.userId?.name || 'Delegate'}
                    </td>
                    <td className="text-secondary small">{reg.userId?.email || 'N/A'}</td>
                    <td className="text-light small">{reg.expoId?.title || 'Global Tech Expo'}</td>
                    <td>
                      <span className="badge bg-primary bg-opacity-25 text-primary">
                        {reg.ticketType}
                      </span>
                    </td>
                    <td>
                      <span className="font-monospace text-warning small">{reg.ticketCode}</span>
                    </td>
                    <td>
                      <span className={`badge ${reg.status === 'checked-in' ? 'bg-success' : 'bg-secondary'}`}>
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button
                        onClick={() => handleToggleCheckIn(reg._id)}
                        disabled={actionLoading === reg._id}
                        className={`btn btn-sm ${reg.status === 'checked-in' ? 'btn-outline-custom' : 'btn-primary-custom'} py-1 px-2.5 small`}
                      >
                        {actionLoading === reg._id ? 'Updating...' : reg.status === 'checked-in' ? 'Undo Check-In' : '✓ Check In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeManagement;
