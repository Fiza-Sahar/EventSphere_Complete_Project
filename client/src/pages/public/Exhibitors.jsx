import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Search, Building2, MapPin, Globe, Mail, Phone, Package, 
  ShieldCheck, Box, ArrowRight, ExternalLink, Sparkles, X, Check 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { soundFX } from '../../utils/soundFX';

const Exhibitors = () => {
  const { isNeon } = useTheme();
  const [exhibitors, setExhibitors] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExhibitors();
  }, [category]);

  const fetchExhibitors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/exhibitors', { params: { search, category } });
      setExhibitors(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    soundFX.playClick();
    fetchExhibitors();
  };

  return (
    <div className="py-5" style={{ background: 'var(--bg-dark)', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Header Title */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill mb-3 glass-card" style={{ borderColor: 'var(--primary-glow)' }}>
            <Sparkles className="text-primary" size={16} />
            <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>Fortune 500 & Disruptive Tech Leaders</span>
          </div>
          <h1 className="display-5 fw-extrabold mb-3" style={{ color: 'var(--heading-color)' }}>
            Exhibitors & Global <span className="text-gradient">Partners 2026</span>
          </h1>
          <p className="lead text-muted fs-6">
            Connect with 20+ world-class enterprise innovators in AI, Robotics, Cyber Defense, and Cloud Computing. Inspect live products and visit their 3D booths.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="glass-card p-3 p-md-4 rounded-4 mb-4 shadow-sm" style={{ borderColor: 'var(--border-subtle)' }}>
          <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
            <div className="col-md-7">
              <div className="position-relative">
                <Search size={16} className="position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by company (e.g. NVIDIA, OpenAI, Apple), product, or sector..."
                  className="form-control ps-5 py-2.5 rounded-3"
                  style={{ fontSize: '0.9rem' }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select py-2.5 rounded-3"
                style={{ fontSize: '0.9rem' }}
              >
                <option value="">All Sectors (All 20+)</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Robotics">Robotics & Autonomous</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Spatial Computing">Spatial Computing</option>
                <option value="Virtual Reality">Virtual Reality & Displays</option>
                <option value="Fintech">Fintech & Banking</option>
                <option value="Hardware">Hardware & Silicon</option>
                <option value="BioTech">BioTech & Genomics</option>
              </select>
            </div>
            <div className="col-md-2">
              <button type="submit" className="btn btn-primary-custom w-100 py-2.5">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Exhibitors Directory Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="loading-spinner mx-auto mb-3" />
            <div className="text-muted small">Loading Official Exhibitor Roster...</div>
          </div>
        ) : (
          <div className="row g-4">
            {exhibitors.map((ex) => (
              <div key={ex._id} className="col-md-6 col-lg-4">
                <div className="glass-card glass-card-hover p-4 h-100 d-flex flex-column justify-content-between rounded-4 shadow-sm position-relative">
                  <div>
                    {/* Header */}
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img 
                        src={ex.logo} 
                        alt={ex.companyName} 
                        className="rounded-circle object-fit-cover shadow-sm flex-shrink-0" 
                        style={{ width: '56px', height: '56px', border: '2px solid var(--primary-glow)' }} 
                      />
                      <div className="overflow-hidden">
                        <h5 className="fw-bold mb-1 text-truncate" style={{ color: 'var(--heading-color)' }}>{ex.companyName}</h5>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge badge-occupied" style={{ fontSize: '10px' }}>{ex.category}</span>
                          <span className="text-muted small font-monospace">Booth: <strong className="text-primary">{ex.boothNumber || 'Assigned'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted small mb-3 line-clamp-3" style={{ lineHeight: '1.5', minHeight: '54px' }}>
                      {ex.description}
                    </p>

                    {/* Products Preview */}
                    {ex.products && ex.products.length > 0 && (
                      <div className="mb-3 pt-2.5 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                        <div className="small fw-semibold mb-2 d-flex align-items-center gap-1.5" style={{ color: 'var(--heading-color)', fontSize: '11px' }}>
                          <Package size={13} className="text-primary" /> Key Innovations:
                        </div>
                        <div className="d-flex flex-column gap-1.5">
                          {ex.products.slice(0, 2).map((p, idx) => (
                            <div key={idx} className="p-1.5 rounded-2 d-flex align-items-center gap-2" style={{ background: 'var(--bg-subtle)' }}>
                              {p.image && (
                                <img src={p.image} alt="" className="rounded-1 object-fit-cover flex-shrink-0" style={{ width: '28px', height: '28px' }} />
                              )}
                              <span className="small text-truncate" style={{ fontSize: '11px', color: 'var(--text-main)' }}>{p.name || p}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="d-flex gap-2 pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                    <button 
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedExhibitor(ex);
                      }} 
                      className="btn btn-outline-custom btn-sm flex-grow-1 py-2"
                      style={{ fontSize: '0.82rem' }}
                    >
                      View Catalog
                    </button>

                    <Link
                      to="/floor-plan"
                      onClick={() => soundFX.playTeleport()}
                      className="btn btn-primary-custom btn-sm d-flex align-items-center gap-1 py-2 px-3"
                      style={{ fontSize: '0.82rem' }}
                      title="Locate booth in Virtual Expo 3D"
                    >
                      <Box size={13} />
                      <span>3D Arena</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Exhibitor Modal */}
        {selectedExhibitor && (
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)', zIndex: 2200 }}
            onClick={() => setSelectedExhibitor(null)}
          >
            <div 
              className="glass-card p-4 p-md-5 rounded-4 shadow-lg position-relative" 
              style={{ maxWidth: '680px', width: '100%', maxHeight: '90vh', overflowY: 'auto', background: isNeon ? '#09150f' : '#ffffff', border: '1.5px solid var(--primary-500)' }}
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedExhibitor(null)} 
                className="btn btn-sm position-absolute top-0 end-0 m-3 p-1 rounded-circle"
                style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>

              <div className="d-flex align-items-center gap-3 mb-4">
                <img 
                  src={selectedExhibitor.logo} 
                  alt={selectedExhibitor.companyName} 
                  className="rounded-circle object-fit-cover shadow" 
                  style={{ width: '64px', height: '64px', border: '2px solid var(--primary-glow)' }} 
                />
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>{selectedExhibitor.companyName}</h4>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge badge-occupied">{selectedExhibitor.category}</span>
                    <span className="text-muted small font-monospace">Booth: <strong className="text-primary">{selectedExhibitor.boothNumber}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>About Enterprise</h6>
                <p className="text-muted small" style={{ lineHeight: '1.6' }}>{selectedExhibitor.description}</p>
              </div>

              {selectedExhibitor.products && selectedExhibitor.products.length > 0 && (
                <div className="mb-4">
                  <h6 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Featured Products & Live Showcases</h6>
                  <div className="row g-3">
                    {selectedExhibitor.products.map((prod, i) => (
                      <div key={i} className="col-12 col-md-6">
                        <div className="p-3 rounded-3 h-100 d-flex flex-column justify-content-between" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                          {prod.image && (
                            <img src={prod.image} alt={prod.name} className="rounded-2 w-100 mb-2 object-fit-cover" style={{ height: '120px' }} />
                          )}
                          <div>
                            <div className="fw-bold small mb-1" style={{ color: 'var(--heading-color)' }}>{prod.name}</div>
                            <div className="text-muted" style={{ fontSize: '11px', lineHeight: '1.4' }}>{prod.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="d-flex flex-column gap-1 small text-muted">
                  {selectedExhibitor.website && (
                    <a href={selectedExhibitor.website} target="_blank" rel="noreferrer" className="text-primary text-decoration-none d-flex align-items-center gap-1.5">
                      <Globe size={14} /> {selectedExhibitor.website}
                    </a>
                  )}
                  {selectedExhibitor.contactEmail && (
                    <div className="d-flex align-items-center gap-1.5">
                      <Mail size={14} className="text-primary" /> {selectedExhibitor.contactEmail}
                    </div>
                  )}
                </div>

                <Link
                  to="/floor-plan"
                  onClick={() => soundFX.playTeleport()}
                  className="btn btn-primary-custom d-flex align-items-center gap-2"
                >
                  <Box size={16} /> Visit 3D Virtual Booth
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exhibitors;
