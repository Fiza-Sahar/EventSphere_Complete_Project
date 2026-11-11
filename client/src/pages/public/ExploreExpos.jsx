import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Search, Calendar, MapPin, Filter, ArrowRight, Users, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

const ExploreExpos = () => {
  const [expos, setExpos] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpos();
  }, [category]);

  const fetchExpos = async () => {
    try {
      const res = await api.get('/expos', { params: { search, category } });
      setExpos(res.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExpos();
  };

  const categories = [
    { label: 'All Categories', value: '' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Artificial Intelligence', value: 'Artificial Intelligence' },
    { label: 'Sustainability', value: 'Sustainability' },
    { label: 'Fintech', value: 'Fintech' }
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3 glass-card" style={{ borderColor: 'var(--primary-glow)' }}>
          <Sparkles className="text-primary" size={14} />
          <span className="small fw-medium" style={{ color: 'var(--text-main)' }}>Global Trade Shows & Tech Summits</span>
        </div>
        <h1 className="display-5 fw-extrabold mb-2 tracking-tight" style={{ color: 'var(--heading-color)' }}>
          Explore <span className="text-gradient">World-Class Expos</span>
        </h1>
        <p className="text-secondary mx-auto" style={{ maxWidth: '650px' }}>
          Discover major international exhibitions, reserve your VIP delegate entry pass, and explore interactive 3D venue layouts in real time.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="glass-card p-4 mb-5 border-primary border-opacity-25">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-lg-8">
            <div className="position-relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search trade shows by title, keywords, or host city..."
                className="form-control ps-4 py-2.5"
                style={{ fontSize: '0.95rem' }}
              />
            </div>
          </div>
          <div className="col-lg-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
              <Search size={16} /> Search Expos
            </button>
          </div>
        </form>

        {/* Category Pill Filters */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary border-opacity-25">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`btn btn-sm ${category === c.value ? 'btn-primary-custom' : 'btn-outline-custom'}`}
              style={{ borderRadius: '9999px', fontSize: '0.82rem', padding: '6px 16px' }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expos Grid */}
      {loading ? (
        <div className="p-5 text-center text-secondary">Loading upcoming exhibitions...</div>
      ) : expos.length === 0 ? (
        <div className="glass-card p-5 text-center">
          <Calendar size={48} className="text-primary mb-3 mx-auto" />
          <h5 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>No Expos Found</h5>
          <p className="text-secondary small mb-3">Try adjusting your keyword search or category filter.</p>
          <button onClick={() => { setSearch(''); setCategory(''); }} className="btn btn-outline-custom">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {expos.map((expo) => (
            <div key={expo._id} className="col-md-6 col-lg-4">
              <div className="glass-card glass-card-hover h-100 overflow-hidden d-flex flex-column justify-content-between">
                <div className="position-relative" style={{ height: '220px' }}>
                  <img src={expo.image} alt={expo.title} className="w-100 h-100 object-fit-cover" />
                  <div className="position-absolute top-0 end-0 m-3">
                    <span className="badge bg-primary px-3 py-1.5 rounded-pill shadow">
                      {expo.category}
                    </span>
                  </div>
                  <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: 'linear-gradient(0deg, rgba(7,10,19,0.9) 0%, transparent 100%)' }}>
                    <span className="badge bg-dark bg-opacity-75 text-light border border-secondary border-opacity-50 small d-inline-flex align-items-center gap-1">
                      <Users size={12} className="text-primary" /> Capacity: {expo.capacity} Delegates
                    </span>
                  </div>
                </div>

                <div className="p-4 d-flex flex-column flex-grow-1 justify-content-between">
                  <div>
                    <h5 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>{expo.title}</h5>
                    <p className="text-secondary small mb-3" style={{ lineHeight: '1.6', minHeight: '44px' }}>
                      {expo.description}
                    </p>

                    <div className="d-flex flex-column gap-2 mb-4 text-secondary small">
                      <span className="d-flex align-items-center gap-2">
                        <Calendar size={15} className="text-primary" />
                        {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}
                      </span>
                      <span className="d-flex align-items-center gap-2">
                        <MapPin size={15} className="text-primary" />
                        {expo.location}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-top border-secondary border-opacity-25 d-flex gap-2">
                    <Link to={`/expos/${expo._id}`} className="btn btn-primary-custom flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-1.5">
                      <Ticket size={15} /> <span>Get Pass</span>
                    </Link>
                    <Link to="/floor-plan" className="btn btn-outline-custom py-2 px-3">
                      3D Hall
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreExpos;
