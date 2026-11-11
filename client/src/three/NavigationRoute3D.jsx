import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NavigationRoute3D = ({ startPos, endPos, isEmergency = false, isNeon = true }) => {
  if (!startPos || !endPos) return null;

  const beaconRef = useRef();
  const ringRef = useRef();
  const particlesRef = useRef([]);

  const { curve, p1, p4, routeColor } = useMemo(() => {
    const p1Vec = new THREE.Vector3(startPos.x || 0, 0.25, startPos.z || 0);
    const p4Vec = new THREE.Vector3(endPos.x || 0, 0.25, endPos.z || 0);
    
    // Corridor intermediate corner routing so it follows hall pathways
    const midZ = (p1Vec.z + p4Vec.z) / 2;
    const p2Vec = new THREE.Vector3(p1Vec.x, 0.25, midZ);
    const p3Vec = new THREE.Vector3(p4Vec.x, 0.25, midZ);

    const c = new THREE.CatmullRomCurve3([p1Vec, p2Vec, p3Vec, p4Vec]);
    const color = isEmergency ? '#ef4444' : isNeon ? '#00ff88' : '#25d366';

    return { 
      curve: c, 
      p1: p1Vec, 
      p4: p4Vec, 
      routeColor: color
    };
  }, [startPos, endPos, isEmergency, isNeon]);

  // Traveling pulses along the route
  const pulseOffsets = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => i / 8);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Animate destination beacon hovering & rotating
    if (beaconRef.current) {
      beaconRef.current.position.y = 3.6 + Math.sin(t * 3) * 0.4;
      beaconRef.current.rotation.y = t * 2;
    }

    // Animate radar ring pulse
    if (ringRef.current) {
      const scale = 1 + (Math.sin(t * 4) + 1) * 0.2;
      ringRef.current.scale.set(scale, scale, 1);
    }

    // Animate traveling direction arrows / light spheres along curve
    particlesRef.current.forEach((mesh, idx) => {
      if (mesh && curve) {
        const offset = (t * 0.35 + pulseOffsets[idx]) % 1;
        const pt = curve.getPointAt(offset);
        mesh.position.set(pt.x, pt.y + 0.15, pt.z);
      }
    });
  });

  return (
    <group>
      {/* Main Glowing 3D Navigation Path Tube */}
      <mesh position={[0, 0.05, 0]}>
        <tubeGeometry args={[curve, 48, 0.25, 8, false]} />
        <meshStandardMaterial 
          color={routeColor} 
          emissive={routeColor} 
          emissiveIntensity={isNeon ? 2.5 : 1.4} 
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Traveling Energy Direction Beacons along the line */}
      {pulseOffsets.map((_, i) => (
        <mesh 
          key={i} 
          ref={el => (particlesRef.current[i] = el)}
          position={[p1.x, 0.3, p1.z]}
        >
          <sphereGeometry args={[0.3, 12, 12]} />
          <meshBasicMaterial color={isEmergency ? '#ff8888' : '#ffffff'} />
        </mesh>
      ))}

      {/* Start Location Marker Disc with Pulse */}
      <group position={[p1.x, 0.1, p1.z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.4, 32]} />
          <meshBasicMaterial color={isNeon ? '#00f2fe' : '#0284c7'} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.9, 32]} />
          <meshBasicMaterial color={isNeon ? '#00f2fe' : '#0284c7'} transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Target Destination Animated Waypoint Beacon */}
      <group position={[p4.x, 0, p4.z]}>
        {/* Floor Target Concentric Rings */}
        <mesh ref={ringRef} position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 2.2, 32]} />
          <meshBasicMaterial color={routeColor} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.0, 32]} />
          <meshBasicMaterial color={routeColor} />
        </mesh>

        {/* Floating Rotating Waypoint Diamond / Pyramid Pin */}
        <group ref={beaconRef} position={[0, 3.6, 0]}>
          <mesh>
            <octahedronGeometry args={[1.1, 0]} />
            <meshStandardMaterial 
              color={routeColor} 
              emissive={routeColor} 
              emissiveIntensity={3.0} 
              wireframe={false} 
            />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <octahedronGeometry args={[1.3, 0]} />
            <meshBasicMaterial color="#ffffff" wireframe={true} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default NavigationRoute3D;
