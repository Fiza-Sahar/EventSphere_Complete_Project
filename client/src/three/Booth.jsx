import React, { useState, useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Booth = ({ booth, isSelected, isDimmed = false, isNeon = true, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const beaconRef = useRef();
  const productRef = useRef();

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return isNeon ? '#00d66f' : '#25d366'; // Green
      case 'RESERVED':
        return '#f59e0b'; // Amber / Yellow
      case 'OCCUPIED':
        return isNeon ? '#06b6d4' : '#128c7e'; // Blue / Teal
      case 'MAINTENANCE':
        return '#ef4444'; // Red
      case 'UNAVAILABLE':
      default:
        return '#6b7280'; // Gray
    }
  };

  const statusColor = useMemo(() => getStatusColor(booth.status), [booth.status, isNeon]);
  const posX = booth.position?.x || 0;
  const posY = booth.position?.y || 0;
  const posZ = booth.position?.z || 0;
  const width = booth.size?.width || 5;
  const height = booth.size?.height || 3.4;
  const depth = booth.size?.depth || 4.5;

  const activeGlow = (hovered || isSelected) && !isDimmed;

  // Frame animations: Beacon pulse + rotating 3D product showcase artifact
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (beaconRef.current && booth.status === 'AVAILABLE') {
      beaconRef.current.material.emissiveIntensity = 0.5 + Math.sin(t * 3.5) * 0.5;
    }
    if (productRef.current) {
      productRef.current.rotation.y = t * 0.8;
      productRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
  });

  // Theme-aware base colors
  const floorColor = isNeon 
    ? (activeGlow ? '#10281c' : isDimmed ? '#040705' : '#0a140f')
    : (activeGlow ? '#dcfce7' : isDimmed ? '#f1f5f9' : '#ffffff');

  const wallColor = isNeon
    ? (activeGlow ? '#082518' : isDimmed ? '#060a08' : '#0d1a14')
    : (activeGlow ? '#f0fdf4' : isDimmed ? '#f8fafc' : '#f1f5f9');

  const textColor = isNeon ? '#ffffff' : '#111b21';
  const subtextColor = isNeon ? '#9ae6b4' : '#54656f';

  return (
    <group 
      position={[posX, activeGlow ? posY + 0.15 : posY, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        onClick(booth);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
    >
      {/* 1. Floor Base Carpet */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[width, 0.1, depth]} />
        <meshStandardMaterial 
          color={floorColor} 
          roughness={0.4}
          metalness={isNeon ? 0.3 : 0.1}
          transparent={isDimmed}
          opacity={isDimmed ? 0.35 : 1}
        />
      </mesh>

      {/* 2. Perimeter Floor Neon Wireframe */}
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[width + 0.08, 0.02, depth + 0.08]} />
        <meshBasicMaterial 
          color={activeGlow ? (isNeon ? '#00d66f' : '#25d366') : statusColor} 
          wireframe={true} 
          transparent={isDimmed}
          opacity={isDimmed ? 0.2 : 1}
        />
      </mesh>

      {/* 3. Main Back Wall Panel */}
      <mesh castShadow receiveShadow position={[0, height / 2, -depth / 2 + 0.15]}>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial 
          color={wallColor} 
          roughness={0.3} 
          metalness={isNeon ? 0.4 : 0.1} 
          transparent={isDimmed}
          opacity={isDimmed ? 0.35 : 1}
        />
      </mesh>

      {/* 4. Back Wall Glowing Frame */}
      <mesh position={[0, height / 2, -depth / 2 + 0.26]}>
        <boxGeometry args={[width - 0.4, height - 0.4, 0.02]} />
        <meshStandardMaterial 
          color={statusColor}
          emissive={statusColor}
          emissiveIntensity={isDimmed ? 0.1 : activeGlow ? 1.4 : 0.5}
          roughness={0.2}
          transparent={isDimmed}
          opacity={isDimmed ? 0.2 : 1}
        />
      </mesh>

      {/* 5. Left & Right Wing Dividers */}
      <mesh castShadow position={[-width / 2 + 0.1, height / 3, 0]}>
        <boxGeometry args={[0.12, (height * 2) / 3, depth * 0.65]} />
        <meshStandardMaterial 
          color={isNeon ? '#12231a' : '#e2e8f0'} 
          roughness={0.5} 
          transparent={isDimmed} 
          opacity={isDimmed ? 0.3 : 1} 
        />
      </mesh>
      <mesh castShadow position={[width / 2 - 0.1, height / 3, 0]}>
        <boxGeometry args={[0.12, (height * 2) / 3, depth * 0.65]} />
        <meshStandardMaterial 
          color={isNeon ? '#12231a' : '#e2e8f0'} 
          roughness={0.5} 
          transparent={isDimmed} 
          opacity={isDimmed ? 0.3 : 1} 
        />
      </mesh>

      {/* 6. Overhead Cantilever Canopy */}
      <mesh castShadow position={[0, height + 0.05, 0]}>
        <boxGeometry args={[width + 0.2, 0.12, depth * 0.6]} />
        <meshStandardMaterial 
          color={isNeon ? '#0a1711' : '#f8fafc'} 
          metalness={isNeon ? 0.8 : 0.2} 
          roughness={0.2} 
          transparent={isDimmed} 
          opacity={isDimmed ? 0.3 : 1} 
        />
      </mesh>

      {/* 7. Top Billboard Header Plate */}
      <mesh position={[0, height + 0.55, depth * 0.15]}>
        <boxGeometry args={[width * 0.85, 0.65, 0.15]} />
        <meshStandardMaterial 
          color={isNeon ? '#050f0a' : '#075e54'} 
          roughness={0.2} 
          metalness={isNeon ? 0.6 : 0.2} 
          transparent={isDimmed} 
          opacity={isDimmed ? 0.3 : 1} 
        />
      </mesh>

      {/* Top Header Glow Strip */}
      <mesh position={[0, height + 0.88, depth * 0.15]}>
        <boxGeometry args={[width * 0.85, 0.03, 0.18]} />
        <meshStandardMaterial 
          color={statusColor} 
          emissive={statusColor} 
          emissiveIntensity={isDimmed ? 0.1 : 1.5} 
        />
      </mesh>

      {/* Status Beacon Orb */}
      <mesh ref={beaconRef} position={[width * 0.42, height + 0.55, depth * 0.15 + 0.1]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshStandardMaterial 
          color={statusColor} 
          emissive={statusColor} 
          emissiveIntensity={isDimmed ? 0.1 : 1.2} 
        />
      </mesh>

      {/* Booth Number Text */}
      {!isDimmed && (
        <Text
          position={[-width * 0.25, height + 0.55, depth * 0.15 + 0.1]}
          fontSize={0.34}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {booth.boothNumber}
        </Text>
      )}

      {/* Company Name on Backwall */}
      {!isDimmed && (
        <>
          <Text
            position={[0, height * 0.62, -depth / 2 + 0.28]}
            fontSize={0.36}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            maxWidth={width - 0.8}
          >
            {booth.companyName || 'AVAILABLE'}
          </Text>

          <Text
            position={[0, height * 0.42, -depth / 2 + 0.28]}
            fontSize={0.22}
            color={subtextColor}
            anchorX="center"
            anchorY="middle"
          >
            {booth.category || 'Click to Inspect'}
          </Text>
        </>
      )}

      {/* 🌟 8. 3D PRODUCT SHOWCASE PEDESTAL WITH SPINNING CRYSTAL ARTIFACT */}
      {!isDimmed && (
        <group position={[width * 0.28, 0, -depth * 0.1]}>
          {/* Glass Pedestal Cylinder */}
          <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.32, 0.36, 0.9, 16]} />
            <meshStandardMaterial 
              color={isNeon ? '#0f241a' : '#ffffff'} 
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
          <mesh position={[0, 0.91, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.02, 16]} />
            <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={1.2} />
          </mesh>
          {/* Floating Spinning 3D Crystal Artifact */}
          <mesh ref={productRef} position={[0, 1.25, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial 
              color={isNeon ? '#00d66f' : '#06b6d4'} 
              emissive={isNeon ? '#00d66f' : '#06b6d4'} 
              emissiveIntensity={1.5} 
              roughness={0.1} 
              metalness={0.9} 
            />
          </mesh>
        </group>
      )}

      {/* 🌟 9. 3D CONVENTION CHAIRS & DISCUSSION TABLE */}
      {!isDimmed && (
        <group position={[-width * 0.28, 0, -depth * 0.08]}>
          {/* Circular Glass Table */}
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
            <meshStandardMaterial color="#0284c7" transparent opacity={0.5} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          {/* 2 Modern Barstools */}
          {[-0.38, 0.38].map((chairZ, ci) => (
            <group key={ci} position={[0, 0, chairZ]}>
              <mesh position={[0, 0.32, 0]}>
                <cylinderGeometry args={[0.18, 0.18, 0.06, 12]} />
                <meshStandardMaterial color={isNeon ? '#00d66f' : '#128c7e'} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.16, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 0.32, 6]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* 10. Front Reception Counter with Neon Status Strip */}
      <group position={[0, 0, depth * 0.25]}>
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <boxGeometry args={[width * 0.48, 0.9, 0.7]} />
          <meshStandardMaterial 
            color={isNeon ? '#0f241a' : '#ffffff'} 
            metalness={isNeon ? 0.4 : 0.1} 
            roughness={0.3} 
            transparent={isDimmed} 
            opacity={isDimmed ? 0.3 : 1} 
          />
        </mesh>
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[width * 0.5, 0.04, 0.74]} />
          <meshStandardMaterial 
            color={activeGlow ? (isNeon ? '#00d66f' : '#25d366') : (isNeon ? '#1a3a2a' : '#e2e8f0')} 
            roughness={0.1} 
            metalness={isNeon ? 0.8 : 0.2} 
          />
        </mesh>
        <mesh position={[0, 0.45, 0.36]}>
          <boxGeometry args={[width * 0.44, 0.06, 0.02]} />
          <meshStandardMaterial 
            color={statusColor} 
            emissive={statusColor} 
            emissiveIntensity={isDimmed ? 0.1 : activeGlow ? 1.5 : 0.7} 
          />
        </mesh>
      </group>

      {/* Selected Overhead Spotlight */}
      {isSelected && (
        <pointLight 
          position={[0, height + 4, 0]} 
          intensity={4} 
          distance={20} 
          color={isNeon ? '#00d66f' : '#25d366'} 
        />
      )}
    </group>
  );
};

export default Booth;
