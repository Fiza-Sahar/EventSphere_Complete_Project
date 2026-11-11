import React, { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const CameraControls = ({ 
  targetPos, 
  preset = 'DEFAULT', 
  floorY = 0, 
  isExterior = false,
  isDroneTour = false 
}) => {
  const controlsRef = useRef();
  const { camera } = useThree();

  const desiredTarget = useRef(new THREE.Vector3(0, floorY, 0));
  const desiredCamPos = useRef(new THREE.Vector3(0, floorY + 48, 62));

  useEffect(() => {
    if (isDroneTour) {
      // Handled in useFrame smooth orbit loop
      return;
    }

    if (isExterior) {
      // Cinematic Exterior Convention Complex View
      desiredCamPos.current.set(0, 52, 120);
      desiredTarget.current.set(0, 18, 0);
    } else if (preset === 'TOP_DOWN') {
      desiredCamPos.current.set(0, floorY + 85, 0.1);
      desiredTarget.current.set(0, floorY, 0);
    } else if (preset === 'STAGE') {
      desiredCamPos.current.set(0, floorY + 16, -10);
      desiredTarget.current.set(0, floorY + 6, -40);
    } else if (preset === 'ENTRANCE') {
      desiredCamPos.current.set(0, floorY + 18, 70);
      desiredTarget.current.set(0, floorY + 5, 45);
    } else if (preset === 'TARGET' && targetPos) {
      desiredCamPos.current.set(targetPos.x, (targetPos.y || floorY) + 14, targetPos.z + 18);
      desiredTarget.current.set(targetPos.x, (targetPos.y || floorY) + 1.5, targetPos.z);
    } else {
      // DEFAULT INTERIOR FLOOR PERSPECTIVE
      desiredCamPos.current.set(0, floorY + 46, 58);
      desiredTarget.current.set(0, floorY, 0);
    }
  }, [preset, targetPos, floorY, isExterior, isDroneTour]);

  // Smooth damped lerp / Drone Flythrough loop
  useFrame(({ clock }) => {
    if (controlsRef.current) {
      if (isDroneTour) {
        const t = clock.getElapsedTime() * 0.25;
        const radius = isExterior ? 120 : 65;
        const height = isExterior ? 55 + Math.sin(t * 2) * 15 : floorY + 42 + Math.sin(t * 2) * 8;
        
        camera.position.x = Math.sin(t) * radius;
        camera.position.z = Math.cos(t) * radius;
        camera.position.y = height;
        controlsRef.current.target.set(0, isExterior ? 18 : floorY, 0);
        controlsRef.current.update();
      } else {
        camera.position.lerp(desiredCamPos.current, 0.08);
        controlsRef.current.target.lerp(desiredTarget.current, 0.08);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={!isDroneTour}
      enableZoom={!isDroneTour}
      enableRotate={!isDroneTour}
      maxPolarAngle={Math.PI / 2.02}
      minDistance={8}
      maxDistance={260}
      dampingFactor={0.06}
      enableDamping={true}
    />
  );
};

export default CameraControls;
