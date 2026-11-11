import React from 'react';
import { useTheme } from '../context/ThemeContext';

const MiniMap = ({ 
  booths = [], 
  selectedBooth = null, 
  userLocation = null, 
  onSelectBooth = null,
  isEmergency = false 
}) => {
  const { isNeon } = useTheme();

  // Coordinate map mapping (-65 to 65 for X -> 0 to 180px, -55 to 55 for Z -> 0 to 120px)
  const mapX = (x) => ((x + 65) / 130) * 180;
  const mapZ = (z) => ((z + 55) / 110) * 120;

  const bgContainer = isNeon ? 'rgba(5, 8, 7, 0.92)' : 'rgba(255, 255, 255, 0.95)';
  const borderContainer = isEmergency 
    ? '1px solid #ef4444' 
    : isNeon 
      ? '1px solid rgba(0, 255, 136, 0.35)' 
      : '1px solid rgba(18, 140, 126, 0.3)';
  const radarBg = isNeon ? '#040d08' : '#f0fdf4';
  const textColor = isNeon ? '#f0fdf4' : '#111b21';

  return (
    <div 
      className="position-absolute bottom-0 end-0 m-3 p-2 rounded-3 glass-card shadow-lg d-none d-md-block"
      style={{ 
        width: '196px', 
        height: '156px', 
        zIndex: 1020, 
        border: borderContainer,
        background: bgContainer
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-bold font-monospace" style={{ fontSize: '9px', color: textColor }}>
          RADAR MINI-MAP
        </span>
        <span className="badge" style={{ fontSize: '8px', background: isNeon ? 'rgba(0,255,136,0.2)' : 'rgba(18,140,126,0.15)', color: isNeon ? '#00ff88' : '#128c7e' }}>
          LIVE
        </span>
      </div>

      <div 
        className="position-relative rounded overflow-hidden" 
        style={{ 
          width: '180px', 
          height: '120px', 
          background: radarBg, 
          border: isNeon ? '1px solid rgba(0,255,136,0.15)' : '1px solid rgba(0,0,0,0.08)' 
        }}
      >
        {/* Stage Block (North) */}
        <div 
          className="position-absolute rounded-top"
          style={{ top: '2px', left: '60px', width: '60px', height: '14px', background: isNeon ? 'rgba(0, 242, 254, 0.4)' : 'rgba(18, 140, 126, 0.3)' }}
        ></div>

        {/* Entrance Block (South) */}
        <div 
          className="position-absolute rounded-bottom"
          style={{ bottom: '2px', left: '70px', width: '40px', height: '10px', background: isNeon ? 'rgba(0, 255, 136, 0.4)' : 'rgba(37, 211, 102, 0.3)' }}
        ></div>

        {/* Emergency Exits */}
        <div 
          className="position-absolute bg-danger rounded-circle"
          style={{ top: '5px', right: '5px', width: '6px', height: '6px' }}
        ></div>
        <div 
          className="position-absolute bg-danger rounded-circle"
          style={{ top: '5px', left: '5px', width: '6px', height: '6px' }}
        ></div>

        {/* Booth Dots */}
        {booths.map((b) => {
          const bx = mapX(b.position?.x || 0);
          const bz = mapZ(b.position?.z || 0);
          const isSelected = selectedBooth && selectedBooth._id === b._id;

          let color = '#6b7280';
          if (b.status === 'AVAILABLE') color = isNeon ? '#00ff88' : '#25d366';
          else if (b.status === 'RESERVED') color = '#f59e0b';
          else if (b.status === 'OCCUPIED') color = isNeon ? '#00f2fe' : '#128c7e';
          else if (b.status === 'MAINTENANCE') color = '#ef4444';

          return (
            <div
              key={b._id || b.boothNumber}
              onClick={() => onSelectBooth && onSelectBooth(b)}
              className="position-absolute rounded-1 cursor-pointer"
              title={`Booth ${b.boothNumber} - ${b.companyName || b.status}`}
              style={{
                left: `${Math.max(2, Math.min(174, bx))}px`,
                top: `${Math.max(2, Math.min(114, bz))}px`,
                width: isSelected ? '8px' : '4px',
                height: isSelected ? '8px' : '4px',
                backgroundColor: isSelected ? (isNeon ? '#39ff14' : '#075e54') : color,
                border: isSelected ? '1px solid #ffffff' : 'none',
                boxShadow: isSelected ? `0 0 6px ${isNeon ? '#00ff88' : '#128c7e'}` : 'none',
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 5 : 2
              }}
            />
          );
        })}

        {/* User Location Radar Pin */}
        {userLocation && (
          <div
            className="position-absolute rounded-circle border border-white"
            style={{
              left: `${mapX(userLocation.x)}px`,
              top: `${mapZ(userLocation.z)}px`,
              width: '8px',
              height: '8px',
              backgroundColor: isNeon ? '#00ff88' : '#25d366',
              transform: 'translate(-50%, -50%)',
              boxShadow: isNeon ? '0 0 8px #00ff88' : '0 0 8px #25d366',
              zIndex: 10
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MiniMap;
