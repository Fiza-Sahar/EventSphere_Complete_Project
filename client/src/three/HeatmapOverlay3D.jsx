import React from 'react';

const HeatmapOverlay3D = ({ booths = [], visible = false }) => {
  if (!visible) return null;

  return (
    <group position={[0, 0.03, 0]}>
      {booths.map((b) => {
        const score = b.trafficScore || (b.status === 'OCCUPIED' ? 85 : b.status === 'RESERVED' ? 55 : 20);
        let heatColor = '#10b981'; // low
        let opacity = 0.25;

        if (score > 70) {
          heatColor = '#ef4444'; // high
          opacity = 0.55;
        } else if (score > 40) {
          heatColor = '#f59e0b'; // medium
          opacity = 0.4;
        }

        return (
          <mesh 
            key={b._id || b.boothNumber} 
            position={[b.position?.x || 0, 0, b.position?.z || 0]} 
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <circleGeometry args={[4.5, 24]} />
            <meshBasicMaterial color={heatColor} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
};

export default HeatmapOverlay3D;
