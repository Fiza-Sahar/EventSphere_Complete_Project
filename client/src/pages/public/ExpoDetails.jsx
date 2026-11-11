import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, MapPin, Users, Ticket, CheckCircle2, Box, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ExpoDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [expo, setExpo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchExpo = async () => {
      try {
        const res = await api.get(`/expos/${id}`);
        setExpo(res.data);

        // Check if current user already registered
        if (user) {
          try {
            const myRegs = await api.get('/registrations/my');
            const found = myRegs.data.find(r => r.expoId?._id === id || r.expoId === id);
            if (found) {
              setRegistered(true);
              setTicketData(found);
            }
          } catch (e) {}
        }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExpo();
  }, [id, user]);

  const handleRegister = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setRegistering(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.post('/registrations', {
        expoId: id,
        ticketType: 'VIP Pass'
      });

      setRegistered(true);
      setTicketData(res.data.registration);
      setMsg({
        type: 'success',
        text: 'Registration Confirmed! Your digital VIP Pass has been generated.'
      });
    } catch (err) {
      setMsg({
        type: 'danger',
        text: err.message || 'Registration failed. Please try again.'
      });
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="p-5 text-center text-muted">Loading expo details...</div>;
  if (!expo) return <div className="p-5 text-center text-danger">Expo not found.</div>;

  return (
    <div className="container py-5">
      <div className="glass-card overflow-hidden mb-5">
        <div className="position-relative" style={{ height: '320px' }}>
          <img src={expo.image} alt={expo.title} className="w-100 h-100 object-fit-cover" />
          <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(180deg, rgba(11,15,25,0.2) 0%, rgba(11,15,25,0.95) 100%)' }}></div>
          <div className="position-absolute bottom-0 start-0 p-4 p-md-5 w-100">
            <span className="badge bg-primary px-3 py-2 fs-6 mb-2">{expo.category}</span>
            <h1 className="display-5 fw-extrabold mb-2" style={{ color: '#ffffff' }}>{expo.title}</h1>
            <div className="d-flex flex-wrap gap-4 small" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="d-flex align-items-center gap-2"><Calendar className="text-primary" /> {new Date(expo.startDate).toLocaleDateString()} - {new Date(expo.endDate).toLocaleDateString()}</span>
              <span className="d-flex align-items-center gap-2"><MapPin className="text-primary" /> {expo.location}</span>
              <span className="d-flex align-items-center gap-2"><Users className="text-primary" /> Max Capacity: {expo.capacity}</span>
            </div>
          </div>
        </div>

        <div className="p-4 p-md-5">
          <div className="row g-5">
            <div className="col-lg-8">
              <h4 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>Expo Overview</h4>
              <p className="text-muted lead" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>{expo.description}</p>
              
              <h5 className="fw-bold mt-4 mb-3" style={{ color: 'var(--heading-color)' }}>Key Highlights</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3 rounded glass-card d-flex align-items-center gap-3">
                    <CheckCircle2 className="text-success" />
                    <div>
                      <div className="fw-bold" style={{ color: "var(--heading-color)" }}>Interactive 3D Floor</div>
                      <div className="text-muted small">Real-time booth tracking & interactive virtual tour.</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3 rounded glass-card d-flex align-items-center gap-3">
                    <CheckCircle2 className="text-success" />
                    <div>
                      <div className="fw-bold" style={{ color: "var(--heading-color)" }}>AI Event Concierge</div>
                      <div className="text-muted small">Personalized conflict-free schedule builder.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="glass-card p-4">
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: "var(--heading-color)" }}>
                  <Ticket className="text-primary" /> Pass Registration
                </h5>

                {msg.text && (
                  <div className={`alert alert-${msg.type} small d-flex align-items-center gap-2 mb-3`}>
                    {msg.type === 'danger' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    <span>{msg.text}</span>
                  </div>
                )}
                
                <p className="text-muted small mb-4">
                  Gain full access to keynotes, 3D expo floor, exhibitor catalog, and AI assistant networking.
                </p>

                {registered ? (
                  <div className="mb-3 p-3 rounded glass-card border border-success border-opacity-50">
                    <div className="d-flex align-items-center gap-2 text-success fw-bold small mb-1">
                      <CheckCircle2 size={16} /> Pass Active: VIP Access
                    </div>
                    <div className="text-muted small font-monospace">
                      Ticket Code: {ticketData?.ticketCode || 'ESP-ACTIVE'}
                    </div>
                    <Link to="/attendee/events" className="btn btn-sm btn-outline-custom w-100 mt-2">
                      View Ticket in Dashboard
                    </Link>
                  </div>
                ) : (
                  <button 
                    onClick={handleRegister} 
                    disabled={registering}
                    className="btn btn-primary-custom w-100 py-3 mb-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
                  >
                    {registering ? <RefreshCw size={18} className="animate-spin" /> : <Ticket size={18} />}
                    {registering ? 'Registering...' : 'Get Delegate Pass Now'}
                  </button>
                )}

                <Link to="/floor-plan" className="btn btn-outline-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2">
                  <Box size={18} /> View 3D Hall Layout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpoDetails;
