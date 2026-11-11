import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const UserLocationMarker3D = ({ position = { x: 0, y: 0, z: 35 }, visible = true }) => {
  const radarRef = useRef();

  useFrame(({ clock }) => {
    if (radarRef.current) {
      const scale = 1 + (clock.getElapsedTime() % 2) * 1.5;
      radarRef.current.scale.set(scale, scale, scale);
      radarRef.current.material.opacity = Math.max(0, 1 - (clock.getElapsedTime() % 2) * 0.5);
    }
  });

  if (!visible) return null;

  return (
    <group position={[position.x, 0.2, position.z]}>
      {/* Expanding Radar Wave */}
      <mesh ref={radarRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.8, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
      </mesh>

      {/* User Center Avatar Disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshStandardMaterial color="#0284c7" emissive="#38bdf8" emissiveIntensity={0.8} />
      </mesh>

      {/* User Pin Pointer */}
      <group position={[0, 2, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
        </mesh>
        <Text
          position={[0, 1, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.06}
          outlineColor="#070a13"
        >
          📍 You Are Here
        </Text>
      </group>
    </group>
  );
};

export default UserLocationMarker3D;
