import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, Lock, Mail, AlertCircle, Key } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const { isNeon } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'exhibitor') navigate('/exhibitor');
      else navigate('/attendee');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div className="glass-card p-4 p-md-5 shadow-lg w-100 animate-fade-in" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <div 
            className="p-3 rounded-circle d-inline-block mb-3 shadow-sm"
            style={{ 
              background: isNeon 
                ? 'linear-gradient(135deg, rgba(0, 255, 136, 0.25) 0%, rgba(0, 242, 254, 0.25) 100%)' 
                : 'linear-gradient(135deg, rgba(37, 211, 102, 0.2) 0%, rgba(18, 140, 126, 0.2) 100%)', 
              border: `1px solid ${isNeon ? 'rgba(0, 255, 136, 0.4)' : 'rgba(37, 211, 102, 0.4)'}` 
            }}
          >
            <Layers className={isNeon ? 'text-success' : 'text-primary'} size={32} />
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Welcome Back</h3>
          <p className="text-muted small">Sign in to your EventSphere account portal</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 small mb-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>Email Address</label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-bright)', color: 'var(--text-muted)' }}>
                <Mail size={16} />
              </span>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="form-control border-start-0" 
                placeholder="name@company.com" 
              />
            </div>
          </div>

          <div>
            <label className="form-label small fw-bold" style={{ color: 'var(--text-main)' }}>Password</label>
            <div className="input-group">
              <span className="input-group-text border-end-0" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-bright)', color: 'var(--text-muted)' }}>
                <Lock size={16} />
              </span>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="form-control border-start-0" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-custom py-3 fw-bold mt-2 shadow-sm">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials */}
        <div className="mt-4 pt-3 border-top text-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-muted small mb-2.5 fw-semibold d-flex align-items-center justify-content-center gap-1.5">
            <Key size={14} className="text-warning" /> 1-Click Instant Demo Login:
          </div>
          <div className="d-flex flex-column gap-2">
            <button 
              type="button" 
              onClick={() => setDemoAccount('admin@eventsphere.com')} 
              className="btn btn-sm btn-outline-custom d-flex align-items-center justify-content-between px-3 py-2 text-start"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="p-1 rounded bg-primary bg-opacity-20 text-primary d-inline-flex"><Lock size={14} /></span>
                <div>
                  <div className="fw-bold small" style={{ color: 'var(--heading-color)' }}>Platform Director (Admin)</div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>Full Expo & 3D Floor Controls</div>
                </div>
              </div>
              <span className="badge bg-primary bg-opacity-20 text-primary small">Auto Fill</span>
            </button>

            <button 
              type="button" 
              onClick={() => setDemoAccount('contact@nvidiacorporation.com')} 
              className="btn btn-sm btn-outline-custom d-flex align-items-center justify-content-between px-3 py-2 text-start"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="p-1 rounded bg-success bg-opacity-20 text-success d-inline-flex"><Layers size={14} /></span>
                <div>
                  <div className="fw-bold small" style={{ color: 'var(--heading-color)' }}>NVIDIA VP (Exhibitor)</div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>Booth & Product Management</div>
                </div>
              </div>
              <span className="badge bg-success bg-opacity-20 text-success small">Auto Fill</span>
            </button>

            <button 
              type="button" 
              onClick={() => setDemoAccount('attendee1@gmail.com')} 
              className="btn btn-sm btn-outline-custom d-flex align-items-center justify-content-between px-3 py-2 text-start"
            >
              <div className="d-flex align-items-center gap-2">
                <span className="p-1 rounded bg-info bg-opacity-20 text-info d-inline-flex"><Mail size={14} /></span>
                <div>
                  <div className="fw-bold small" style={{ color: 'var(--heading-color)' }}>VIP Delegate (Attendee)</div>
                  <div className="text-muted" style={{ fontSize: '10px' }}>Digital QR Badge & Personal Timetable</div>
                </div>
              </div>
              <span className="badge bg-info bg-opacity-20 text-info small">Auto Fill</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="text-muted small">Don't have an account? </span>
          <Link to="/register" className="text-primary fw-bold small text-decoration-none">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
