import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, CheckCircle2, ShieldCheck, Sparkles, Zap, Wifi, 
  CreditCard, ArrowRight, Box, Award, Check, ChevronRight, HelpCircle,
  Clock, MapPin, Users, Globe, Lock
} from 'lucide-react';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { soundFX } from '../../utils/soundFX';

const PACKAGES = [
  {
    id: 'startup',
    name: 'Startup Innovation Pod',
    badge: 'Popular for Startups',
    size: '16 sqm (4m × 4m)',
    price: 1800,
    features: [
      'Standard 3D Virtual Twin Showcase',
      'High-Speed 5G WiFi Connection',
      '2 Exhibitor All-Access Passes',
      'Official Directory & AI Concierge Listing',
      'Lead Capture Digital Scanner'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Prime Pavilion',
    badge: 'Most Popular',
    popular: true,
    size: '25 sqm (5m × 5m)',
    price: 3400,
    features: [
      'Interactive 3D Spinning Hologram Pedestal',
      'Dedicated 5G Gigabit Fiber WiFi',
      '4 Exhibitor VIP Passes + Keynote Access',
      'Featured Placement on 3D Floor Map',
      'Glass Discussion Table & 2 Executive Barstools',
      'Priority Lead Retrieval Analytics'
    ]
  },
  {
    id: 'vip',
    name: 'VIP Global Mega Pavilion',
    badge: 'Executive Tier',
    size: '45 sqm (9m × 5m)',
    price: 6200,
    features: [
      'Premium Island Corner Location',
      'Custom 3D Architectural Cantilever Canopy',
      '8 VIP Executive Passes + VIP Lounge Access',
      'Stage Spotlight Announcement Mention',
      'Private 4-Seat B2B Meeting Suite',
      'Dedicated EV Valet Parking Reserved Space'
    ]
  }
];

const BookBoothPage = () => {
  const { isNeon } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState('enterprise');
  const [availableBooths, setAvailableBooths] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState('');
  const [companyName, setCompanyName] = useState(user?.company || user?.name || '');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [sector, setSector] = useState('Artificial Intelligence');
  const [hasAddonWifi, setHasAddonWifi] = useState(true);
  const [hasAddonHologram, setHasAddonHologram] = useState(true);
  const [hasAddonEV, setHasAddonEV] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (!companyName) setCompanyName(user.company || user.name || '');
      if (!contactEmail) setContactEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const res = await api.get('/booths');
        const data = Array.isArray(res.data) ? res.data : res.data.booths || [];
        const openBooths = data.filter(b => b.status === 'AVAILABLE');
        setAvailableBooths(openBooths);
        if (openBooths.length > 0) {
          setSelectedBooth(openBooths[0].boothNumber);
        }
      } catch (err) {
        console.error('Error fetching booths:', err);
      }
    };
    fetchBooths();
  }, []);

  const pkg = PACKAGES.find(p => p.id === selectedPackage) || PACKAGES[1];
  const addonsTotal = (hasAddonWifi ? 200 : 0) + (hasAddonHologram ? 450 : 0) + (hasAddonEV ? 150 : 0);
  const grandTotal = pkg.price + addonsTotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    soundFX.playTeleport();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 1200);
  };

  return (
    <div className="py-5" style={{ background: 'var(--bg-dark)', minHeight: '90vh' }}>
      <div className="container">
        
        {/* Header Title */}
        <div className="text-center max-w-700 mx-auto mb-5">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3 glass-card" style={{ borderColor: 'var(--primary-glow)' }}>
            <Sparkles className="text-primary" size={16} />
            <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>Official 2026 Exhibitor Space Reservation</span>
          </div>
          <h1 className="display-5 fw-extrabold mb-3" style={{ color: 'var(--heading-color)' }}>
            Reserve Your Prime <span className="text-gradient">Exhibition Space</span>
          </h1>
          <p className="lead text-muted fs-6">
            Showcase your products to 12,000+ industry executives, delegates, and global investors with high-impact physical and 3D virtual spatial twin presence.
          </p>
        </div>

        {/* Auth Required Notice if not logged in */}
        {!user && (
          <div className="max-w-700 mx-auto alert alert-warning d-flex align-items-center justify-content-between p-3 rounded-4 mb-4 shadow-sm" style={{ border: '1px solid #f59e0b' }}>
            <div className="d-flex align-items-center gap-2.5">
              <Lock size={20} className="text-warning flex-shrink-0" />
              <div>
                <div className="fw-bold small text-white">Authentication Required for Space Reservation</div>
                <div className="text-muted small" style={{ fontSize: '11px' }}>Please sign in or register an enterprise exhibitor account to provision 3D booth twins.</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-sm btn-primary-custom px-3 py-1 fw-semibold font-monospace" style={{ fontSize: '11px' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-outline-custom px-3 py-1 fw-semibold font-monospace" style={{ fontSize: '11px' }}>
                Register
              </Link>
            </div>
          </div>
        )}

        {isSuccess ? (
          <div className="max-w-600 mx-auto glass-card p-5 text-center shadow-lg animate-fade-in rounded-4" style={{ borderColor: 'var(--primary-500)' }}>
            <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
              <CheckCircle2 size={56} />
            </div>
            <h2 className="fw-bold mb-2" style={{ color: 'var(--heading-color)' }}>
              Booth {selectedBooth} Confirmed!
            </h2>
            <p className="text-muted mb-4">
              Congratulations! <strong>{companyName || 'Your Enterprise'}</strong> has been registered for the <strong>{pkg.name}</strong> package at Global Tech World Expo 2026.
            </p>

            <div className="p-3 rounded-3 mb-4 text-start font-monospace small" style={{ background: 'var(--bg-subtle)' }}>
              <div className="d-flex align-items-center gap-1.5 mb-1"><Building2 size={13} className="text-primary" /> <strong>Company:</strong> {companyName || 'Verified Exhibitor'}</div>
              <div className="d-flex align-items-center gap-1.5 mb-1"><MapPin size={13} className="text-primary" /> <strong>Booth Location:</strong> Booth {selectedBooth} (Main Convention Hall)</div>
              <div className="d-flex align-items-center gap-1.5 mb-1"><Box size={13} className="text-primary" /> <strong>Package Tier:</strong> {pkg.name}</div>
              <div className="d-flex align-items-center gap-1.5"><CreditCard size={13} className="text-success" /> <strong>Total Amount:</strong> ${grandTotal} USD</div>
            </div>

            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <Link 
                to="/floor-plan" 
                onClick={() => soundFX.playTeleport()} 
                className="btn btn-primary-custom px-4 py-2.5 d-flex align-items-center gap-2"
              >
                <Box size={16} /> View Booth in Virtual Expo 3D
              </Link>
              <Link 
                to="/exhibitors" 
                onClick={() => soundFX.playClick()} 
                className="btn btn-outline-custom px-4 py-2.5"
              >
                View Exhibitor Directory
              </Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            
            {/* Left Column: Package Selection Cards */}
            <div className="col-lg-7">
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--heading-color)' }}>
                <span>1. Select Exhibition Package</span>
              </h4>

              <div className="d-flex flex-column gap-3 mb-4">
                {PACKAGES.map((p) => {
                  const isSelected = selectedPackage === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        soundFX.playClick();
                        setSelectedPackage(p.id);
                      }}
                      className="glass-card p-4 rounded-4 cursor-pointer transition-all shadow-sm position-relative"
                      style={{
                        border: isSelected ? '2px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--primary-glow)' : 'var(--bg-card)',
                        transform: isSelected ? 'scale(1.01)' : 'scale(1)'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="badge mb-2" style={{ background: 'var(--bg-subtle)', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
                            {p.badge}
                          </span>
                          <h5 className="fw-bold mb-0" style={{ color: 'var(--heading-color)' }}>{p.name}</h5>
                          <span className="text-muted small">Space Size: {p.size}</span>
                        </div>
                        <div className="text-end">
                          <div className="fs-4 fw-extrabold text-gradient">${p.price}</div>
                          <span className="text-muted small">USD / Expo</span>
                        </div>
                      </div>

                      <ul className="list-unstyled mt-3 mb-0 d-flex flex-column gap-1.5">
                        {p.features.map((feat, fi) => (
                          <li key={fi} className="small d-flex align-items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                            <Check size={14} className="text-primary flex-shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Hardware & Digital Addons */}
              <h4 className="fw-bold mb-3" style={{ color: 'var(--heading-color)' }}>
                2. High-Tech Utilities & VIP Add-ons
              </h4>

              <div className="glass-card p-3 rounded-4 mb-4 d-flex flex-column gap-2 shadow-sm">
                <label className="d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={hasAddonWifi} onChange={e => setHasAddonWifi(e.target.checked)} />
                    <div>
                      <div className="small fw-semibold" style={{ color: 'var(--text-main)' }}>Dedicated 5G Gigabit Low-Latency Fiber WiFi</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>High-bandwidth line for live video streaming & hardware demos</div>
                    </div>
                  </div>
                  <span className="small text-primary fw-bold">+$200</span>
                </label>

                <label className="d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={hasAddonHologram} onChange={e => setHasAddonHologram(e.target.checked)} />
                    <div>
                      <div className="small fw-semibold" style={{ color: 'var(--text-main)' }}>3D Holographic Spinning Pedestal Showcase</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>Animated crystal 3D product display artifact inside your virtual booth</div>
                    </div>
                  </div>
                  <span className="small text-primary fw-bold">+$450</span>
                </label>

                <label className="d-flex align-items-center justify-content-between p-2.5 rounded-3 cursor-pointer" style={{ background: 'var(--bg-subtle)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <input type="checkbox" checked={hasAddonEV} onChange={e => setHasAddonEV(e.target.checked)} />
                    <div>
                      <div className="small fw-semibold" style={{ color: 'var(--text-main)' }}>VIP Valet & Reserved EV Supercharging Spot</div>
                      <div className="text-muted" style={{ fontSize: '11px' }}>Designated parking bay in the Multi-Level Solar Parking Plaza</div>
                    </div>
                  </div>
                  <span className="small text-primary fw-bold">+$150</span>
                </label>
              </div>
            </div>

            {/* Right Column: Reservation Form & Order Summary */}
            <div className="col-lg-5">
              <div className="glass-card p-4 rounded-4 shadow-lg sticky-top" style={{ top: '90px', borderColor: 'var(--border-subtle)' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: 'var(--heading-color)' }}>
                  <Building2 size={20} className="text-primary" />
                  <span>3. Exhibitor Information</span>
                </h4>

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label text-muted small fw-semibold">Company Name *</label>
                    <input 
                      type="text" 
                      required 
                      className="form-control rounded-3" 
                      placeholder="e.g. Apex AI Dynamics"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label text-muted small fw-semibold">Industry Sector *</label>
                    <select 
                      className="form-select rounded-3"
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                    >
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Robotics">Robotics & Autonomous Mobility</option>
                      <option value="Cloud Computing">Cloud & Edge Computing</option>
                      <option value="Cybersecurity">Cybersecurity & Zero Trust</option>
                      <option value="Fintech">Fintech & Digital Banking</option>
                      <option value="BioTech">BioTech & Genomics</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-muted small fw-semibold">Preferred Available Booth *</label>
                    <select 
                      className="form-select rounded-3 font-monospace"
                      value={selectedBooth}
                      onChange={e => setSelectedBooth(e.target.value)}
                    >
                      {availableBooths.length > 0 ? (
                        availableBooths.map(b => (
                          <option key={b._id} value={b.boothNumber}>
                            Booth {b.boothNumber} ({b.sector || b.boothNumber.charAt(0)} Sector • {b.size?.width || 5}m × {b.size?.depth || 4.5}m)
                          </option>
                        ))
                      ) : (
                        <option value="A01">Booth A01 (Ground Floor - Sector A)</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="form-label text-muted small fw-semibold">Official Business Email *</label>
                    <input 
                      type="email" 
                      required 
                      className="form-control rounded-3" 
                      placeholder="executive@company.com"
                      value={contactEmail}
                      onChange={e => setContactEmail(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="form-label text-muted small fw-semibold">Phone Number</label>
                    <input 
                      type="tel" 
                      className="form-control rounded-3" 
                      placeholder="+1 (555) 019-2834"
                      value={contactPhone}
                      onChange={e => setContactPhone(e.target.value)}
                    />
                  </div>

                  {/* Price Summary Breakdown */}
                  <div className="p-3 rounded-3 mt-2" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)' }}>
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>{pkg.name}:</span>
                      <span>${pkg.price}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted small mb-2">
                      <span>Selected Add-ons:</span>
                      <span>${addonsTotal}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="fw-bold" style={{ color: 'var(--heading-color)' }}>Grand Total:</span>
                      <span className="fw-extrabold fs-4 text-gradient font-monospace">${grandTotal} USD</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn btn-primary-custom w-100 py-3 d-flex align-items-center justify-content-center gap-2 mt-2 shadow-lg"
                  >
                    {loading ? (
                      <span>Provisioning Booth Space...</span>
                    ) : (
                      <>
                        <CreditCard size={18} />
                        <span className="fw-bold">Confirm & Book Booth Space</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-muted small mt-1 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: '11px' }}>
                    <Lock size={12} className="text-primary" /> Guaranteed Instant Provisioning & 3D Spatial Registration
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookBoothPage;
