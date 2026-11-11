import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CrowdSimulation = ({ isNeon = true, count = 28 }) => {
  const crowdRef = useRef();

  // Generate simulated attendee waypoints along expo corridors
  const attendees = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const startX = (Math.random() - 0.5) * 80;
      const startZ = (Math.random() - 0.5) * 70;
      const speed = 0.08 + Math.random() * 0.12;
      const radius = 10 + Math.random() * 25;
      const phase = Math.random() * Math.PI * 2;
      const color = isNeon 
        ? (i % 3 === 0 ? '#00ff88' : i % 3 === 1 ? '#00f2fe' : '#ffffff')
        : (i % 3 === 0 ? '#128c7e' : i % 3 === 1 ? '#25d366' : '#0284c7');

      arr.push({ startX, startZ, speed, radius, phase, color });
    }
    return arr;
  }, [count, isNeon]);

  const groupRefs = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    attendees.forEach((att, idx) => {
      const g = groupRefs.current[idx];
      if (g) {
        const angle = t * att.speed + att.phase;
        g.position.x = att.startX + Math.sin(angle) * att.radius;
        g.position.z = att.startZ + Math.cos(angle * 0.7) * (att.radius * 0.8);
        g.position.y = 0.6 + Math.abs(Math.sin(t * 4 + att.phase)) * 0.08; // natural walking bob
        g.rotation.y = angle + Math.PI / 2;
      }
    });
  });

  return (
    <group ref={crowdRef}>
      {attendees.map((att, idx) => (
        <group 
          key={idx} 
          ref={el => (groupRefs.current[idx] = el)}
          position={[att.startX, 0.6, att.startZ]}
        >
          {/* Delegate Body Capsule */}
          <mesh castShadow position={[0, 0.35, 0]}>
            <capsuleGeometry args={[0.25, 0.5, 4, 8]} />
            <meshStandardMaterial 
              color={att.color} 
              roughness={0.3} 
              metalness={isNeon ? 0.6 : 0.2}
              emissive={att.color}
              emissiveIntensity={isNeon ? 0.4 : 0.15}
            />
          </mesh>

          {/* Delegate Head Orb */}
          <mesh position={[0, 0.85, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial 
              color={isNeon ? '#ffffff' : '#f8fafc'} 
              roughness={0.2} 
            />
          </mesh>

          {/* Interactive Floating Smart Badge Orb */}
          <mesh position={[0, 1.15, 0]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial 
              color={att.color} 
              emissive={att.color} 
              emissiveIntensity={1.5} 
            />
          </mesh>

          {/* Floor Radar Shadow Ring */}
          <mesh position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 12]} />
            <meshBasicMaterial 
              color={att.color} 
              transparent 
              opacity={0.25} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export default CrowdSimulation;
