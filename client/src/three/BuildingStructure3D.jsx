import React from 'react';
import { Text } from '@react-three/drei';

const FLOORS_CONFIG = [
  { level: 0, id: 'floor-0', name: 'GROUND FLOOR', subtitle: 'Main Exhibition Hall & Keynote Arena', y: 0, color: '#10b981' },
  { level: 1, id: 'floor-1', name: '1ST FLOOR', subtitle: 'Innovation Showcase & Robotics Pavilion', y: 16, color: '#06b6d4' },
  { level: 2, id: 'floor-2', name: '2ND FLOOR', subtitle: 'Executive Meeting Suites & Startup Alley', y: 32, color: '#8b5cf6' },
  { level: 3, id: 'floor-vip', name: 'VIP SKY LOUNGE', subtitle: 'Private Investor Suites & Rooftop Terrace', y: 48, color: '#f59e0b' }
];

const BuildingStructure3D = ({ activeFloor = 'floor-0', showAllFloors = false, isNeon = true, onSelectFloor }) => {
  const activeLevel = FLOORS_CONFIG.find(f => f.id === activeFloor)?.level || 0;

  const pillarColor = isNeon ? '#0a1710' : '#ffffff';
  const glassColor = isNeon ? '#00d66f' : '#128c7e';
  const gridLineColor = isNeon ? '#00d66f' : '#10b981';

  return (
    <group>
      {/* 4 Corner Architectural Glass Structural Pylons */}
      {[-64, 64].map((px, i) =>
        [-54, 54].map((pz, j) => (
          <group key={`${i}-${j}`} position={[px, 24, pz]}>
            {/* Structural Steel Core */}
            <mesh castShadow>
              <boxGeometry args={[2.5, 60, 2.5]} />
              <meshStandardMaterial color={pillarColor} metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing Corner Laser Strip */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2.7, 59.8, 2.7]} />
              <meshStandardMaterial 
                color={glassColor} 
                emissive={glassColor} 
                emissiveIntensity={isNeon ? 1.2 : 0.6} 
                wireframe={true} 
              />
            </mesh>
          </group>
        ))
      )}

      {/* Central Glass Elevator Shaft */}
      <group position={[-58, 24, 0]}>
        {/* Elevator Glass Core */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8, 58, 8]} />
          <meshStandardMaterial 
            color={glassColor} 
            transparent 
            opacity={0.15} 
            metalness={0.8} 
            roughness={0.1} 
          />
        </mesh>
        {/* Elevator Wireframe Cage */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8.1, 58.1, 8.1]} />
          <meshBasicMaterial color={glassColor} wireframe={true} opacity={0.3} transparent />
        </mesh>
        {/* Moving Elevator Cabin at Active Floor */}
        <mesh position={[0, activeLevel * 16 - 20, 0]} castShadow>
          <boxGeometry args={[6.5, 6, 6.5]} />
          <meshStandardMaterial 
            color={isNeon ? '#00d66f' : '#25d366'} 
            emissive={isNeon ? '#00d66f' : '#128c7e'} 
            emissiveIntensity={0.8} 
            roughness={0.2} 
            metalness={0.8} 
          />
        </mesh>
        <Text 
          position={[5.5, activeLevel * 16 - 20, 0]} 
          fontSize={1.2} 
          color="#ffffff" 
          rotation={[0, Math.PI / 2, 0]}
        >
          🛗 LEVEL {activeLevel}
        </Text>
      </group>

      {/* Render Stacked Architectural Floor Slabs */}
      {FLOORS_CONFIG.map((floor) => {
        const isCurrent = floor.id === activeFloor;
        const visible = showAllFloors || isCurrent;
        if (!visible) return null;

        const isDimmed = showAllFloors && !isCurrent;

        return (
          <group 
            key={floor.id} 
            position={[0, floor.y, 0]}
            onClick={(e) => {
              if (showAllFloors && onSelectFloor) {
                e.stopPropagation();
                onSelectFloor(floor.id);
              }
            }}
          >
            {/* Floor Slab Plate (When stacked view is active) */}
            {floor.level > 0 && (
              <>
                <mesh receiveShadow position={[0, -0.2, 0]}>
                  <boxGeometry args={[128, 0.4, 108]} />
                  <meshStandardMaterial 
                    color={isNeon ? '#09150f' : '#f8fafc'} 
                    roughness={0.3} 
                    metalness={isNeon ? 0.6 : 0.1}
                    transparent={isDimmed}
                    opacity={isDimmed ? 0.35 : 1}
                  />
                </mesh>
                {/* Glowing Perimeter Edge */}
                <mesh position={[0, 0.05, 0]}>
                  <boxGeometry args={[128.2, 0.1, 108.2]} />
                  <meshBasicMaterial 
                    color={floor.color} 
                    wireframe={true} 
                    transparent={isDimmed}
                    opacity={isDimmed ? 0.2 : 0.8}
                  />
                </mesh>
              </>
            )}

            {/* Architectural Floating Floor Level Signboard */}
            <group position={[0, 8, -53]}>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[42, 3.2, 0.3]} />
                <meshStandardMaterial 
                  color={isNeon ? '#06120b' : '#ffffff'} 
                  metalness={0.8} 
                  roughness={0.2}
                />
              </mesh>
              <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[42.2, 0.15, 0.35]} />
                <meshStandardMaterial color={floor.color} emissive={floor.color} emissiveIntensity={1.5} />
              </mesh>
              <Text
                position={[0, 0.6, 0.2]}
                fontSize={1.3}
                color="#ffffff"
                anchorX="center"
                anchorY="middle"
              >
                {`LEVEL ${floor.level} • ${floor.name}`}
              </Text>
              <Text
                position={[0, -0.6, 0.2]}
                fontSize={0.65}
                color={isNeon ? '#9ae6b4' : '#128c7e'}
                anchorX="center"
                anchorY="middle"
              >
                {floor.subtitle}
              </Text>
            </group>
          </group>
        );
      })}
    </group>
  );
};

export default BuildingStructure3D;
