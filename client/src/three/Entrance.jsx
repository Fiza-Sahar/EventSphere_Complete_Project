import React from 'react';
import { Text } from '@react-three/drei';

const Entrance = ({ isNeon = true }) => {
  const pylonColor = isNeon ? '#0f172a' : '#ffffff';
  const glowColor = isNeon ? '#00ff88' : '#25d366';
  const headerColor = isNeon ? '#111827' : '#075e54';
  const turnstileColor = isNeon ? '#1e293b' : '#f0fdf4';

  return (
    <group>
      {/* ================= MAIN SOUTH ENTRANCE ARCHWAY ================= */}
      <group position={[0, 0, 48]}>
        {/* Left Architectural Pylon Column */}
        <mesh castShadow position={[-10, 5, 0]}>
          <boxGeometry args={[2.5, 10, 2.5]} />
          <meshStandardMaterial color={pylonColor} metalness={isNeon ? 0.7 : 0.1} roughness={0.3} />
        </mesh>
        <mesh position={[-8.7, 5, 0]}>
          <boxGeometry args={[0.1, 9.6, 2.3]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={isNeon ? 1.4 : 0.8} />
        </mesh>

        {/* Right Architectural Pylon Column */}
        <mesh castShadow position={[10, 5, 0]}>
          <boxGeometry args={[2.5, 10, 2.5]} />
          <meshStandardMaterial color={pylonColor} metalness={isNeon ? 0.7 : 0.1} roughness={0.3} />
        </mesh>
        <mesh position={[8.7, 5, 0]}>
          <boxGeometry args={[0.1, 9.6, 2.3]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={isNeon ? 1.4 : 0.8} />
        </mesh>

        {/* Top Connecting Header Canopy Beam */}
        <mesh castShadow position={[0, 10, 0]}>
          <boxGeometry args={[22.5, 2.2, 3]} />
          <meshStandardMaterial color={headerColor} metalness={isNeon ? 0.8 : 0.2} roughness={0.2} />
        </mesh>

        {/* Top Neon Accent Bar */}
        <mesh position={[0, 11.2, 0]}>
          <boxGeometry args={[22.5, 0.2, 3.1]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={isNeon ? 1.5 : 0.9} />
        </mesh>

        {/* Digital Welcome Display Screen */}
        <mesh position={[0, 10, 1.55]}>
          <boxGeometry args={[16, 1.6, 0.1]} />
          <meshStandardMaterial color={isNeon ? '#064e3b' : '#075e54'} emissive={glowColor} emissiveIntensity={0.6} />
        </mesh>

        <Text
          position={[0, 10, 1.62]}
          fontSize={0.65}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          GLOBAL EXPO • MAIN ENTRANCE & VERIFICATION
        </Text>

        {/* Turnstile Security Gates (Floor Level) */}
        {[-6, -3, 0, 3, 6].map((x, idx) => (
          <group key={idx} position={[x, 0.6, 0]}>
            <mesh castShadow position={[0, 0, 0]}>
              <boxGeometry args={[0.8, 1.2, 1.8]} />
              <meshStandardMaterial color={turnstileColor} metalness={isNeon ? 0.9 : 0.2} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <boxGeometry args={[0.85, 0.05, 1.85]} />
              <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1} />
            </mesh>
          </group>
        ))}

        {/* Entrance Area Glow Light */}
        <pointLight position={[0, 8, 3]} intensity={2.5} distance={20} color={glowColor} />
      </group>

      {/* ================= NORTH EAST EXIT GATE ================= */}
      <group position={[52, 0, -42]}>
        {/* Left Column */}
        <mesh position={[-5, 4, 0]}>
          <boxGeometry args={[1.5, 8, 1.5]} />
          <meshStandardMaterial color={pylonColor} metalness={0.6} />
        </mesh>
        {/* Right Column */}
        <mesh position={[5, 4, 0]}>
          <boxGeometry args={[1.5, 8, 1.5]} />
          <meshStandardMaterial color={pylonColor} metalness={0.6} />
        </mesh>
        {/* Top Header */}
        <mesh position={[0, 8, 0]}>
          <boxGeometry args={[11.5, 1.5, 1.8]} />
          <meshStandardMaterial color={headerColor} metalness={0.8} />
        </mesh>
        <mesh position={[0, 8, 0.95]}>
          <boxGeometry args={[8, 1, 0.1]} />
          <meshStandardMaterial color="#991b1b" emissive="#ef4444" emissiveIntensity={1} />
        </mesh>
        <Text
          position={[0, 8, 1.02]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          EXIT GATE A • TO PARKING & METRO
        </Text>
      </group>
    </group>
  );
};

export default Entrance;
