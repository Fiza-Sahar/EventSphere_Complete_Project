import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Stage = ({ position = [0, 0, -38], isNeon = true }) => {
  const screenRef = useRef();

  useFrame(({ clock }) => {
    if (screenRef.current) {
      const t = clock.getElapsedTime();
      screenRef.current.material.emissiveIntensity = 0.8 + Math.sin(t * 1.5) * 0.2;
    }
  });

  const baseColor = isNeon ? '#0f172a' : '#ffffff';
  const stageFloorColor = isNeon ? '#0a1a12' : '#f0fdf4';
  const neonEdgeColor = isNeon ? '#00d66f' : '#128c7e';
  const screenColor = isNeon ? '#00d66f' : '#075e54';
  const screenEmissive = isNeon ? '#059669' : '#128c7e';
  const spotLightColor = isNeon ? '#00d66f' : '#25d366';

  return (
    <group position={position}>
      {/* Lower Platform Base Step */}
      <mesh receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[36, 0.8, 16]} />
        <meshStandardMaterial color={baseColor} roughness={0.5} metalness={isNeon ? 0.4 : 0.1} />
      </mesh>

      {/* Main Elevated Stage Floor */}
      <mesh receiveShadow castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[32, 0.8, 13]} />
        <meshStandardMaterial color={stageFloorColor} roughness={0.2} metalness={isNeon ? 0.7 : 0.1} />
      </mesh>

      {/* Perimeter Stage Neon Edge */}
      <mesh position={[0, 1.62, 0]}>
        <boxGeometry args={[32.1, 0.04, 13.1]} />
        <meshStandardMaterial color={neonEdgeColor} emissive={neonEdgeColor} emissiveIntensity={isNeon ? 1.4 : 0.8} />
      </mesh>

      {/* Front Access Steps */}
      <mesh position={[0, 0.4, 7]}>
        <boxGeometry args={[10, 0.4, 2]} />
        <meshStandardMaterial color={isNeon ? '#1e293b' : '#e2e8f0'} />
      </mesh>
      <mesh position={[0, 0.8, 6.2]}>
        <boxGeometry args={[10, 0.4, 1.5]} />
        <meshStandardMaterial color={isNeon ? '#1e293b' : '#e2e8f0'} />
      </mesh>

      {/* Grand LED Video Screen Backdrop */}
      <mesh ref={screenRef} position={[0, 7.5, -4.5]}>
        <boxGeometry args={[28, 10, 0.6]} />
        <meshStandardMaterial 
          color={screenColor} 
          emissive={screenEmissive} 
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>

      {/* Screen Frame Border */}
      <mesh position={[0, 7.5, -4.8]}>
        <boxGeometry args={[28.6, 10.6, 0.3]} />
        <meshStandardMaterial color={isNeon ? '#0f172a' : '#111b21'} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Screen Top Header Bar */}
      <mesh position={[0, 13, -4.5]}>
        <boxGeometry args={[28, 0.4, 0.8]} />
        <meshStandardMaterial color={neonEdgeColor} emissive={neonEdgeColor} emissiveIntensity={isNeon ? 1.5 : 0.9} />
      </mesh>

      {/* Stage Screen Typography */}
      <Text
        position={[0, 9, -4.1]}
        fontSize={1.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        EVENTSPHERE ARENA
      </Text>

      <Text
        position={[0, 6.8, -4.1]}
        fontSize={0.7}
        color={isNeon ? '#9ae6b4' : '#dcfce7'}
        anchorX="center"
        anchorY="middle"
      >
        GLOBAL INNOVATION & AI KEYNOTE STAGE
      </Text>

      <Text
        position={[0, 5.2, -4.1]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        LIVE BROADCAST • 4K STREAMING WORLDWIDE
      </Text>

      {/* Modern Glass Podium Desk */}
      <group position={[0, 2.4, 2]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 1.6, 0.9]} />
          <meshStandardMaterial color={isNeon ? '#0f172a' : '#ffffff'} metalness={isNeon ? 0.8 : 0.1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.46]}>
          <boxGeometry args={[1.4, 1.4, 0.05]} />
          <meshStandardMaterial color={neonEdgeColor} emissive={neonEdgeColor} emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.8, 0.08, 1]} />
          <meshStandardMaterial color={neonEdgeColor} roughness={0.1} metalness={0.9} />
        </mesh>
      </group>

      {/* Left Heavy Stage Truss Column */}
      <group position={[-16, 7.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 14, 1.2]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
        </mesh>
        <pointLight position={[1, 5, 2]} intensity={2} color={spotLightColor} distance={18} />
      </group>

      {/* Right Heavy Stage Truss Column */}
      <group position={[16, 7.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 14, 1.2]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.3} />
        </mesh>
        <pointLight position={[-1, 5, 2]} intensity={2} color={spotLightColor} distance={18} />
      </group>

      {/* Overhead Lighting Truss Rig */}
      <mesh position={[0, 14.5, 0]}>
        <boxGeometry args={[33.2, 0.8, 1.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* 🌟 VIP AUDIENCE SEATING ROWS IN FRONT OF STAGE */}
      <group position={[0, 0, 14]}>
        {[-10, -6, -2, 2, 6, 10].map((chairX, idx) => (
          <group key={idx} position={[chairX, 0, 0]}>
            {/* VIP Chair Cushion */}
            <mesh castShadow position={[0, 0.4, 0]}>
              <boxGeometry args={[0.7, 0.15, 0.7]} />
              <meshStandardMaterial color={isNeon ? '#064e3b' : '#075e54'} roughness={0.3} />
            </mesh>
            {/* VIP Chair Backrest */}
            <mesh position={[0, 0.8, -0.3]}>
              <boxGeometry args={[0.7, 0.65, 0.1]} />
              <meshStandardMaterial color={isNeon ? '#064e3b' : '#075e54'} roughness={0.3} />
            </mesh>
            {/* VIP Chair Metallic Legs */}
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 6]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

export default Stage;
