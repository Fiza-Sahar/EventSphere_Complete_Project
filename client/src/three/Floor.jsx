import React from 'react';
import { Text } from '@react-three/drei';

const Floor = ({ isNeon = true }) => {
  // Theme floor colors
  const floorBaseColor = isNeon ? '#060d09' : '#ffffff';
  const gridPrimary = isNeon ? '#00ff88' : '#128c7e';
  const gridSecondary = isNeon ? '#0d2417' : '#e2e8f0';
  const wallColor = isNeon ? '#0a1610' : '#f8fafc';
  const wallGlowColor = isNeon ? '#00ff88' : '#25d366';

  return (
    <group>
      {/* Polished Main Epoxy / Marble Floor Surface */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[130, 110]} />
        <meshStandardMaterial 
          color={floorBaseColor} 
          roughness={isNeon ? 0.25 : 0.15} 
          metalness={isNeon ? 0.7 : 0.05} 
        />
      </mesh>

      {/* Subtle Hall Coordinate Grid Lines */}
      <gridHelper args={[130, 65, gridPrimary, gridSecondary]} position={[0, 0.01, 0]} />

      {/* Perimeter Boundary Walls */}
      {/* South Wall */}
      <mesh receiveShadow position={[0, 4, 55]}>
        <boxGeometry args={[130, 8, 1]} />
        <meshStandardMaterial color={wallColor} roughness={0.4} metalness={isNeon ? 0.4 : 0.1} />
      </mesh>
      {/* North Wall */}
      <mesh receiveShadow position={[0, 4, -55]}>
        <boxGeometry args={[130, 8, 1]} />
        <meshStandardMaterial color={wallColor} roughness={0.4} metalness={isNeon ? 0.4 : 0.1} />
      </mesh>
      {/* West Wall */}
      <mesh receiveShadow position={[-65, 4, 0]}>
        <boxGeometry args={[1, 8, 110]} />
        <meshStandardMaterial color={wallColor} roughness={0.4} metalness={isNeon ? 0.4 : 0.1} />
      </mesh>
      {/* East Wall */}
      <mesh receiveShadow position={[65, 4, 0]}>
        <boxGeometry args={[1, 8, 110]} />
        <meshStandardMaterial color={wallColor} roughness={0.4} metalness={isNeon ? 0.4 : 0.1} />
      </mesh>

      {/* Glowing Baseline Wall Accents */}
      <mesh position={[0, 0.2, 54.4]}>
        <boxGeometry args={[130, 0.15, 0.1]} />
        <meshStandardMaterial color={wallGlowColor} emissive={wallGlowColor} emissiveIntensity={isNeon ? 1.2 : 0.7} />
      </mesh>
      <mesh position={[0, 0.2, -54.4]}>
        <boxGeometry args={[130, 0.15, 0.1]} />
        <meshStandardMaterial color={wallGlowColor} emissive={wallGlowColor} emissiveIntensity={isNeon ? 1.2 : 0.7} />
      </mesh>

      {/* ================= DESIGNATED ZONE MARKERS ================= */}

      {/* 1. AI INNOVATION DEMO ARENA (North West) */}
      <group position={[-42, 0, -22]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[26, 22]} />
          <meshStandardMaterial color={isNeon ? '#00ff88' : '#128c7e'} transparent opacity={0.18} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[26.1, 0.04, 22.1]} />
          <meshBasicMaterial color={isNeon ? '#00ff88' : '#128c7e'} wireframe={true} />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={1.1} color={isNeon ? '#86efac' : '#075e54'} rotation={[-Math.PI / 4, 0, 0]}>
          🚀 AI & TECH INNOVATION ARENA
        </Text>
      </group>

      {/* 2. FOOD COURT & EXECUTIVE CAFE (North East) */}
      <group position={[42, 0, -22]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[26, 22]} />
          <meshStandardMaterial color="#f59e0b" transparent opacity={0.18} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[26.1, 0.04, 22.1]} />
          <meshBasicMaterial color="#fbbf24" wireframe={true} />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={1.1} color="#d97706" rotation={[-Math.PI / 4, 0, 0]}>
          ☕ EXECUTIVE LOUNGE & CAFE
        </Text>
      </group>

      {/* 3. VIP NETWORKING HUB (South West) */}
      <group position={[-40, 0, 24]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[28, 22]} />
          <meshStandardMaterial color={isNeon ? '#00f2fe' : '#25d366'} transparent opacity={0.18} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[28.1, 0.04, 22.1]} />
          <meshBasicMaterial color={isNeon ? '#38bdf8' : '#25d366'} wireframe={true} />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={1.1} color={isNeon ? '#a5f3fc' : '#128c7e'} rotation={[-Math.PI / 4, 0, 0]}>
          💎 VIP B2B NETWORKING SUITE
        </Text>
      </group>

      {/* 4. WORKSHOP & BREAKOUT ROOMS (South East) */}
      <group position={[40, 0, 24]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[28, 22]} />
          <meshStandardMaterial color={isNeon ? '#10b981' : '#0284c7'} transparent opacity={0.18} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[28.1, 0.04, 22.1]} />
          <meshBasicMaterial color={isNeon ? '#34d399' : '#0284c7'} wireframe={true} />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={1.1} color={isNeon ? '#6ee7b7' : '#0284c7'} rotation={[-Math.PI / 4, 0, 0]}>
          💡 WORKSHOP & BREAKOUT ROOMS
        </Text>
      </group>

      {/* 5. INFORMATION & DELEGATE HELP DESK (South Center) */}
      <group position={[0, 0, 36]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <planeGeometry args={[22, 10]} />
          <meshStandardMaterial color={isNeon ? '#00ff88' : '#128c7e'} transparent opacity={0.22} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <boxGeometry args={[22.1, 0.04, 10.1]} />
          <meshBasicMaterial color={isNeon ? '#00ff88' : '#128c7e'} wireframe={true} />
        </mesh>
        <Text position={[0, 2, 0]} fontSize={0.9} color={isNeon ? '#00ff88' : '#128c7e'} rotation={[-Math.PI / 4, 0, 0]}>
          ℹ️ DELEGATE REGISTRATION & INFO
        </Text>
      </group>
    </group>
  );
};

export default Floor;
