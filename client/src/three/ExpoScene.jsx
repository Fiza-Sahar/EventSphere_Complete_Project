import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Floor from './Floor';
import Booth from './Booth';
import Stage from './Stage';
import Entrance from './Entrance';
import FacilityMarker3D from './FacilityMarker3D';
import NavigationRoute3D from './NavigationRoute3D';
import UserLocationMarker3D from './UserLocationMarker3D';
import HeatmapOverlay3D from './HeatmapOverlay3D';
import CrowdSimulation from './CrowdSimulation';
import BuildingStructure3D from './BuildingStructure3D';
import ExteriorBuildingScene from './ExteriorBuildingScene';
import AtmosphereParticles from './AtmosphereParticles';
import RunwayLaserLights from './RunwayLaserLights';
import CameraControls from './CameraControls';
import { useTheme } from '../context/ThemeContext';

const FLOORS_Y = {
  'floor-0': 0,
  'floor-1': 16,
  'floor-2': 32,
  'floor-vip': 48
};

const ExpoScene = ({ 
  booths = [], 
  selectedBooth, 
  onSelectBooth,
  facilities = [],
  activeLayers = {},
  selectedSector = 'ALL',
  activeFloor = 'floor-0',
  showAllFloors = false,
  viewMode = 'INDOOR', // 'INDOOR' or 'EXTERIOR'
  onSelectFloor,
  navigationRoute = null,
  userLocation = null,
  showHeatmap = false,
  isEmergency = false,
  cameraPreset = 'DEFAULT',
  cameraTargetPos = null,
  isDroneTour = false,
  onSelectFacility,
  onEnterInterior
}) => {
  const { isNeon } = useTheme();

  const isExterior = viewMode === 'EXTERIOR';
  const floorY = FLOORS_Y[activeFloor] || 0;

  // Dynamic Theme Colors for 3D Scene
  const bgColor = isEmergency 
    ? '#1a0505' 
    : isNeon 
      ? '#060a08' 
      : '#e2e8f0';

  const fogNear = isNeon ? 60 : 75;
  const fogFar = isExterior ? 300 : 250;
  const ambientIntensity = isEmergency ? 0.4 : isNeon ? 0.95 : 1.35;
  const dirLightIntensity = isEmergency ? 0.6 : isNeon ? 1.5 : 1.75;
  const dirLightColor = isEmergency ? '#fca5a5' : isNeon ? '#f0fdf4' : '#f8fafc';

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ 
        antialias: true, 
        alpha: false, 
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      }}
      camera={{ position: [0, isExterior ? 52 : floorY + 48, isExterior ? 115 : 62], fov: 48 }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[bgColor, fogNear, fogFar]} />
      
      {/* Lighting Rig */}
      <ambientLight intensity={ambientIntensity} />
      
      {/* Key Directional Sun / Arena Light */}
      <directionalLight 
        position={[40, isExterior ? 80 : floorY + 60, 30]} 
        intensity={dirLightIntensity} 
        color={dirLightColor}
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={260}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-bias={-0.0005}
      />

      {/* Arena Accent Point Lights */}
      {!isEmergency && isNeon && (
        <>
          <pointLight position={[-35, isExterior ? 30 : floorY + 25, -25]} intensity={1.4} color="#00d66f" distance={100} />
          <pointLight position={[35, isExterior ? 30 : floorY + 25, 25]} intensity={1.4} color="#06b6d4" distance={100} />
          <pointLight position={[0, isExterior ? 35 : floorY + 30, 0]} intensity={1.1} color="#ffffff" distance={120} />
        </>
      )}

      {!isEmergency && !isNeon && (
        <>
          <pointLight position={[-35, isExterior ? 30 : floorY + 25, -25]} intensity={1.2} color="#128c7e" distance={100} />
          <pointLight position={[35, isExterior ? 30 : floorY + 25, 25]} intensity={1.2} color="#25d366" distance={100} />
          <pointLight position={[0, isExterior ? 35 : floorY + 30, 0]} intensity={1.0} color="#ffffff" distance={120} />
        </>
      )}

      {/* Emergency Strobe Light */}
      {isEmergency && (
        <>
          <pointLight position={[0, floorY + 15, 0]} intensity={4.5} color="#ef4444" distance={90} />
          <pointLight position={[52, floorY + 10, -42]} intensity={5} color="#ef4444" distance={60} />
          <pointLight position={[-52, floorY + 10, -42]} intensity={5} color="#ef4444" distance={60} />
        </>
      )}

      <Suspense fallback={null}>
        {/* MODE 1: EXTERIOR CONVENTION COMPLEX & PARKING VIEW */}
        {isExterior ? (
          <ExteriorBuildingScene
            isNeon={isNeon}
            onEnterInterior={onEnterInterior}
          />
        ) : (
          /* MODE 2: INTERIOR MULTI-FLOOR ARCHITECTURAL EXHIBITION VIEW */
          <>
            {/* Multi-Story Building Structural Framework */}
            <BuildingStructure3D
              activeFloor={activeFloor}
              showAllFloors={showAllFloors}
              isNeon={isNeon}
              onSelectFloor={onSelectFloor}
            />

            {/* Current Active Floor Level Group with Dynamic Elevation */}
            <group position={[0, floorY, 0]}>
              {/* Polished Epoxy / Marble Floor & Perimeter Walls */}
              <Floor isNeon={isNeon} />

              {/* Grand Arena Keynote Stage */}
              {(activeFloor === 'floor-0' || activeFloor === 'floor-vip') && (activeLayers['Stages'] !== false || isEmergency) && (
                <Stage position={[0, 0, -40]} isNeon={isNeon} />
              )}

              {/* Grand Entrance & Exit Portals (Ground Floor) */}
              {activeFloor === 'floor-0' && (
                <Entrance isNeon={isNeon} />
              )}

              {/* Booths Rendering */}
              {(activeLayers['Exhibitor Booths'] !== false) && booths.map((booth) => {
                const isSectorMatch = selectedSector === 'ALL' || (booth.boothNumber && booth.boothNumber.startsWith(selectedSector));
                const isDimmed = !isSectorMatch;

                return (
                  <Booth
                    key={booth._id || booth.boothNumber}
                    booth={booth}
                    isSelected={selectedBooth && selectedBooth._id === booth._id}
                    isDimmed={isDimmed}
                    isNeon={isNeon}
                    onClick={onSelectBooth}
                  />
                );
              })}

              {/* Dynamic Facility Pins */}
              {facilities.map((fac) => {
                const isLayerOn = activeLayers[fac.type] !== false;
                const visible = isEmergency 
                  ? (fac.type === 'Emergency Exits' || fac.type === 'Medical') 
                  : isLayerOn;

                return (
                  <FacilityMarker3D
                    key={fac._id || fac.name}
                    facility={fac}
                    visible={visible}
                    isEmergency={isEmergency}
                    isNeon={isNeon}
                    onClick={onSelectFacility}
                  />
                );
              })}

              {/* Smart Navigation Route Line */}
              {navigationRoute && (
                <NavigationRoute3D
                  startPos={navigationRoute.startPos}
                  endPos={navigationRoute.endPos}
                  isEmergency={isEmergency}
                  isNeon={isNeon}
                />
              )}

              {/* User Location Radar Marker */}
              {userLocation && (
                <UserLocationMarker3D
                  position={userLocation}
                  visible={true}
                  isNeon={isNeon}
                />
              )}

              {/* Visitor Density Heatmap */}
              <HeatmapOverlay3D
                booths={booths}
                visible={showHeatmap}
                isNeon={isNeon}
              />

              {/* Live Animated Visitor Crowd Simulation */}
              {!isEmergency && (
                <CrowdSimulation isNeon={isNeon} count={22} />
              )}

              {/* Glowing Runway Laser Strips & Overhead Lighting Truss */}
              {!isEmergency && (
                <RunwayLaserLights isNeon={isNeon} />
              )}

              {/* Floating 3D Cyber Dust & Atmospheric Particles */}
              <AtmosphereParticles isNeon={isNeon} count={180} />
            </group>
          </>
        )}
      </Suspense>

      {/* Damped Camera Controls with smooth Presets & Target Focus */}
      <CameraControls
        targetPos={cameraTargetPos}
        preset={cameraPreset}
        floorY={floorY}
        isExterior={isExterior}
        isDroneTour={isDroneTour}
      />
    </Canvas>
  );
};

export default ExpoScene;
