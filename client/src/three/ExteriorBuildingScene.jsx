import React, { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ExteriorBuildingScene = ({ isNeon = true, onEnterInterior }) => {
  const fountainRef = useRef();
  const rotorRef = useRef();
  const shuttleRef = useRef();
  const beaconTowerRef = useRef();

  // Optimized continuous animation loop without any garbage collection allocations
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Dual-Tier Water Fountain Animation
    if (fountainRef.current) {
      fountainRef.current.material.opacity = 0.65 + Math.sin(t * 3.5) * 0.15;
    }

    // 2. VIP Rooftop Helicopter Rotor Spinning
    if (rotorRef.current) {
      rotorRef.current.rotation.y = t * 18;
    }

    // 3. Autonomous Executive Electric Shuttle driving along the boulevard loop
    if (shuttleRef.current) {
      const shuttleAngle = t * 0.35;
      shuttleRef.current.position.x = Math.sin(shuttleAngle) * 75;
      shuttleRef.current.position.z = 55 + Math.cos(shuttleAngle) * 6;
      shuttleRef.current.rotation.y = Math.cos(shuttleAngle) >= 0 ? Math.PI / 2 : -Math.PI / 2;
    }

    // 4. Skyscraper Beacon Strobe
    if (beaconTowerRef.current) {
      beaconTowerRef.current.material.emissiveIntensity = 0.8 + Math.sin(t * 4) * 0.7;
    }
  });

  const buildingGlassColor = isNeon ? '#00d66f' : '#0284c7';
  const facadeBaseColor = isNeon ? '#09150f' : '#ffffff';
  const towerGlassColor = isNeon ? '#06b6d4' : '#0369a1';
  const asphaltColor = isNeon ? '#050a08' : '#1e293b';
  const lineGlowColor = isNeon ? '#00d66f' : '#25d366';
  const carColors = isNeon ? ['#00d66f', '#06b6d4', '#f59e0b', '#ffffff', '#ef4444', '#a855f7'] : ['#128c7e', '#25d366', '#3b82f6', '#111827', '#ffffff', '#64748b'];

  return (
    <group>
      {/* ================= 1. GROUND PLAZA & BOULEVARD NETWORK ================= */}
      {/* Main Ground Plaza Surface with Grid Tiles */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[260, 210]} />
        <meshStandardMaterial color={isNeon ? '#040705' : '#f1f5f9'} roughness={0.7} />
      </mesh>

      {/* Main Multi-Lane Boulevard Road */}
      <mesh receiveShadow position={[0, 0.01, 56]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[240, 28]} />
        <meshStandardMaterial color={asphaltColor} roughness={0.85} />
      </mesh>

      {/* Road Center Dividing Dashes */}
      {[-90, -60, -30, 0, 30, 60, 90].map((rx, idx) => (
        <mesh key={idx} position={[rx, 0.03, 56]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[16, 0.8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      ))}

      {/* Pedestrian Zebra Crossings at Entrance Plaza */}
      {[-24, -20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24].map((zx, idx) => (
        <mesh key={idx} position={[zx, 0.035, 43]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.2, 5.5]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* Autonomous Electric Shuttle Bus moving along boulevard */}
      <group ref={shuttleRef} position={[0, 1.2, 56]}>
        {/* Shuttle Body */}
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[4.8, 2.2, 2.4]} />
          <meshStandardMaterial color={isNeon ? '#00d66f' : '#ffffff'} metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Panoramic Glass Tint Screen */}
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[4.9, 1.2, 2.42]} />
          <meshStandardMaterial color="#00f2fe" transparent opacity={0.6} />
        </mesh>
        {/* Glowing Headlights */}
        <mesh position={[2.45, 0.3, 0.6]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
        </mesh>
        <mesh position={[2.45, 0.3, -0.6]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
        </mesh>
        <Text position={[0, 1.8, 0]} fontSize={0.5} color={isNeon ? '#00ff88' : '#128c7e'}>
          ⚡ 5G AUTONOMOUS VIP SHUTTLE
        </Text>
      </group>

      {/* ================= 2. GRAND ARCHITECTURAL CONVENTION BUILDING ================= */}
      <group position={[0, 0, -20]}>
        {/* Main 4-Story Glass Exhibition Podium Base */}
        <mesh castShadow receiveShadow position={[0, 16, 0]}>
          <boxGeometry args={[124, 32, 64]} />
          <meshStandardMaterial 
            color={facadeBaseColor} 
            metalness={isNeon ? 0.7 : 0.2} 
            roughness={0.2} 
          />
        </mesh>

        {/* Curved Tinted Glass Facade Front Screen */}
        <mesh position={[0, 16, 32.3]}>
          <boxGeometry args={[120, 30, 0.6]} />
          <meshStandardMaterial 
            color={buildingGlassColor} 
            emissive={buildingGlassColor}
            emissiveIntensity={isNeon ? 0.45 : 0.15}
            transparent 
            opacity={0.4} 
            metalness={0.9} 
            roughness={0.08} 
          />
        </mesh>

        {/* Modern Architectural Vertical Rib Lines */}
        {[-52, -32, -12, 12, 32, 52].map((ribX, i) => (
          <mesh key={i} position={[ribX, 16, 32.9]}>
            <boxGeometry args={[1.6, 32.2, 0.8]} />
            <meshStandardMaterial 
              color={lineGlowColor} 
              emissive={lineGlowColor} 
              emissiveIntensity={isNeon ? 1.4 : 0.7} 
            />
          </mesh>
        ))}

        {/* Left Innovation Skyscraper Tower (East Wing) */}
        <group position={[-68, 30, -5]}>
          <mesh castShadow receiveShadow position={[0, 0, 0]}>
            <boxGeometry args={[32, 60, 44]} />
            <meshStandardMaterial color={isNeon ? '#07160e' : '#f8fafc'} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 22.2]}>
            <boxGeometry args={[28, 56, 0.4]} />
            <meshStandardMaterial color={towerGlassColor} emissive={towerGlassColor} emissiveIntensity={isNeon ? 0.5 : 0.2} transparent opacity={0.5} />
          </mesh>
          {/* Tower Top Communications Spire */}
          <mesh position={[0, 36, 0]}>
            <cylinderGeometry args={[0.2, 1.2, 16, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          <mesh ref={beaconTowerRef} position={[0, 44, 0]}>
            <sphereGeometry args={[0.8, 12, 12]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
          </mesh>
          <Text position={[0, 25, 23]} fontSize={1.6} color="#ffffff">
            INNOVATION TOWER A
          </Text>
        </group>

        {/* Floating Glass Architectural Skybridge connecting Tower to Main Arena */}
        <group position={[-44, 22, -5]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[18, 5, 8]} />
            <meshStandardMaterial color="#0284c7" transparent opacity={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, -2.6, 0]}>
            <boxGeometry args={[18.2, 0.3, 8.2]} />
            <meshStandardMaterial color={lineGlowColor} emissive={lineGlowColor} emissiveIntensity={1.2} />
          </mesh>
        </group>

        {/* Grand Cantilever Entrance Canopy */}
        <group position={[0, 6, 40]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[42, 1.4, 18]} />
            <meshStandardMaterial color={isNeon ? '#06140c' : '#075e54'} metalness={0.8} />
          </mesh>
          <mesh position={[0, -0.7, 0]}>
            <boxGeometry args={[41.8, 0.1, 17.8]} />
            <meshStandardMaterial color={lineGlowColor} emissive={lineGlowColor} emissiveIntensity={1.8} />
          </mesh>
          {/* Glass Automatic Entry Doors */}
          <mesh position={[0, -3.2, -8.5]}>
            <boxGeometry args={[24, 5.4, 0.2]} />
            <meshStandardMaterial color="#00ffff" transparent opacity={0.4} />
          </mesh>

          {/* Interactive Enter Indoor Floor Hotspot Trigger */}
          <group 
            position={[0, 3.2, 4]} 
            onClick={(e) => {
              e.stopPropagation();
              if (onEnterInterior) onEnterInterior();
            }}
          >
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[26, 2.2, 0.4]} />
              <meshStandardMaterial 
                color={isNeon ? '#00d66f' : '#128c7e'} 
                emissive={isNeon ? '#00d66f' : '#128c7e'} 
                emissiveIntensity={1.2} 
              />
            </mesh>
            <Text position={[0, 0, 0.3]} fontSize={1.1} color="#050d08" fontWeight="bold">
              👉 CLICK TO ENTER 3D EXHIBITION FLOOR
            </Text>
          </group>
        </group>

        {/* Rooftop Penthouse & VIP Skyline Pavilion */}
        <mesh castShadow position={[0, 36, -5]}>
          <boxGeometry args={[74, 8, 44]} />
          <meshStandardMaterial color={facadeBaseColor} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Rooftop VIP Helipad with Executive Helicopter Model */}
        <group position={[-22, 40.2, -5]}>
          {/* Landing Pad Disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[11, 32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[10.5, 11, 32]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <Text position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={7} color="#ffffff">
            H
          </Text>

          {/* 🚁 3D Executive VIP Helicopter */}
          <group position={[0, 1.4, 0]}>
            {/* Helicopter Body */}
            <mesh castShadow position={[0, 0.6, 0]}>
              <boxGeometry args={[3.2, 1.6, 6]} />
              <meshStandardMaterial color={isNeon ? '#091c12' : '#075e54'} metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Helicopter Glass Cockpit */}
            <mesh position={[0, 0.7, 2.2]}>
              <sphereGeometry args={[1.1, 16, 16]} />
              <meshStandardMaterial color="#06b6d4" transparent opacity={0.6} />
            </mesh>
            {/* Tail Boom */}
            <mesh position={[0, 0.9, -4.5]}>
              <cylinderGeometry args={[0.2, 0.35, 4.5, 8]} rotation={[Math.PI / 2, 0, 0]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Tail Fin */}
            <mesh position={[0, 1.6, -6.8]}>
              <boxGeometry args={[0.1, 1.4, 0.8]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
            {/* Spinning Main Rotor Blades */}
            <group ref={rotorRef} position={[0, 1.8, 0]}>
              <mesh>
                <boxGeometry args={[12, 0.08, 0.4]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[12, 0.08, 0.4]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
            </group>
          </group>
        </group>

        {/* 🌟 GRAND ROOFTOP 3D BILLBOARD TYPOGRAPHY */}
        <group position={[0, 43, 14]}>
          <mesh position={[0, 0, -0.5]}>
            <boxGeometry args={[92, 5.5, 0.8]} />
            <meshStandardMaterial color={isNeon ? '#040d08' : '#075e54'} metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.75, -0.4]}>
            <boxGeometry args={[92.2, 0.25, 0.9]} />
            <meshStandardMaterial color={lineGlowColor} emissive={lineGlowColor} emissiveIntensity={2} />
          </mesh>
          <Text
            position={[0, 0.8, 0.2]}
            fontSize={2.4}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            EVENTSPHERE CONVENTION & EXPO CENTER
          </Text>
          <Text
            position={[0, -1.2, 0.2]}
            fontSize={1.15}
            color={isNeon ? '#9ae6b4' : '#dcfce7'}
            anchorX="center"
            anchorY="middle"
          >
            GLOBAL TECHNOLOGY & INNOVATION PAVILION 2026
          </Text>
        </group>
      </group>

      {/* ================= 3. MULTI-LEVEL PARKING PLAZA WITH SOLAR CANOPY ================= */}
      <group position={[74, 0, 15]}>
        {/* Multi-Level Parking Garage Structure */}
        <mesh castShadow receiveShadow position={[0, 7, 0]}>
          <boxGeometry args={[48, 14, 38]} />
          <meshStandardMaterial color={isNeon ? '#07150e' : '#e2e8f0'} roughness={0.4} metalness={0.5} />
        </mesh>
        
        {/* Rooftop Solar Panel Canopies */}
        {[-14, 0, 14].map((sx, idx) => (
          <group key={idx} position={[sx, 15, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[10, 0.2, 32]} />
              <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ))}

        <Text position={[0, 17, 0]} fontSize={1.6} color={lineGlowColor}>
          🅿️ PARKING PLAZA (LEVELS 1-3)
        </Text>
        <Text position={[0, 15, 0]} fontSize={0.85} color="#ffffff">
          450 AVAILABLE BAYS • ⚡ EV SUPERCHARGING ACTIVE
        </Text>

        {/* Barrier Gate */}
        <mesh position={[-18, 1, 20]}>
          <boxGeometry args={[0.8, 2, 0.8]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
        <mesh position={[-14, 1.8, 20]}>
          <boxGeometry args={[7, 0.2, 0.2]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
        </mesh>

        {/* 3D Parked Vehicles & EV Pods */}
        {[-16, -9, -2, 5, 12, 19].map((cx, idx) => (
          <group key={idx} position={[cx, 0.7, 8]}>
            <mesh castShadow position={[0, 0.45, 0]}>
              <boxGeometry args={[2.9, 1.3, 5.4]} />
              <meshStandardMaterial color={carColors[idx % carColors.length]} roughness={0.1} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.95, -0.2]}>
              <boxGeometry args={[2.5, 0.85, 3]} />
              <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* EV Charger Pod */}
            <mesh position={[0, 0.7, -3.4]}>
              <boxGeometry args={[0.7, 1.8, 0.45]} />
              <meshStandardMaterial color={lineGlowColor} emissive={lineGlowColor} emissiveIntensity={1.5} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= 4. PLAZA WATER REFLECTION FOUNTAIN & PALM PROMENADE ================= */}
      <group position={[-64, 0, 20]}>
        {/* Outer Fountain Basin */}
        <mesh receiveShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[16, 17, 0.8, 32]} />
          <meshStandardMaterial color={isNeon ? '#05120a' : '#ffffff'} roughness={0.2} metalness={0.7} />
        </mesh>
        {/* Animated Water Surface */}
        <mesh ref={fountainRef} position={[0, 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[15.5, 32]} />
          <meshStandardMaterial color="#06b6d4" transparent opacity={0.7} roughness={0.05} metalness={0.9} />
        </mesh>
        {/* Tier 2 Raised Fountain Basin */}
        <mesh position={[0, 1.6, 0]}>
          <cylinderGeometry args={[7, 7.5, 0.8, 24]} />
          <meshStandardMaterial color={lineGlowColor} metalness={0.8} />
        </mesh>
        {/* Central Fountain Spout */}
        <mesh position={[0, 3.2, 0]}>
          <cylinderGeometry args={[1, 1.4, 4, 16]} />
          <meshStandardMaterial color={lineGlowColor} emissive={lineGlowColor} emissiveIntensity={1.5} />
        </mesh>
        <pointLight position={[0, 3.5, 0]} intensity={3} color="#06b6d4" distance={30} />
      </group>

      {/* 🌴 3D Landscaping Palm Trees along entrance promenade */}
      {[-50, -30, 30, 50].map((tx, idx) => (
        <group key={idx} position={[tx, 0, 42]}>
          {/* Trunk */}
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.3, 0.45, 7, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Palm Canopy Foliage Orbs */}
          <group position={[0, 7.2, 0]}>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[2.2, 12, 12]} />
              <meshStandardMaterial color={isNeon ? '#00d66f' : '#15803d'} roughness={0.4} />
            </mesh>
            <mesh position={[0, 1.2, 0]}>
              <sphereGeometry args={[1.5, 12, 12]} />
              <meshStandardMaterial color={isNeon ? '#059669' : '#166534'} roughness={0.4} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Modern Illuminated Streetlamps */}
      {[-45, -15, 15, 45].map((lx, idx) => (
        <group key={idx} position={[lx, 0, 41]}>
          <mesh position={[0, 4, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 8, 8]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          <mesh position={[0, 8, 0]}>
            <sphereGeometry args={[0.6, 12, 12]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, 7.8, 0]} intensity={2.2} color={isNeon ? '#00d66f' : '#ffffff'} distance={25} />
        </group>
      ))}
    </group>
  );
};

export default ExteriorBuildingScene;
