import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const RunwayLaserLights = ({ isNeon = true }) => {
  const laserRef1 = useRef();
  const laserRef2 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (laserRef1.current) {
      laserRef1.current.material.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.5;
    }
    if (laserRef2.current) {
      laserRef2.current.material.emissiveIntensity = 1.2 + Math.cos(t * 3) * 0.5;
    }
  });

  const laserColor = isNeon ? '#00ff88' : '#25d366';
  const cyanColor = isNeon ? '#00f2fe' : '#0284c7';

  return (
    <group>
      {/* 🌟 1. Central Boulevard Laser Runway Strips on Floor */}
      <mesh ref={laserRef1} position={[-3, 0.08, 0]}>
        <boxGeometry args={[0.2, 0.05, 84]} />
        <meshStandardMaterial 
          color={laserColor} 
          emissive={laserColor} 
          emissiveIntensity={1.5} 
        />
      </mesh>

      <mesh ref={laserRef2} position={[3, 0.08, 0]}>
        <boxGeometry args={[0.2, 0.05, 84]} />
        <meshStandardMaterial 
          color={laserColor} 
          emissive={laserColor} 
          emissiveIntensity={1.5} 
        />
      </mesh>

      {/* Cross Sector Laser Lines */}
      {[-24, 0, 24].map((cz, idx) => (
        <mesh key={idx} position={[0, 0.07, cz]}>
          <boxGeometry args={[96, 0.04, 0.18]} />
          <meshStandardMaterial 
            color={cyanColor} 
            emissive={cyanColor} 
            emissiveIntensity={1.2} 
          />
        </mesh>
      ))}

      {/* 🌟 2. Industrial Overhead Lighting Truss Grid */}
      <group position={[0, 22, 0]}>
        {/* Longitudinal Heavy Steel Beams */}
        {[-30, 0, 30].map((bx, idx) => (
          <mesh key={idx} position={[bx, 0, 0]}>
            <boxGeometry args={[1.2, 1.2, 90]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}

        {/* Transverse Cross Beams with Neon Light Tubes */}
        {[-36, -18, 0, 18, 36].map((tz, idx) => (
          <group key={idx} position={[0, 0, tz]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[72, 1, 1]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            {/* Hanging Neon Light Tube */}
            <mesh position={[0, -0.8, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 64, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial 
                color={idx % 2 === 0 ? laserColor : cyanColor} 
                emissive={idx % 2 === 0 ? laserColor : cyanColor} 
                emissiveIntensity={isNeon ? 2 : 1} 
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export default RunwayLaserLights;
