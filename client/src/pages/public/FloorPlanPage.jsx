import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Box, Layers, Search, X, MapPin, Navigation, RotateCcw, ChevronDown,
  Wifi, Eye, EyeOff, Users, Building2, AlertTriangle, Zap, 
  HeartPulse, Info, Clock, Star, StarOff, Share2, Maximize2,
  Activity, Map, Grid3x3, Filter, Shield, Thermometer, ChevronRight,
  Phone, Globe, Mail, Calendar, ArrowRight, Building, Sparkles, Car, Video,
  Compass, ChevronUp, CreditCard, Check
} from 'lucide-react';
import ExpoScene from '../../three/ExpoScene';
import FloorPlan2D from '../../three/FloorPlan2D';
import MiniMap from '../../three/MiniMap';
import InstantBoothBookingModal from '../../components/booking/InstantBoothBookingModal';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { soundFX } from '../../utils/soundFX';

const LAYER_GROUPS = [
  { key: 'Exhibitor Booths', color: '#10b981', desc: 'All company exhibition spaces' },
  { key: 'Food & Cafes', color: '#f59e0b', desc: 'Dining & Barista service' },
  { key: 'Restrooms', color: '#0284c7', desc: 'Hygiene & water refill' },
  { key: 'Entrances', color: '#25d366', desc: 'Entry gates & badge scan' },
  { key: 'Emergency Exits', color: '#ef4444', desc: 'Emergency egress routes' },
  { key: 'Meeting Rooms', color: '#8b5cf6', desc: 'B2B workshop rooms' },
  { key: 'Stages', color: '#06b6d4', desc: 'Keynote & demo arenas' },
  { key: 'Charging Stations', color: '#10b981', desc: 'Device charging kiosks' },
  { key: 'Medical', color: '#f43f5e', desc: 'First aid & paramedics' },
  { key: 'Parking', color: '#6366f1', desc: 'Multi-level parking garage' },
  { key: 'Information Desks', color: '#14b8a6', desc: 'Concierge & help desk' },
  { key: 'VIP Areas', color: '#ec4899', desc: 'Private investor lounge' },
];

const FLOORS = [
  { id: 'floor-0', name: 'Ground Floor', level: 0, desc: 'Main Exhibition Hall & Keynote Arena' },
  { id: 'floor-1', name: '1st Floor', level: 1, desc: 'Innovation Showcase & Robotics Pavilion' },
  { id: 'floor-2', name: '2nd Floor', level: 2, desc: 'Executive Suites & Startup Pitch Alley' },
  { id: 'floor-vip', name: 'VIP Sky Floor', level: 3, desc: 'Investor Lounges & Skyline Terrace' },
];

const USER_LOCATION = { x: 0, y: 0, z: 42 };

const FloorPlanPage = () => {
  const { theme, isNeon } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialBookingMode = searchParams.get('mode') === 'booking';

  const [view, setView] = useState('3D');
  const [viewMode, setViewMode] = useState('INDOOR');
  const [isBookingMode, setIsBookingMode] = useState(initialBookingMode);
  const [booths, setBooths] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [bookingBooth, setBookingBooth] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [activeLayers, setActiveLayers] = useState(() =>
    Object.fromEntries(LAYER_GROUPS.map(l => [l.key, true]))
  );
  const [activeFloor, setActiveFloor] = useState('floor-0');
  const [showAllFloors, setShowAllFloors] = useState(false);
  const [isDroneTour, setIsDroneTour] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [showNavigation, setShowNavigation] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);
  const [showUserLocation, setShowUserLocation] = useState(true);
  const [showTouchHint, setShowTouchHint] = useState(true);
  const [navigationRoute, setNavigationRoute] = useState(null);
  const [navFrom, setNavFrom] = useState('Your Current Location');
  const [navTo, setNavTo] = useState('');
  const [navTarget, setNavTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [cameraPreset, setCameraPreset] = useState('DEFAULT');
  const [cameraTargetPos, setCameraTargetPos] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-hide touch hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTouchHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Load booths and facilities
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [boothsRes, facilitiesRes] = await Promise.all([
          api.get('/booths'),
          api.get('/facilities')
        ]);

        if (isMounted) {
          const boothData = Array.isArray(boothsRes.data) ? boothsRes.data : boothsRes.data?.booths || [];
          const facilityData = Array.isArray(facilitiesRes.data) ? facilitiesRes.data : [];
          setBooths(boothData);
          setFacilities(facilityData);
        }
      } catch (err) {
        console.error('FloorPlanPage load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  // Filter booths by active floor
  const currentFloorBooths = useMemo(() => {
    if (activeFloor === 'floor-0') return booths.slice(0, 26);
    if (activeFloor === 'floor-1') return booths.slice(12, 38);
    if (activeFloor === 'floor-2') return booths.slice(20, 46);
    return booths.slice(30, 50);
  }, [booths, activeFloor]);

  const stats = useMemo(() => {
    const total = currentFloorBooths.length;
    const available = currentFloorBooths.filter(b => b.status === 'AVAILABLE').length;
    const reserved = currentFloorBooths.filter(b => b.status === 'RESERVED').length;
    const occupied = currentFloorBooths.filter(b => b.status === 'OCCUPIED').length;
    return { total, available, reserved, occupied };
  }, [currentFloorBooths]);

  const handleFloorChange = (floorId) => {
    soundFX.playTeleport();
    setActiveFloor(floorId);
    setViewMode('INDOOR');
    setShowAllFloors(false);
    setIsDroneTour(false);
    setCameraPreset('DEFAULT');
  };

  const handleToggleViewMode = (mode) => {
    soundFX.playClick();
    setViewMode(mode);
    setIsDroneTour(false);
    setCameraPreset('DEFAULT');
    setSelectedBooth(null);
    setSelectedFacility(null);
  };

  const handleToggleDroneTour = () => {
    soundFX.playThemeSwitch();
    setIsDroneTour(prev => !prev);
  };

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDrop(false);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(res.data.results?.slice(0, 12) || []);
        setShowSearchDrop(true);
      } catch {
        const localResults = booths
          .filter(b =>
            (b.boothNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b.companyName || '').toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 8)
          .map(b => ({
            type: 'booth', id: b._id, title: `Booth ${b.boothNumber}`,
            subtitle: b.companyName || 'Available', location: `Sector ${b.sector || b.boothNumber.charAt(0)}`,
            position: b.position, raw: b
          }));
        setSearchResults(localResults);
        setShowSearchDrop(localResults.length > 0);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [searchQuery, booths]);

  const handleBoothSelect = useCallback((booth) => {
    soundFX.playClick();
    setSelectedBooth(booth);
    setSelectedFacility(null);
    setIsDroneTour(false);
    if (booth?.position) {
      setCameraPreset('TARGET');
      setCameraTargetPos(booth.position);
    }
    // If in booking mode and booth is open, launch booking studio
    if (isBookingMode && booth?.status === 'AVAILABLE') {
      soundFX.playTeleport();
      setBookingBooth(booth);
    }
  }, [isBookingMode]);

  const handleFacilitySelect = useCallback((fac) => {
    soundFX.playClick();
    setSelectedFacility(fac);
    setSelectedBooth(null);
    setIsDroneTour(false);
  }, []);

  const toggleLayer = (key) => {
    soundFX.playClick();
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearchSelect = (result) => {
    setSearchQuery('');
    setShowSearchDrop(false);
    setViewMode('INDOOR');
    setIsDroneTour(false);
    if (result.type === 'booth' && result.raw) {
      handleBoothSelect(result.raw);
    } else if (result.type === 'facility' && result.raw) {
      handleFacilitySelect(result.raw);
      if (result.position) {
        setCameraPreset('TARGET');
        setCameraTargetPos(result.position);
      }
    }
  };

  const handleNavigate = (target = null) => {
    const finalTarget = target || navTarget || selectedBooth || selectedFacility;
    if (!finalTarget) return;
    soundFX.playTeleport();

    const start = USER_LOCATION;
    const end = finalTarget.position || { x: 0, y: 0, z: 0 };
    const dx = end.x - start.x;
    const dz = end.z - start.z;
    const dist = Math.max(12, Math.round(Math.sqrt(dx * dx + dz * dz) * 1.4));
    const walk = Math.max(10, Math.ceil((dist / 80) * 60));

    const name = finalTarget.boothNumber 
      ? `Booth ${finalTarget.boothNumber}${finalTarget.companyName ? ` (${finalTarget.companyName})` : ''}`
      : (finalTarget.name || finalTarget.title || finalTarget.type || 'Destination');

    const sectorName = finalTarget.sector || (finalTarget.boothNumber ? finalTarget.boothNumber.charAt(0) : 'Central');

    setNavigationRoute({ 
      startPos: start, 
      endPos: end, 
      distance: dist, 
      walkTime: walk, 
      target: { ...finalTarget, name, title: name },
      steps: [
        `Depart from Current Location (Main Concourse L0)`,
        `Follow illuminated green runway along Central Hall towards Sector ${sectorName}`,
        `Arrive at ${name}`
      ]
    });
    setNavTarget(finalTarget);
    setShowNavigation(false);
    setViewMode('INDOOR');
    setIsDroneTour(false);
    setCameraPreset('TARGET');
    setCameraTargetPos(end);
  };

  const clearNavigation = () => {
    soundFX.playClick();
    setNavigationRoute(null);
    setNavTo('');
    setNavTarget(null);
  };

  const handleEmergency = () => {
    soundFX.playBeep(900, 0.3, 'sawtooth');
    setIsEmergency(prev => !prev);
    if (!isEmergency) setViewMode('INDOOR');
  };

  const handleConfirmBoothBooking = (updatedBooth) => {
    setBooths(prev => prev.map(b => (b.boothNumber === updatedBooth.boothNumber ? updatedBooth : b)));
    setSelectedBooth(updatedBooth);
  };

  const getStatusBadge = (status) => {
    const map = {
      'AVAILABLE': { cls: 'badge-available', label: 'AVAILABLE' },
      'RESERVED': { cls: 'badge-reserved', label: 'RESERVED' },
      'OCCUPIED': { cls: 'badge-occupied', label: 'OCCUPIED' },
      'MAINTENANCE': { cls: 'badge bg-danger text-white', label: 'MAINTENANCE' }
    };
    const b = map[status] || { cls: 'badge bg-secondary text-muted', label: 'UNAVAILABLE' };
    return <span className={b.cls}>{b.label}</span>;
  };

  const activeFloorObj = FLOORS.find(f => f.id === activeFloor) || FLOORS[0];

  return (
    <div 
      className="d-flex flex-column flex-grow-1 overflow-hidden" 
      style={{ 
        background: 'var(--bg-dark)', 
        color: 'var(--text-main)', 
        height: 'calc(100vh - 60px - 36px)', 
        position: 'relative' 
      }}
    >
      {/* Emergency Alert Banner */}
      {isEmergency && (
        <div 
          className="py-1.5 text-center fw-bold text-white d-flex align-items-center justify-content-center gap-3 flex-shrink-0"
          style={{ background: 'linear-gradient(90deg, #7f1d1d, #dc2626, #7f1d1d)', animation: 'emergencyPulse 1s ease-in-out infinite', fontSize: '0.85rem' }}
        >
          <AlertTriangle size={16} />
          EMERGENCY EVACUATION ACTIVE — Follow Highlighted Exit Routes
          <button className="btn btn-outline-light btn-sm fw-bold py-0 px-2" style={{ fontSize: '11px' }} onClick={handleEmergency}>
            ✕ DEACTIVATE
          </button>
        </div>
      )}

      {/* 3D BOOTH BOOKING MODE BANNER */}
      {isBookingMode && (
        <div 
          className="py-1.5 px-3 text-center fw-bold d-flex align-items-center justify-content-between flex-shrink-0 animate-fade-in"
          style={{ 
            background: isNeon ? 'linear-gradient(90deg, #052e16, #065f46, #052e16)' : 'linear-gradient(90deg, #064e3b, #047857, #064e3b)', 
            color: '#ffffff',
            fontSize: '0.82rem',
            borderBottom: '1px solid var(--primary-500)'
          }}
        >
          <div className="d-flex align-items-center gap-2 mx-auto">
            <Sparkles size={15} className="text-warning animate-pulse" />
            <span><strong>3D EXHIBITOR BOOKING ACTIVE:</strong> Click any green <strong>AVAILABLE</strong> booth in 3D to reserve space instantly!</span>
          </div>
          <button 
            className="btn btn-sm btn-outline-light py-0 px-2 fw-semibold"
            style={{ fontSize: '10px' }}
            onClick={() => setIsBookingMode(false)}
          >
            Switch to Explore Mode
          </button>
        </div>
      )}

      {/* Sleek Header Toolbar */}
      <div className="py-2 px-3 px-md-4 flex-shrink-0" style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="container-fluid px-0">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">

            {/* Left: Title & Quick Status */}
            <div className="d-flex align-items-center gap-2">
              <Building2 className="text-primary" size={20} />
              <h5 className="fw-bold mb-0 lh-1" style={{ color: 'var(--heading-color)', fontSize: '1.05rem' }}>
                {viewMode === 'EXTERIOR' ? 'Convention Complex 3D' : 'Convention Center 3D'}
              </h5>
              <span className="badge btn-primary-custom px-2 py-0.5 rounded-pill" style={{ fontSize: '9px' }}>
                {viewMode === 'EXTERIOR' ? 'Exterior Campus' : activeFloorObj.name}
              </span>

              {/* 3D Booking Mode Toggle Badge */}
              <button
                type="button"
                onClick={() => {
                  soundFX.playClick();
                  setIsBookingMode(p => !p);
                }}
                className={`btn btn-sm py-0.5 px-2 rounded-pill font-monospace fw-bold d-flex align-items-center gap-1 ${
                  isBookingMode ? 'btn-success text-white shadow-sm' : 'btn-outline-custom'
                }`}
                style={{ fontSize: '10px' }}
                title="Toggle Exhibitor Booth Booking Mode"
              >
                <CreditCard size={11} />
                <span>{isBookingMode ? 'Booking Mode ON' : 'Book a Booth'}</span>
              </button>

              {viewMode === 'INDOOR' && (
                <div className="d-none d-xl-flex align-items-center gap-2 ms-2 ps-2 border-start" style={{ borderColor: 'var(--border-subtle)', fontSize: '11px' }}>
                  <span className="text-muted"><strong style={{ color: 'var(--heading-color)' }}>{stats.total}</strong> Booths</span>
                  <span className="text-success">● <strong>{stats.available}</strong> Open</span>
                  <span className="text-warning">● <strong>{stats.reserved}</strong> Reserved</span>
                </div>
              )}
            </div>

            {/* Center: Search Input */}
            <div className="position-relative flex-grow-1 flex-md-grow-0" style={{ minWidth: '180px', maxWidth: '280px' }}>
              <Search size={13} className="position-absolute text-muted" style={{ left: '9px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                className="form-control form-control-sm ps-4 pe-4 rounded-3"
                placeholder="Search booths, parking..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.8rem', height: '32px' }}
              />
              {searchQuery && (
                <button className="btn p-0 position-absolute end-0 top-50 translate-middle-y me-2 text-secondary" onClick={() => { setSearchQuery(''); setShowSearchDrop(false); }}>
                  <X size={12} />
                </button>
              )}

              {/* Search Dropdown */}
              {showSearchDrop && searchResults.length > 0 && (
                <div className="position-absolute w-100 mt-1 rounded-3 overflow-hidden shadow-lg glass-card" style={{ zIndex: 2000 }}>
                  {searchResults.map((r, i) => {
                    return (
                      <button
                        key={i}
                        onClick={() => handleSearchSelect(r)}
                        className="btn w-100 text-start px-2.5 py-1.5 d-flex align-items-center gap-2 border-bottom border-secondary border-opacity-10"
                        style={{ background: 'transparent', fontSize: '0.82rem', color: 'var(--text-main)' }}
                      >
                        <MapPin size={13} className="text-primary flex-shrink-0" />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-medium text-truncate">{r.title}</div>
                          <div className="text-muted small text-truncate">{r.subtitle} • {r.location}</div>
                        </div>
                        <span className="badge bg-primary bg-opacity-20 text-primary" style={{ fontSize: '8px' }}>{r.type}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: View Switchers & Controls */}
            <div className="d-flex align-items-center gap-1.5 overflow-x-auto text-nowrap">
              
              {/* 2-Way View Switcher */}
              <div className="d-flex rounded-3 overflow-hidden p-0.5 glass-card" style={{ border: '1px solid var(--border-bright)', gap: '2px' }}>
                <button
                  type="button"
                  onClick={() => handleToggleViewMode('EXTERIOR')}
                  className={`btn btn-sm px-2.5 py-1 rounded-2 d-flex align-items-center gap-1 font-monospace fw-bold ${viewMode === 'EXTERIOR' ? 'btn-primary-custom' : 'text-secondary'}`}
                  style={{ fontSize: '0.75rem', border: 'none' }}
                >
                  <Building size={12} />
                  <span>Exterior Campus</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleViewMode('INDOOR')}
                  className={`btn btn-sm px-2.5 py-1 rounded-2 d-flex align-items-center gap-1 font-monospace fw-bold ${viewMode === 'INDOOR' ? 'btn-primary-custom' : 'text-secondary'}`}
                  style={{ fontSize: '0.75rem', border: 'none' }}
                >
                  <Grid3x3 size={12} />
                  <span>Indoor Layout</span>
                </button>
              </div>

              {/* Drone Tour Toggle */}
              {view === '3D' && (
                <button
                  onClick={handleToggleDroneTour}
                  className={`btn btn-sm d-flex align-items-center gap-1 font-monospace ${isDroneTour ? 'btn-primary-custom animate-pulse' : 'btn-outline-custom'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 9px' }}
                >
                  <Video size={12} className={isDroneTour ? 'text-white' : 'text-primary'} />
                  <span>{isDroneTour ? 'Stop Tour' : 'Drone Tour'}</span>
                </button>
              )}

              {/* 3D / 2D Toggle */}
              {viewMode === 'INDOOR' && (
                <div className="d-flex rounded-3 overflow-hidden" style={{ border: '1px solid var(--border-bright)' }}>
                  <button
                    className={`btn btn-sm px-2 py-0.5 ${view === '3D' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    style={{ borderRadius: 0, border: 'none', fontSize: '0.75rem' }}
                    onClick={() => { soundFX.playClick(); setView('3D'); }}
                  >
                    3D
                  </button>
                  <button
                    className={`btn btn-sm px-2 py-0.5 ${view === '2D' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    style={{ borderRadius: 0, border: 'none', fontSize: '0.75rem' }}
                    onClick={() => { soundFX.playClick(); setView('2D'); }}
                  >
                    2D
                  </button>
                </div>
              )}

              {/* Layers Toggle */}
              {viewMode === 'INDOOR' && (
                <button
                  onClick={() => setShowLayers(p => !p)}
                  className={`btn btn-sm d-flex align-items-center gap-1 ${showLayers ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 9px' }}
                >
                  <Layers size={12} /> Layers
                </button>
              )}

              {/* Navigation */}
              {viewMode === 'INDOOR' && (
                <button
                  onClick={() => setShowNavigation(p => !p)}
                  className={`btn btn-sm d-flex align-items-center gap-1 ${navigationRoute ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                  style={{ fontSize: '0.75rem', padding: '4px 9px' }}
                >
                  <Navigation size={12} /> Route
                </button>
              )}

              {/* Emergency */}
              <button
                onClick={handleEmergency}
                className={`btn btn-sm fw-bold d-flex align-items-center gap-1 ${isEmergency ? 'btn-danger' : 'btn-outline-danger'}`}
                style={{ fontSize: '0.75rem', padding: '4px 9px' }}
              >
                <AlertTriangle size={12} /> {isEmergency ? 'Exit' : 'SOS'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Height 3D Canvas Body */}
      <div className="flex-grow-1 position-relative overflow-hidden d-flex p-2 p-md-3 gap-3" style={{ minHeight: 0 }}>

        {/* Desktop Layers Sidebar */}
        {showLayers && viewMode === 'INDOOR' && (
          <div className="flex-shrink-0 glass-card p-3 animate-fade-in d-none d-lg-block h-100 overflow-y-auto" style={{ width: '220px' }}>
            <h6 className="fw-bold mb-2.5 d-flex justify-content-between align-items-center" style={{ color: 'var(--heading-color)', fontSize: '0.9rem' }}>
              Map Layers
              <button className="btn p-0 text-secondary" onClick={() => setShowLayers(false)}>
                <X size={14} />
              </button>
            </h6>
            <div className="d-flex flex-column gap-1.5">
              {LAYER_GROUPS.map(l => (
                <div
                  key={l.key}
                  onClick={() => toggleLayer(l.key)}
                  className="d-flex align-items-center gap-2 p-1.5 rounded-2 cursor-pointer transition-all"
                  style={{
                    background: activeLayers[l.key] ? 'var(--primary-glow)' : 'transparent',
                    border: `1px solid ${activeLayers[l.key] ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                    opacity: activeLayers[l.key] ? 1 : 0.6
                  }}
                >
                  <span className="rounded-circle d-inline-block" style={{ width: '8px', height: '8px', background: l.color }} />
                  <span className="small fw-medium flex-grow-1 text-truncate" style={{ color: 'var(--heading-color)', fontSize: '0.78rem' }}>{l.key}</span>
                  {activeLayers[l.key] ? <Eye size={12} className="text-primary" /> : <EyeOff size={12} className="text-muted" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3D Canvas Box */}
        <div className="flex-grow-1 position-relative rounded-4 overflow-hidden h-100" style={{ border: isEmergency ? '2px solid #ef4444' : '1px solid var(--border-subtle)' }}>
          
          {/* Desktop Elevator HUD */}
          {view === '3D' && viewMode === 'INDOOR' && (
            <div className="floor-hud-container d-none d-md-flex animate-fade-in">
              <div className="d-flex align-items-center justify-content-between px-2 pb-1 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="small fw-bold font-monospace d-flex align-items-center gap-1" style={{ fontSize: '10px', color: 'var(--heading-color)' }}>
                  <Layers size={11} className="text-primary" /> LEVELS
                </span>
                <span className="badge" style={{ fontSize: '8px', background: 'var(--primary-glow)', color: 'var(--text-main)' }}>
                  L{activeFloorObj.level}
                </span>
              </div>
              {FLOORS.map(floor => (
                <button
                  key={floor.id}
                  onClick={() => handleFloorChange(floor.id)}
                  className={`floor-hud-btn ${activeFloor === floor.id ? 'active' : ''}`}
                  title={floor.desc}
                >
                  <div className="d-flex align-items-center gap-1.5">
                    <Building2 size={12} />
                    <span>{floor.name}</span>
                  </div>
                  <span className="floor-hud-badge">L{floor.level}</span>
                </button>
              ))}
            </div>
          )}

          {/* Mobile Thumb-Friendly Floor Selector Bar */}
          {view === '3D' && viewMode === 'INDOOR' && (
            <div 
              className="position-absolute d-flex d-md-none gap-1 p-1 rounded-pill glass-card shadow-lg animate-fade-in"
              style={{
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 400,
                background: 'var(--glass-bg)',
                border: '1.5px solid var(--border-bright)'
              }}
            >
              {FLOORS.map(floor => (
                <button
                  key={floor.id}
                  onClick={() => handleFloorChange(floor.id)}
                  className={`btn btn-sm rounded-pill px-2.5 py-1 fw-bold font-monospace ${activeFloor === floor.id ? 'btn-primary-custom' : 'text-secondary'}`}
                  style={{ fontSize: '0.72rem', border: 'none' }}
                >
                  L{floor.level}: {floor.name}
                </button>
              ))}
            </div>
          )}

          {/* Touch Gesture Helper Toast */}
          {showTouchHint && (
            <div 
              className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-1 rounded-pill glass-card shadow-sm d-flex align-items-center gap-1 font-monospace text-muted small animate-fade-in"
              style={{ zIndex: 500, fontSize: '10px', pointerEvents: 'none' }}
            >
              <Compass size={12} className="text-primary" />
              <span>Drag to Orbit • Pinch to Zoom</span>
            </div>
          )}

          {/* Quick Enter Exhibition button from Exterior */}
          {viewMode === 'EXTERIOR' && (
            <div className="position-absolute top-0 start-0 m-2.5 z-3 animate-fade-in">
              <button
                onClick={() => handleToggleViewMode('INDOOR')}
                className="btn btn-primary-custom d-flex align-items-center gap-1.5 shadow-lg"
                style={{ borderRadius: '20px', padding: '6px 14px', fontSize: '0.8rem' }}
              >
                <ArrowRight size={13} /> Enter Exhibition Hall
              </button>
            </div>
          )}

          {loading ? (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-2" />
                <div className="text-secondary small">Rendering 3D Convention Building...</div>
              </div>
            </div>
          ) : view === '3D' ? (
            <ExpoScene
              booths={currentFloorBooths}
              selectedBooth={selectedBooth}
              onSelectBooth={handleBoothSelect}
              facilities={facilities}
              activeLayers={activeLayers}
              selectedSector={selectedSector}
              activeFloor={activeFloor}
              showAllFloors={showAllFloors}
              viewMode={viewMode}
              onSelectFloor={handleFloorChange}
              navigationRoute={navigationRoute}
              userLocation={showUserLocation ? USER_LOCATION : null}
              showHeatmap={showHeatmap}
              isEmergency={isEmergency}
              cameraPreset={cameraPreset}
              cameraTargetPos={cameraTargetPos}
              isDroneTour={isDroneTour}
              onSelectFacility={handleFacilitySelect}
              onEnterInterior={() => handleToggleViewMode('INDOOR')}
            />
          ) : (
            <div className="p-3 overflow-auto h-100" style={{ background: 'var(--bg-surface)' }}>
              <FloorPlan2D
                booths={currentFloorBooths}
                selectedBooth={selectedBooth}
                onSelectBooth={handleBoothSelect}
                facilities={facilities}
                activeLayers={activeLayers}
                selectedSector={selectedSector}
                navigationRoute={navigationRoute}
                isEmergency={isEmergency}
                onNavigate={handleNavigate}
              />
            </div>
          )}

          {/* Mini-Map Overlay (Desktop only) */}
          {view === '3D' && viewMode === 'INDOOR' && !loading && (
            <div className="d-none d-lg-block">
              <MiniMap
                booths={currentFloorBooths}
                selectedBooth={selectedBooth}
                userLocation={showUserLocation ? USER_LOCATION : null}
                onSelectBooth={handleBoothSelect}
                isEmergency={isEmergency}
              />
            </div>
          )}

          {/* Floating 3D Navigation GPS HUD */}
          {navigationRoute && viewMode === 'INDOOR' && (
            <div 
              className="position-absolute top-0 end-0 m-2.5 p-3 rounded-4 glass-card shadow-lg animate-fade-in" 
              style={{ 
                zIndex: 600, 
                maxWidth: '280px', 
                border: isEmergency ? '1.5px solid #ef4444' : '1.5px solid var(--primary-500)',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(12px)'
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center gap-1.5">
                  <span className="badge bg-success bg-opacity-25 text-success d-flex align-items-center gap-1 font-monospace" style={{ fontSize: '10px' }}>
                    <Navigation size={10} className="text-success" />
                    NAV ACTIVE
                  </span>
                  <span className="badge bg-primary bg-opacity-20 text-primary font-monospace" style={{ fontSize: '10px' }}>
                    L{activeFloorObj.level}
                  </span>
                </div>
                <button className="btn btn-sm p-0.5 text-secondary" onClick={clearNavigation} title="Cancel Navigation">
                  <X size={15} />
                </button>
              </div>

              <div className="fw-bold text-truncate mb-1" style={{ color: 'var(--heading-color)', fontSize: '0.88rem' }}>
                {navigationRoute.target?.name || navigationRoute.target?.title || 'Destination'}
              </div>

              <div className="d-flex align-items-center gap-3 mb-2 font-monospace">
                <div className="d-flex align-items-center gap-1 text-primary fw-bold small">
                  <Compass size={12} /> {navigationRoute.distance}m
                </div>
                <div className="d-flex align-items-center gap-1 text-muted small">
                  <Clock size={12} /> ~{navigationRoute.walkTime}s walk
                </div>
              </div>

              {/* Turn Step Instructions */}
              <div className="p-2 rounded-2 mb-2 small" style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', fontSize: '11px', lineHeight: '1.4' }}>
                <div className="text-muted" style={{ fontSize: '9px', fontWeight: 600 }}>NEXT INSTRUCTION:</div>
                <div className="fw-medium text-white">
                  {navigationRoute.steps?.[1] || `Follow illuminated runway towards ${navigationRoute.target?.name || 'target'}`}
                </div>
              </div>

              <div className="d-flex gap-1.5">
                <button
                  className="btn btn-primary-custom btn-sm flex-grow-1 py-1 font-monospace"
                  style={{ fontSize: '11px' }}
                  onClick={() => {
                    soundFX.playClick();
                    setCameraPreset('TARGET');
                    if (navigationRoute.endPos) setCameraTargetPos(navigationRoute.endPos);
                  }}
                >
                  Focus Target
                </button>
                <button
                  className="btn btn-outline-custom btn-sm flex-grow-1 py-1 font-monospace"
                  style={{ fontSize: '11px' }}
                  onClick={() => {
                    soundFX.playClick();
                    setCameraPreset('TOP');
                  }}
                >
                  Top View
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Detail Sidebar */}
        {viewMode === 'INDOOR' && (selectedBooth || selectedFacility) && (
          <div className="flex-shrink-0 glass-card animate-fade-in d-none d-lg-block h-100 overflow-y-auto" style={{ width: '280px' }}>
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2.5">
                <h6 className="fw-bold mb-0" style={{ color: 'var(--heading-color)', fontSize: '0.95rem' }}>
                  {selectedBooth ? `Booth ${selectedBooth.boothNumber}` : selectedFacility?.type}
                </h6>
                <button className="btn p-0 text-secondary" onClick={() => { setSelectedBooth(null); setSelectedFacility(null); }}>
                  <X size={15} />
                </button>
              </div>

              {selectedBooth && (
                <>
                  <div className="mb-2.5">
                    {getStatusBadge(selectedBooth.status)}
                    {selectedBooth.sector && (
                      <span className="badge bg-primary bg-opacity-20 text-primary ms-1.5" style={{ fontSize: '10px' }}>Sector {selectedBooth.sector}</span>
                    )}
                  </div>

                  {selectedBooth.companyName && (
                    <div className="mb-2">
                      <div className="d-flex align-items-center gap-1.5 mb-1">
                        <Building2 size={13} className="text-primary" />
                        <span className="fw-semibold small" style={{ color: 'var(--heading-color)' }}>{selectedBooth.companyName}</span>
                      </div>
                      {selectedBooth.category && (
                        <span className="badge bg-info bg-opacity-15 text-info" style={{ fontSize: '9px' }}>{selectedBooth.category}</span>
                      )}
                    </div>
                  )}

                  {selectedBooth.description && (
                    <p className="text-muted small mb-2.5" style={{ fontSize: '11px', lineHeight: '1.4' }}>{selectedBooth.description}</p>
                  )}

                  <div className="row g-1.5 mb-3">
                    <div className="col-6">
                      <div className="rounded-2 p-1.5 text-center" style={{ background: 'var(--bg-subtle)' }}>
                        <div className="text-muted" style={{ fontSize: '9px' }}>AREA</div>
                        <div className="fw-semibold small" style={{ color: 'var(--heading-color)', fontSize: '11px' }}>{(selectedBooth.size?.width || 5) * (selectedBooth.size?.depth || 4.5)} sqm</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="rounded-2 p-1.5 text-center" style={{ background: 'var(--bg-subtle)' }}>
                        <div className="text-muted" style={{ fontSize: '9px' }}>FLOOR</div>
                        <div className="fw-semibold small" style={{ color: 'var(--heading-color)', fontSize: '11px' }}>{activeFloorObj.name}</div>
                      </div>
                    </div>
                  </div>

                  <div className="d-grid gap-1.5">
                    {selectedBooth.status === 'AVAILABLE' && (
                      <button 
                        className="btn btn-primary-custom btn-sm py-1.5"
                        style={{ fontSize: '0.8rem' }}
                        onClick={() => setBookingBooth(selectedBooth)}
                      >
                        <Sparkles size={12} /> Reserve Booth
                      </button>
                    )}
                    <button
                      className="btn btn-outline-custom btn-sm py-1.5 d-flex align-items-center justify-content-center gap-1"
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => {
                        handleNavigate(selectedBooth);
                      }}
                    >
                      <Navigation size={12} /> Directions
                    </button>
                  </div>
                </>
              )}

              {selectedFacility && (
                <>
                  <div className="mb-2">
                    <span className="badge bg-info bg-opacity-20 text-info">{selectedFacility.type}</span>
                  </div>
                  <h6 className="fw-semibold mb-1" style={{ color: 'var(--heading-color)', fontSize: '0.9rem' }}>{selectedFacility.name}</h6>
                  <p className="text-muted small mb-3" style={{ fontSize: '11px' }}>{selectedFacility.description}</p>
                  <button
                    className="btn btn-outline-custom btn-sm w-100 py-1.5 d-flex align-items-center justify-content-center gap-1"
                    style={{ fontSize: '0.8rem' }}
                    onClick={() => {
                      handleNavigate(selectedFacility);
                    }}
                  >
                    <Navigation size={12} /> Navigate Here
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile Bottom Sheet Drawer */}
        {viewMode === 'INDOOR' && (selectedBooth || selectedFacility) && (
          <div 
            className="position-fixed bottom-0 start-0 end-0 glass-card d-block d-lg-none shadow-lg animate-fade-in p-3"
            style={{
              zIndex: 1100,
              borderTopLeftRadius: '22px',
              borderTopRightRadius: '22px',
              borderBottomLeftRadius: '0',
              borderBottomRightRadius: '0',
              maxHeight: '45vh',
              overflowY: 'auto',
              borderTop: '2px solid var(--primary-500)',
              background: 'var(--bg-card)'
            }}
          >
            <div className="mx-auto mb-2 rounded-pill" style={{ width: '36px', height: '4px', background: 'var(--border-bright)' }} />
            
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="fw-bold mb-0" style={{ color: 'var(--heading-color)' }}>
                {selectedBooth ? `Booth ${selectedBooth.boothNumber}` : selectedFacility?.type}
              </h6>
              <button className="btn btn-sm p-0.5 text-secondary" onClick={() => { setSelectedBooth(null); setSelectedFacility(null); }}>
                <X size={16} />
              </button>
            </div>

            {selectedBooth && (
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  {getStatusBadge(selectedBooth.status)}
                  <span className="fw-bold small" style={{ color: 'var(--heading-color)' }}>{selectedBooth.companyName || 'Available Space'}</span>
                </div>

                <div className="d-flex gap-2">
                  {selectedBooth.status === 'AVAILABLE' && (
                    <button 
                      className="btn btn-primary-custom flex-grow-1 py-1.5 btn-sm"
                      onClick={() => setBookingBooth(selectedBooth)}
                    >
                      <Sparkles size={12} /> Reserve Booth
                    </button>
                  )}
                  <button
                    className="btn btn-outline-custom flex-grow-1 py-1.5 btn-sm d-flex align-items-center justify-content-center gap-1"
                    onClick={() => {
                      handleNavigate(selectedBooth);
                    }}
                  >
                    <Navigation size={12} /> Direct Route
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🧭 Wayfinding & Route Planner Modal */}
      {showNavigation && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3 animate-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)', zIndex: 2100 }}
          onClick={() => setShowNavigation(false)}
        >
          <div 
            className="glass-card p-4 rounded-4 shadow-lg position-relative animate-fade-in"
            style={{ maxWidth: '520px', width: '100%', border: '1.5px solid var(--primary-500)', background: 'var(--bg-surface)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <div className="p-2 rounded-3 bg-primary bg-opacity-20 text-primary">
                  <Navigation size={20} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--heading-color)' }}>
                    Wayfinding & Route Planner
                  </h5>
                  <span className="text-muted small">Real-time turn-by-turn guidance across the convention complex</span>
                </div>
              </div>
              <button className="btn btn-sm p-1 text-secondary" onClick={() => setShowNavigation(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Start Point Input */}
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold d-flex align-items-center gap-1.5">
                <MapPin size={13} className="text-info" /> Start Position
              </label>
              <select 
                className="form-select form-select-sm rounded-3"
                value={navFrom}
                onChange={e => setNavFrom(e.target.value)}
              >
                <option value="Your Current Location">Your Current Location (Main Concourse Entrance)</option>
                <option value="North Entrance Gate">North Entrance Gate (Sector A)</option>
                <option value="West Gate Portal">West Gate Portal (Sector C)</option>
                <option value="Keynote Arena Stage">Main Keynote Arena Stage</option>
              </select>
            </div>

            {/* Destination Selection */}
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold d-flex align-items-center gap-1.5">
                <Compass size={13} className="text-primary" /> Destination Target
              </label>
              <select
                className="form-select form-select-sm rounded-3 font-monospace"
                value={navTo}
                onChange={e => {
                  const val = e.target.value;
                  setNavTo(val);
                  const found = booths.find(b => b.boothNumber === val) || facilities.find(f => f.name === val || f.type === val);
                  if (found) setNavTarget(found);
                }}
              >
                <option value="">-- Choose destination booth or facility --</option>
                <optgroup label="Keynote Arenas & Facilities">
                  {facilities.map(f => (
                    <option key={f._id || f.name} value={f.name}>{f.name} ({f.type})</option>
                  ))}
                </optgroup>
                <optgroup label="Exhibitor Booths">
                  {booths.map(b => (
                    <option key={b._id || b.boothNumber} value={b.boothNumber}>
                      Booth {b.boothNumber} - {b.companyName || 'Available Space'} (Sector {b.sector || b.boothNumber.charAt(0)})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Quick Navigation Shortcuts */}
            <div className="mb-3">
              <div className="text-muted small fw-semibold mb-2">Quick Navigation Shortcuts:</div>
              <div className="d-flex flex-wrap gap-1.5">
                {facilities.slice(0, 6).map(fac => (
                  <button
                    key={fac._id || fac.name}
                    type="button"
                    className="btn btn-sm btn-outline-custom py-1 px-2 text-truncate font-monospace"
                    style={{ fontSize: '11px', maxWidth: '150px' }}
                    onClick={() => {
                      setNavTo(fac.name);
                      setNavTarget(fac);
                      handleNavigate(fac);
                    }}
                  >
                    {fac.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 pt-2 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                disabled={!navTarget && !navTo}
                className="btn btn-primary-custom flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  if (navTarget) handleNavigate(navTarget);
                  else if (navTo) {
                    const b = booths.find(b => b.boothNumber === navTo);
                    if (b) handleNavigate(b);
                  }
                }}
              >
                <Navigation size={15} />
                <span>Start 3D Navigation</span>
              </button>
              {navigationRoute && (
                <button 
                  type="button"
                  className="btn btn-outline-danger py-2 px-3"
                  onClick={clearNavigation}
                >
                  Clear Route
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3D Booth Instant Booking Modal */}
      <InstantBoothBookingModal
        isOpen={!!bookingBooth}
        onClose={() => setBookingBooth(null)}
        booth={bookingBooth}
        onConfirmBooking={handleConfirmBoothBooking}
      />
    </div>
  );
};

export default FloorPlanPage;
