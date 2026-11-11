import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ExpoScene from '../../three/ExpoScene';
import { Box, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MyBooths = () => {
  const { user } = useAuth();
  const [booths, setBooths] = useState([]);
  const [myBooth, setMyBooth] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchBooths();
  }, []);

  const fetchBooths = async () => {
    try {
      const res = await api.get('/booths');
      setBooths(res.data);
      const found = res.data.find(b => b.status === 'OCCUPIED') || res.data[0];
      setMyBooth(found);
      if (found) setDescription(found.description || '');
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!myBooth) return;
    try {
      await api.put(`/booths/${myBooth._id}`, { description });
      /* toast: Booth info updated & synced with 3D floor map */
      fetchBooths();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold mb-0" style={{ color: "var(--heading-color)" }}>My 3D Booth View & Management</h4>
        <p className="text-muted small">View your assigned 3D booth mesh in the expo hall and update live display metadata.</p>
      </div>

      <div className="row g-4">
        {/* 3D Scene View */}
        <div className="col-lg-8" style={{ height: '450px' }}>
          <div className="glass-card h-100 overflow-hidden position-relative">
            <ExpoScene
              booths={myBooth ? [myBooth] : booths.slice(0, 5)}
              selectedBooth={myBooth}
              onSelectBooth={() => {}}
            />
          </div>
        </div>

        {/* Edit Details */}
        <div className="col-lg-4">
          <div className="glass-card p-4">
            <h5 className="fw-bold  mb-3" style={{ color: "var(--heading-color)" }}>Booth {myBooth?.boothNumber || 'A12'} Details</h5>
            <form onSubmit={handleSave} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-bold">Company Name Banner</label>
                <input type="text" disabled value={myBooth?.companyName || user?.company} className="form-control" />
              </div>
              <div>
                <label className="form-label small fw-bold">Category</label>
                <input type="text" disabled value={myBooth?.category || 'Artificial Intelligence'} className="form-control" />
              </div>
              <div>
                <label className="form-label small fw-bold">Booth Presentation Description</label>
                <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} className="form-control" placeholder="Describe your booth exhibits and live demos..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary-custom py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2">
                <Save size={18} /> Update Live 3D Booth Info
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooths;
