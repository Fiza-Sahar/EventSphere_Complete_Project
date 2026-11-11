import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { User, Building, Mail, Award, Search, Sparkles, Mic, Calendar, Globe, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const res = await api.get('/speakers', { params: { search } });
      setSpeakers(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSpeakers();
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 glass-card border-primary border-opacity-30">
          <Mic className="text-primary" size={14} />
          <span className="small text-light fw-medium">Visionary Keynote Presenters</span>
        </div>
        <h1 className="display-5 fw-extrabold text-white mb-2 tracking-tight">
          Keynote <span className="text-gradient">Speakers & Thought Leaders</span>
        </h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>
          Learn directly from distinguished researchers, global innovators, and executive leaders shaping the next decade of technology and enterprise.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-3 mb-5 border-primary border-opacity-25" style={{ maxWidth: '650px', margin: '0 auto' }}>
        <form onSubmit={handleSearchSubmit} className="d-flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keynote speakers by name, topic, or company..."
            className="form-control"
          />
          <button type="submit" className="btn btn-primary-custom px-4 d-flex align-items-center gap-1.5">
            <Search size={16} /> Search
          </button>
        </form>
      </div>

      {/* Speakers Grid */}
      {loading ? (
        <div className="p-5 text-center text-secondary">Loading speakers roster...</div>
      ) : (
        <div className="row g-4">
          {speakers.map((speaker) => (
            <div key={speaker._id} className="col-md-6 col-lg-4">
              <div className="glass-card glass-card-hover p-4 h-100 text-center d-flex flex-column align-items-center justify-content-between">
                <div>
                  <div className="position-relative d-inline-block mb-3">
                    <img 
                      src={speaker.avatar} 
                      alt={speaker.name} 
                      className="rounded-circle object-fit-cover shadow-lg" 
                      style={{ width: '105px', height: '105px', border: '3px solid #6366f1' }} 
                    />
                    <div className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-1.5 shadow">
                      <Mic size={12} className="text-white" />
                    </div>
                  </div>

                  <h5 className="fw-bold text-white mb-1">{speaker.name}</h5>
                  <div className="text-primary small fw-semibold mb-1">{speaker.title}</div>
                  <div className="text-secondary small mb-3">{speaker.company}</div>
                  <p className="text-secondary small mb-3 line-clamp-3" style={{ lineHeight: '1.6', minHeight: '60px' }}>
                    {speaker.bio}
                  </p>
                </div>

                <div className="w-100 pt-3 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
                  <div className="badge bg-dark bg-opacity-75 text-light border border-secondary border-opacity-50 py-2 small text-truncate d-flex align-items-center justify-content-center gap-1.5">
                    <Mic size={12} className="text-primary flex-shrink-0" />
                    <span className="text-truncate">{speaker.topic}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedSpeaker(speaker)}
                    className="btn btn-outline-custom btn-sm w-100 mt-1"
                  >
                    View Full Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card text-white border-primary border-opacity-50 shadow-lg p-3">
              <div className="modal-header border-secondary border-opacity-25 pb-3">
                <div className="d-flex align-items-center gap-3">
                  <img 
                    src={selectedSpeaker.avatar} 
                    alt={selectedSpeaker.name} 
                    className="rounded-circle object-fit-cover" 
                    style={{ width: '60px', height: '60px', border: '2px solid #6366f1' }} 
                  />
                  <div>
                    <h5 className="modal-title fw-bold mb-0">{selectedSpeaker.name}</h5>
                    <small className="text-primary fw-semibold">{selectedSpeaker.title} • {selectedSpeaker.company}</small>
                  </div>
                </div>
                <button onClick={() => setSelectedSpeaker(null)} className="btn-close btn-close-white"></button>
              </div>

              <div className="modal-body py-3">
                <h6 className="fw-bold text-white mb-2">Biography</h6>
                <p className="text-secondary small mb-3" style={{ lineHeight: '1.7' }}>
                  {selectedSpeaker.bio}
                </p>

                <div className="p-3 rounded-3 bg-dark bg-opacity-75 border border-secondary border-opacity-25 mb-3">
                  <span className="text-muted small d-block mb-1 font-monospace" style={{ fontSize: '11px' }}>KEYNOTE TOPIC</span>
                  <div className="fw-bold text-white">{selectedSpeaker.topic}</div>
                </div>

                <div className="d-flex align-items-center justify-content-between pt-2">
                  <Link to="/schedule" className="btn btn-primary-custom btn-sm" onClick={() => setSelectedSpeaker(null)}>
                    <Calendar size={14} /> View Arena Schedule
                  </Link>
                  <button onClick={() => setSelectedSpeaker(null)} className="btn btn-outline-custom btn-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Speakers;
