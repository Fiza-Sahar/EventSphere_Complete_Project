import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Box, Edit, Plus, Trash2, MapPin, CheckCircle2, Search, RefreshCw, Send, Sparkles } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const BoothManagement = () => {
  const [booths, setBooths] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const socket = useSocket();

  useEffect(() => {
    fetchBooths();
    fetchExhibitors();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('booth_updated', (updated) => {
      setBooths(prev => prev.map(b => b._id === updated._id ? updated : b));
    });
    return () => socket.off('booth_updated');
  }, [socket]);

  const fetchBooths = async () => {
    try {
      const res = await api.get('/booths');
      setBooths(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchExhibitors = async () => {
    try {
      const res = await api.get('/exhibitors');
      setExhibitors(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleQuickStatus = async (booth, newStatus) => {
    setUpdatingId(booth._id);
    try {
      const res = await api.put(`/booths/${booth._id}`, { ...booth, status: newStatus });
      setBooths(prev => prev.map(b => b._id === booth._id ? res.data : b));
    } catch (err) {
      console.error(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateBooth = async (e) => {
    e.preventDefault();
    if (!selectedBooth) return;
    try {
      const res = await api.put(`/booths/${selectedBooth._id}`, selectedBooth);
      setBooths(prev => prev.map(b => b._id === selectedBooth._id ? res.data : b));
      setSelectedBooth(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const filtered = booths.filter(b => {
    const matchesSearch = b.boothNumber.toLowerCase().includes(search.toLowerCase()) ||
      (b.companyName && b.companyName.toLowerCase().includes(search.toLowerCase())) ||
      (b.category && b.category.toLowerCase().includes(search.toLowerCase()));
    const matchesSector = sector === 'ALL' || b.boothNumber.startsWith(sector);
    return matchesSearch && matchesSector;
  });

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
        <div>
          <h4 className="fw-bold  mb-0" style={{ color: "var(--heading-color)" }}>3D Spatial Booth & Sector Controller</h4>
          <p className="text-secondary small mb-0">Manage 50 spatial booth coordinates, assign corporate exhibitors, and broadcast real-time availability.</p>
        </div>

        <div className="d-flex gap-2">
          {['ALL', 'A', 'B', 'C', 'D'].map(sec => (
            <button
              key={sec}
              onClick={() => setSector(sec)}
              className={`btn btn-sm ${sector === sec ? 'btn-primary-custom' : 'btn-outline-custom'}`}
              style={{ fontSize: '0.8rem', padding: '6px 14px' }}
            >
              {sec === 'ALL' ? 'All Sectors' : `Sector ${sec}`}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* Booths List Table */}
        <div className="col-lg-8">
          <div className="glass-card overflow-hidden">
            <div className="p-3 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search booth number, company name, or category..."
                className="form-control form-control-sm"
                style={{ maxWidth: '350px' }}
              />
              <span className="small text-secondary font-monospace">Showing {filtered.length} of {booths.length} Booths</span>
            </div>

            <div className="table-responsive" style={{ maxHeight: '600px' }}>
              <table className="table table-dark table-hover mb-0 align-middle">
                <thead className="sticky-top">
                  <tr className="text-secondary border-secondary small">
                    <th className="ps-3">Booth #</th>
                    <th>Category</th>
                    <th>Current Status</th>
                    <th>Assigned Exhibitor</th>
                    <th>Quick Status Action</th>
                    <th className="text-end pe-3">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b._id} className="border-secondary border-opacity-25">
                      <td className="ps-3 fw-bold  font-monospace" style={{ color: "var(--heading-color)" }}>{b.boothNumber}</td>
                      <td><span className="badge border border-secondary text-secondary small">{b.category}</span></td>
                      <td>
                        <span className={`badge ${b.status === 'AVAILABLE' ? 'bg-success' : b.status === 'RESERVED' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="text-muted small">{b.companyName || '— Available Space —'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            onClick={() => handleQuickStatus(b, 'AVAILABLE')}
                            disabled={updatingId === b._id}
                            className={`btn btn-xs ${b.status === 'AVAILABLE' ? 'btn-success' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '10px', padding: '2px 8px' }}
                          >
                            Open
                          </button>
                          <button
                            onClick={() => handleQuickStatus(b, 'RESERVED')}
                            disabled={updatingId === b._id}
                            className={`btn btn-xs ${b.status === 'RESERVED' ? 'btn-warning' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '10px', padding: '2px 8px' }}
                          >
                            Reserve
                          </button>
                          <button
                            onClick={() => handleQuickStatus(b, 'OCCUPIED')}
                            disabled={updatingId === b._id}
                            className={`btn btn-xs ${b.status === 'OCCUPIED' ? 'btn-primary' : 'btn-outline-secondary'}`}
                            style={{ fontSize: '10px', padding: '2px 8px' }}
                          >
                            Occupy
                          </button>
                        </div>
                      </td>
                      <td className="text-end pe-3">
                        <button onClick={() => setSelectedBooth(b)} className="btn btn-sm btn-outline-custom p-1.5">
                          <Edit size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Edit Booth Form Sidecard */}
        <div className="col-lg-4">
          <div className="glass-card p-4 sticky-top" style={{ top: '100px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
            <h5 className="fw-bold  mb-3 d-flex align-items-center gap-2" style={{ color: "var(--heading-color)" }}>
              <Box className="text-primary" size={18} />
              {selectedBooth ? `Edit Booth ${selectedBooth.boothNumber}` : 'Select a Booth to Edit'}
            </h5>
            {selectedBooth ? (
              <form onSubmit={handleUpdateBooth} className="d-flex flex-column gap-3">
                <div>
                  <label className="form-label small fw-bold text-secondary">Booth Number</label>
                  <input type="text" value={selectedBooth.boothNumber} onChange={e => setSelectedBooth({...selectedBooth, boothNumber: e.target.value})} className="form-control" />
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Status</label>
                  <select value={selectedBooth.status} onChange={e => setSelectedBooth({...selectedBooth, status: e.target.value})} className="form-select">
                    <option value="AVAILABLE">AVAILABLE (Open for Booking)</option>
                    <option value="RESERVED">RESERVED (Pending Approval)</option>
                    <option value="OCCUPIED">OCCUPIED (Confirmed)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Company Name</label>
                  <input type="text" value={selectedBooth.companyName || ''} onChange={e => setSelectedBooth({...selectedBooth, companyName: e.target.value})} className="form-control" placeholder="e.g. Apex Tech Solutions" />
                </div>
                <div>
                  <label className="form-label small fw-bold text-secondary">Category</label>
                  <select value={selectedBooth.category || 'Artificial Intelligence'} onChange={e => setSelectedBooth({...selectedBooth, category: e.target.value})} className="form-select">
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Clean Technology">Clean Technology</option>
                    <option value="Fintech">Fintech</option>
                  </select>
                </div>
                <div className="row g-2">
                  <div className="col-4">
                    <label className="form-label small fw-bold text-secondary">Pos X</label>
                    <input type="number" value={selectedBooth.position?.x} onChange={e => setSelectedBooth({...selectedBooth, position: {...selectedBooth.position, x: parseFloat(e.target.value)}})} className="form-control" />
                  </div>
                  <div className="col-4">
                    <label className="form-label small fw-bold text-secondary">Pos Y</label>
                    <input type="number" value={selectedBooth.position?.y} onChange={e => setSelectedBooth({...selectedBooth, position: {...selectedBooth.position, y: parseFloat(e.target.value)}})} className="form-control" />
                  </div>
                  <div className="col-4">
                    <label className="form-label small fw-bold text-secondary">Pos Z</label>
                    <input type="number" value={selectedBooth.position?.z} onChange={e => setSelectedBooth({...selectedBooth, position: {...selectedBooth.position, z: parseFloat(e.target.value)}})} className="form-control" />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-2">
                  <button type="submit" className="btn btn-primary-custom flex-grow-1">Save & Broadcast 3D</button>
                  <button type="button" onClick={() => setSelectedBooth(null)} className="btn btn-outline-custom">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="text-secondary small p-3 rounded-3 bg-opacity-50 border border-secondary border-opacity-25 text-center">
                Click any row or edit button to update coordinates, assigned exhibitor, or category. Changes sync live to 3D and all attendees.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothManagement;
