import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Layers, AlertCircle, Sparkles } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: 'attendee',
    company: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isNeon } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(formData);
      if (data.role === 'admin') navigate('/admin');
      else if (data.role === 'exhibitor') navigate('/exhibitor');
      else navigate('/attendee');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const lbl = { color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 160px)' }}>
      <div className="glass-card p-4 p-md-5 shadow-lg w-100" style={{ maxWidth: '560px' }}>
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center shadow-sm mb-3"
            style={{
              width: '56px', height: '56px',
              background: isNeon
                ? 'linear-gradient(135deg, #059669 0%, #00d66f 50%, #06b6d4 100%)'
                : 'linear-gradient(135deg, #047857 0%, #10b981 50%, #0284c7 100%)',
              borderRadius: '14px'
            }}
          >
            <Layers color="#fff" size={26} />
          </div>
          <h3 className="fw-bold mb-1" style={{ color: 'var(--heading-color)' }}>Create Account</h3>
          <p className="text-muted small mb-0">Join EventSphere as Attendee, Exhibitor, or Organizer</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 small mb-3">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" style={lbl}>Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="form-control" placeholder="Jane Doe" />
            </div>
            <div className="col-md-6">
              <label className="form-label" style={lbl}>Username</label>
              <input type="text" name="username" required value={formData.username} onChange={handleChange} className="form-control" placeholder="janedoe" />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" style={lbl}>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="form-control" placeholder="jane@company.com" />
            </div>
            <div className="col-md-6">
              <label className="form-label" style={lbl}>Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="form-control" placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label" style={lbl}>Account Role</label>
              <select name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="attendee">Trade Delegate / Attendee</option>
                <option value="exhibitor">Exhibitor Enterprise Partner</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" style={lbl}>Company / Organization</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} className="form-control" placeholder="Acme Inc." />
            </div>
          </div>

          <div>
            <label className="form-label" style={lbl}>Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="form-control" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary-custom py-3 fw-bold mt-2 d-flex align-items-center justify-content-center gap-2">
            {loading
              ? <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" /> Creating Profile...</>
              : <><Sparkles size={16} /> Complete Registration</>}
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="fw-bold small text-decoration-none" style={{ color: 'var(--primary-500)' }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

