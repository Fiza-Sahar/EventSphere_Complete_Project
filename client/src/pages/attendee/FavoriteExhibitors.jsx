import React, { useEffect, useState } from 'react';
import { Heart, Box, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const FavoriteExhibitors = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/favorites');
        setFavorites(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/favorites/${id}`);
      setFavorites(prev => prev.filter(f => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div>
        <h4 className="fw-bold  mb-1" style={{ color: "var(--heading-color)" }}>Saved Exhibitors &amp; Booths</h4>
        <p className="text-muted small mb-0">Your curated list of favorite exhibitors. Click to view on map or remove.</p>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="loading-spinner mx-auto" /></div>
      ) : (
        favorites.length === 0 ? (
          <div className="glass-card text-center py-5">
            <Heart size={36} className="text-primary mb-3" />
            <h5 className="fw-bold mb-2">No Favorites Yet</h5>
            <p className="text-secondary small mb-3">Browse exhibitors and add them to your favorites.</p>
            <Link to="/exhibitors" className="btn btn-primary-custom btn-sm">Browse Exhibitors</Link>
          </div>
        ) : (
          <div className="row g-3">
            {favorites.map(fav => (
              <div key={fav._id} className="col-12 col-md-6">
                <div className="glass-card p-3 d-flex align-items-start gap-3">
                  <div className="p-2 rounded-2" style={{ background: 'rgba(99, 102, 241, 0.15)' }}>
                    <Heart size={16} className="text-primary" />
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="fw-semibold small text-truncate">{fav.title || fav.name}</span>
                      {fav.itemType && (
                        <span className="badge bg-primary bg-opacity-15 text-primary flex-shrink-0" style={{ fontSize: '9px', textTransform: 'capitalize' }}>{fav.itemType}</span>
                      )}
                    </div>
                    {fav.subtitle && <div className="text-secondary small text-truncate">{fav.subtitle}</div>}
                    {fav.location && (
                      <div className="text-secondary small">
                        <Box size={10} className="me-1" />{fav.location}
                      </div>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-1 flex-shrink-0">
                    {fav.itemType === 'booth' && (
                      <Link to="/floor-plan" className="btn btn-sm p-1 text-primary" title="View on Map">
                        <ArrowRight size={12} />
                      </Link>
                    )}
                    <button className="btn btn-sm p-1 text-danger" onClick={() => handleRemove(fav._id)} title="Remove Favorite">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default FavoriteExhibitors;
