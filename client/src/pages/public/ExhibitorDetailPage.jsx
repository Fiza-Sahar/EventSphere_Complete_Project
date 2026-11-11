import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Box, ArrowRight, Heart, Calendar } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ExhibitorDetailPage = () => {
  const { id } = useParams(); // exhibitor id
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exhibitor, setExhibitor] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchExhibitor = async () => {
      try {
        const res = await api.get(`/exhibitors/${id}`);
        setExhibitor(res.data);
        if (user) {
          try {
            const favRes = await api.get('/favorites');
            const fav = favRes.data.find(f => f.itemId === id && f.itemType === 'exhibitor');
            setIsFav(!!fav);
          } catch (e) {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitor();
  }, [id, user]);

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/favorites/toggle', { itemId: id, itemType: 'exhibitor' });
      setIsFav(!isFav);
      setFeedbackMsg({ type: 'success', text: isFav ? 'Removed from favorites' : 'Saved to favorites' });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const bookMeeting = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/meetings', {
        exhibitorId: id,
        attendeeId: user._id,
        purpose: 'Executive B2B partnership discussion',
        date: new Date().toISOString().split('T')[0],
        time: '11:00 AM',
        location: 'Executive Lounge / Booth Space',
        status: 'pending',
      });
      setFeedbackMsg({ type: 'success', text: 'Meeting request successfully submitted to exhibitor!' });
      setTimeout(() => setFeedbackMsg({ type: '', text: '' }), 4000);
    } catch (err) {
      setFeedbackMsg({ type: 'danger', text: err.message || 'Failed to submit meeting request.' });
    }
  };

  const viewOnMap = () => {
    navigate('/floor-plan');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="loading-spinner mx-auto mb-2" />
        <div className="text-secondary small">Loading exhibitor showcase...</div>
      </div>
    );
  }

  if (!exhibitor) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>Exhibitor Not Found</h4>
        <Link to="/exhibitors" className="btn btn-outline-custom btn-sm">Back to Exhibitors</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="glass-card p-4 p-md-5 rounded-4 mx-auto shadow-lg animate-fade-in" style={{ maxWidth: '960px', borderColor: 'var(--border-subtle)' }}>
        
        {feedbackMsg.text && (
          <div className={`alert alert-${feedbackMsg.type} small d-flex align-items-center gap-2 mb-4 animate-fade-in`}>
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        <div className="d-flex flex-column gap-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              {exhibitor.logo && (
                <img 
                  src={exhibitor.logo} 
                  alt={exhibitor.companyName} 
                  className="rounded-circle object-fit-cover shadow-sm"
                  style={{ width: '64px', height: '64px', border: '2px solid var(--primary-glow)' }}
                />
              )}
              <div>
                <h3 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>{exhibitor.companyName}</h3>
                <div className="d-flex flex-wrap align-items-center gap-2 small">
                  <span className="badge badge-occupied">{exhibitor.category || exhibitor.industry || 'Technology'}</span>
                  {exhibitor.boothNumber && (
                    <span className="text-primary font-monospace fw-semibold">Booth {exhibitor.boothNumber}</span>
                  )}
                  {exhibitor.location && <span className="text-muted">• {exhibitor.location}</span>}
                </div>
              </div>
            </div>

            <button 
              className={`btn btn-sm ${isFav ? 'btn-danger text-white' : 'btn-outline-custom'} d-flex align-items-center gap-1.5`} 
              onClick={toggleFavorite} 
              title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
              <span>{isFav ? 'Favorited' : 'Add to Favorites'}</span>
            </button>
          </div>

          {exhibitor.tags && exhibitor.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1.5">
              {exhibitor.tags.map((tag, i) => (
                <span key={i} className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: '11px' }}>{tag}</span>
              ))}
            </div>
          )}

          <div className="p-3 rounded-3" style={{ background: 'var(--bg-subtle)' }}>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Company Overview</h6>
            <p className="small mb-0" style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
              {exhibitor.description}
            </p>
          </div>

          {exhibitor.products && exhibitor.products.length > 0 && (
            <div>
              <h5 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Featured Products & Innovations</h5>
              <div className="row g-3">
                {exhibitor.products.map((prod, i) => (
                  <div key={i} className="col-12 col-md-6">
                    <div className="glass-card p-3 h-100 rounded-3" style={{ background: 'var(--bg-surface)' }}>
                      <h6 className="fw-bold mb-1 text-primary">{prod.name || prod.title}</h6>
                      <p className="small mb-0 text-muted">{prod.shortDesc || prod.description || 'Enterprise Technology Solution'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex flex-wrap gap-3 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
            <button className="btn btn-primary-custom d-flex align-items-center gap-2" onClick={viewOnMap}>
              <Box size={16} /> View Booth in 3D Arena
            </button>
            <button className="btn btn-outline-custom d-flex align-items-center gap-2" onClick={bookMeeting}>
              <Calendar size={16} /> Request B2B Meeting
            </button>
            <Link to="/exhibitors" className="btn btn-outline-custom d-flex align-items-center gap-2">
              <ArrowRight size={16} /> Back to Exhibitors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitorDetailPage;
