import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AtmosphereParticles = ({ count = 180, isNeon = true }) => {
  const pointsRef = useRef();

  // Generate particle positions and random drift velocities
  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = isNeon ? new THREE.Color('#00ff88') : new THREE.Color('#10b981');
    const c2 = isNeon ? new THREE.Color('#00f2fe') : new THREE.Color('#0284c7');
    const c3 = new THREE.Color('#ffffff');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 140;
      pos[i * 3 + 1] = 1 + Math.random() * 28;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;

      vel[i * 3] = (Math.random() - 0.5) * 0.04;
      vel[i * 3 + 1] = 0.02 + Math.random() * 0.04;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.04;

      const chosenColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, vel, col];
  }, [count, isNeon]);

  useFrame(() => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      const arr = posAttr.array;

      for (let i = 0; i < count; i++) {
        arr[i * 3] += velocities[i * 3];
        arr[i * 3 + 1] += velocities[i * 3 + 1];
        arr[i * 3 + 2] += velocities[i * 3 + 2];

        // Loop particles when they drift too high
        if (arr[i * 3 + 1] > 30) {
          arr[i * 3 + 1] = 1;
          arr[i * 3] = (Math.random() - 0.5) * 140;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 120;
        }
      }

      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isNeon ? 0.35 : 0.25}
        vertexColors
        transparent
        opacity={isNeon ? 0.8 : 0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export default AtmosphereParticles;
