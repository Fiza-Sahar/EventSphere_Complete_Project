import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, CheckCircle2, ShieldCheck, X, Zap, Wifi, 
  Sparkles, CreditCard, Lock, UserCheck, ArrowRight, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../utils/soundFX';

const InstantBoothBookingModal = ({ isOpen, onClose, booth, onConfirmBooking }) => {
  const { isNeon } = useTheme();
  const { user } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [hasEVFastPass, setHasEVFastPass] = useState(true);
  const [hasGigabitWifi, setHasGigabitWifi] = useState(true);
  const [hasHologramDisplay, setHasHologramDisplay] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCompanyName(user.company || user.name || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  if (!isOpen || !booth) return null;

  const basePrice = (booth.size?.width || 5) * (booth.size?.depth || 4.5) * 120;
  const addonsTotal = (hasEVFastPass ? 150 : 0) + (hasGigabitWifi ? 200 : 0) + (hasHologramDisplay ? 450 : 0);
  const grandTotal = basePrice + addonsTotal;

  const handleBookSubmit = (e) => {
    e.preventDefault();
    soundFX.playTeleport();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      if (onConfirmBooking) {
        onConfirmBooking({
          ...booth,
          status: 'OCCUPIED',
          companyName: companyName || user?.company || 'Prime Tech Solutions'
        });
      }
    }, 1000);
  };

  const handleClose = () => {
    soundFX.playClick();
    setIsSuccess(false);
    onClose();
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)', 
        backdropFilter: 'blur(12px)',
        zIndex: 2200 
      }}
      onClick={handleClose}
    >
      <div 
        className="glass-card p-4 p-md-5 shadow-lg position-relative animate-fade-in"
        style={{ 
          maxWidth: '520px', 
          width: '100%',
          borderRadius: '26px',
          border: isNeon ? '1.5px solid rgba(0, 214, 111, 0.4)' : '1.5px solid rgba(37, 211, 102, 0.4)',
          background: isNeon ? '#09150f' : '#ffffff'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={handleClose} 
          className="btn btn-sm position-absolute top-0 end-0 m-3 p-1 rounded-circle"
          style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>

        {/* Gate 1: If User is NOT Logged In -> Show Mandatory Login/Register Gate */}
        {!user ? (
          <div className="text-center py-3">
            <div 
              className="p-3 rounded-circle d-inline-flex mb-3 shadow-sm"
              style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary-500)' }}
            >
              <Lock size={44} />
            </div>

            <h4 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>
              Authentication Required
            </h4>
            <p className="text-muted small mb-4">
              To reserve <strong>Booth {booth.boothNumber}</strong> and provision official 3D credentials, please sign in or register an exhibitor account.
            </p>

            <div className="p-3 rounded-3 mb-4 text-start font-monospace small" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div className="d-flex justify-content-between mb-1">
                <span>Selected Space:</span>
                <strong className="text-primary">Booth {booth.boothNumber} ({booth.sector || booth.boothNumber.charAt(0)} Sector)</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Dimensions:</span>
                <span>{(booth.size?.width || 5) * (booth.size?.depth || 4.5)} sqm Virtual Twin</span>
              </div>
            </div>

            <div className="d-flex flex-column gap-2">
              <Link 
                to="/login" 
                onClick={() => soundFX.playClick()} 
                className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              >
                <span>Sign In to Continue</span>
                <ArrowRight size={16} />
              </Link>
              <Link 
                to="/register" 
                onClick={() => soundFX.playClick()} 
                className="btn btn-outline-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
              >
                <Sparkles size={16} />
                <span>Register New Exhibitor Account</span>
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="text-center py-4 animate-fade-in">
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CheckCircle2 size={48} />
            </div>
            <h4 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>
              Booth {booth.boothNumber} Successfully Reserved!
            </h4>
            <p className="text-muted small mb-4">
              Your 3D Space & VIP Exhibitor credentials have been provisioned in the Convention Center system.
            </p>
            <div className="p-3 rounded-3 mb-4 text-start font-monospace small" style={{ background: 'var(--bg-subtle)' }}>
              <div className="d-flex align-items-center gap-1.5 mb-1"><Building2 size={13} className="text-primary" /> <strong>Company:</strong> {companyName || user.company || 'Prime Tech Solutions'}</div>
              <div className="d-flex align-items-center gap-1.5 mb-1"><span className="text-primary font-monospace fw-bold">#</span> <strong>Location:</strong> Sector {booth.sector || booth.boothNumber.charAt(0)}</div>
              <div className="d-flex align-items-center gap-1.5"><CreditCard size={13} className="text-success" /> <strong>Total Paid:</strong> ${grandTotal} USD</div>
            </div>
            <button className="btn btn-primary-custom w-100 py-2.5" onClick={handleClose}>
              Return to 3D Floor Plan
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookSubmit}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Building2 className="text-primary" size={24} />
              <div>
                <h5 className="fw-bold mb-0" style={{ color: 'var(--heading-color)' }}>
                  Reserve Booth {booth.boothNumber}
                </h5>
                <span className="text-muted small">
                  Sector {booth.sector || booth.boothNumber.charAt(0)} • {booth.size?.width || 5}m × {booth.size?.depth || 4.5}m Space
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Company / Exhibitor Name</label>
              <input 
                type="text" 
                required 
                className="form-control" 
                placeholder="e.g. Nexus AI Global" 
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted small fw-bold">Official Business Email</label>
              <input 
                type="email" 
                required 
                className="form-control" 
                placeholder="contact@company.com" 
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
              />
            </div>

            {/* Hardware & Utilities Addon Selection */}
            <div className="mb-4">
              <label className="form-label text-muted small fw-bold mb-2">High-Tech Booth Add-ons</label>
              <div className="d-flex flex-column gap-2">
                <label 
                  className="d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={hasGigabitWifi} onChange={e => setHasGigabitWifi(e.target.checked)} />
                    <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>Dedicated 5G Ultra Gigabit Fiber WiFi</span>
                  </div>
                  <span className="small text-primary fw-bold">+$200</span>
                </label>

                <label 
                  className="d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={hasHologramDisplay} onChange={e => setHasHologramDisplay(e.target.checked)} />
                    <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>3D Holographic Spinning Pedestal Display</span>
                  </div>
                  <span className="small text-primary fw-bold">+$450</span>
                </label>

                <label 
                  className="d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer"
                  style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={hasEVFastPass} onChange={e => setHasEVFastPass(e.target.checked)} />
                    <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>VIP Valet & EV Supercharging Pass</span>
                  </div>
                  <span className="small text-primary fw-bold">+$150</span>
                </label>
              </div>
            </div>

            {/* Price Summary Breakdown */}
            <div className="p-3 rounded-3 mb-4" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div className="d-flex justify-content-between text-muted small mb-1">
                <span>Base Booth Space ({(booth.size?.width || 5) * (booth.size?.depth || 4.5)} sqm):</span>
                <span>${basePrice}</span>
              </div>
              <div className="d-flex justify-content-between text-muted small mb-2">
                <span>Utilities & VIP Addons:</span>
                <span>${addonsTotal}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="fw-bold fs-6" style={{ color: 'var(--heading-color)' }}>Total Cost:</span>
                <span className="fw-extrabold fs-5 text-gradient font-monospace">${grandTotal} USD</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="btn btn-primary-custom w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
            >
              {loading ? (
                <span>Provisioning 3D Booth...</span>
              ) : (
                <>
                  <CreditCard size={16} /> Confirm & Reserve 3D Booth
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InstantBoothBookingModal;
