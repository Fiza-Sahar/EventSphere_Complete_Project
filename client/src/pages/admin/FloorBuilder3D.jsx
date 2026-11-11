import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import ExpoScene from '../../three/ExpoScene';
import { MapPin, Save, RefreshCw, Layers } from 'lucide-react';

const FloorBuilder3D = () => {
  const [booths, setBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooths();
  }, []);

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

  const updatePosition = async (axis, delta) => {
    if (!selectedBooth) return;
    const newPos = {
      ...selectedBooth.position,
      [axis]: Math.round((selectedBooth.position[axis] + delta) * 10) / 10
    };
    const updated = { ...selectedBooth, position: newPos };
    setSelectedBooth(updated);
    setBooths(prev => prev.map(b => b._id === updated._id ? updated : b));

    try {
      await api.put(`/booths/${updated._id}`, { position: newPos });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="d-flex flex-column gap-3" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="fw-bold text-white mb-0">3D Interactive Floor Builder</h4>
          <p className="text-muted small mb-0">Select any 3D booth mesh to dynamically adjust its spatial X / Z grid coordinates.</p>
        </div>
      </div>

      <div className="flex-grow-1 position-relative glass-card overflow-hidden">
        {loading ? (
          <div className="h-100 d-flex align-items-center justify-content-center text-muted gap-2">
            <RefreshCw className="animate-spin text-primary" /> Loading 3D Floor Builder...
          </div>
        ) : (
          <ExpoScene
            booths={booths}
            selectedBooth={selectedBooth}
            onSelectBooth={(b) => setSelectedBooth(b)}
          />
        )}

        {/* Floating Position Nudge Controls */}
        {selectedBooth && (
          <div className="position-absolute top-0 end-0 m-4 glass-card p-4 shadow-lg" style={{ width: '320px', zIndex: 1040 }}>
            <h5 className="fw-bold text-white mb-1">Move Booth {selectedBooth.boothNumber}</h5>
            <div className="text-muted small mb-3">Company: {selectedBooth.companyName || 'Available'}</div>

            <div className="mb-3 p-3 rounded bg-dark border border-secondary text-center font-monospace">
              X: {selectedBooth.position?.x} | Z: {selectedBooth.position?.z}
            </div>

            <div className="d-flex flex-column align-items-center gap-2 mb-3">
              <button onClick={() => updatePosition('z', -2)} className="btn btn-sm btn-outline-custom w-50">▲ Move North (-Z)</button>
              <div className="d-flex gap-2 w-100">
                <button onClick={() => updatePosition('x', -2)} className="btn btn-sm btn-outline-custom flex-grow-1">◄ West (-X)</button>
                <button onClick={() => updatePosition('x', 2)} className="btn btn-sm btn-outline-custom flex-grow-1">East (+X) ►</button>
              </div>
              <button onClick={() => updatePosition('z', 2)} className="btn btn-sm btn-outline-custom w-50">▼ Move South (+Z)</button>
            </div>

            <button onClick={() => setSelectedBooth(null)} className="btn btn-primary-custom btn-sm w-100">Done Moving</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorBuilder3D;
