import React, { useState } from 'react';
import { Text } from '@react-three/drei';

const FacilityMarker3D = ({ facility, visible, isEmergency, onClick }) => {
  const [hovered, setHovered] = useState(false);

  if (!visible) return null;

  const { name, type, position, locationName } = facility;
  const posX = position?.x || 0;
  const posY = position?.y || 0;
  const posZ = position?.z || 0;

  const getColors = (type) => {
    switch (type) {
      case 'Food & Cafes':
        return { color: '#f59e0b', icon: '🍔' };
      case 'Restrooms':
        return { color: '#3b82f6', icon: '🚻' };
      case 'Stages':
        return { color: '#06b6d4', icon: '🎤' };
      case 'Meeting Rooms':
        return { color: '#8b5cf6', icon: '💼' };
      case 'VIP Areas':
        return { color: '#ec4899', icon: '👑' };
      case 'Emergency Exits':
        return { color: '#ef4444', icon: '🚨' };
      case 'Charging Stations':
        return { color: '#10b981', icon: '⚡' };
      case 'Medical':
        return { color: '#f43f5e', icon: '🏥' };
      case 'Parking':
        return { color: '#6366f1', icon: '🅿️' };
      case 'Information Desks':
        return { color: '#14b8a6', icon: 'ℹ️' };
      case 'Stairs & Elevators':
        return { color: '#a855f7', icon: '🛗' };
      default:
        return { color: '#38bdf8', icon: '📍' };
    }
  };

  const { color, icon } = getColors(type);
  const isEmergencyExit = type === 'Emergency Exits';
  const shouldPulse = isEmergency && isEmergencyExit;

  return (
    <group 
      position={[posX, posY, posZ]}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(facility);
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
      {/* Base Floor Marker Disc */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 32]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={shouldPulse ? 0.8 : hovered ? 0.5 : 0.25} 
          roughness={0.2} 
        />
      </mesh>

      {/* Glowing Outer Wireframe Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.6, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Floating 3D Pylon Beacon Pin */}
      <group position={[0, 2.2, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 3.5, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={shouldPulse ? 2 : 0.6} />
        </mesh>

        {/* Top Floating Badge Orb */}
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color} 
            emissiveIntensity={hovered || shouldPulse ? 1.5 : 0.7} 
          />
        </mesh>

        {/* 3D Floating Facility Label */}
        <Text
          position={[0, 2.8, 0]}
          fontSize={0.55}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#070a13"
        >
          {`${icon} ${name}`}
        </Text>
      </group>
    </group>
  );
};

export default FacilityMarker3D;
