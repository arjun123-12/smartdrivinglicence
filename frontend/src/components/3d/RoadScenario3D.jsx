import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from './CarModel';
import LightingSystem from './LightingSystem';
import PerformanceManager from './PerformanceManager';
import WebGLErrorBoundary from './WebGLFallback';
import { use3DPerformance } from '../../hooks/use3DPerformance';
import { Compass, CheckCircle2 } from 'lucide-react';

/**
 * Animated Car performing the selected manoeuvre
 */
function ScenarioVehicle({ scenario = 'parallel' }) {
  const carRef = useRef();

  useFrame(({ clock }) => {
    if (!carRef.current) return;
    const t = clock.getElapsedTime() * 0.75;

    if (scenario === 'threepoint') {
      // 3-Point Turn: drive forward-right, reverse-left, drive away
      const cycle = t % 6;
      if (cycle < 2) {
        carRef.current.position.set(Math.sin(cycle) * 1.2, 0, cycle * 0.8 - 1);
        carRef.current.rotation.y = cycle * 0.35;
      } else if (cycle < 4) {
        carRef.current.position.set(1.2 - (cycle - 2) * 1.2, 0, 0.6 - (cycle - 2) * 0.5);
        carRef.current.rotation.y = 0.7 - (cycle - 2) * 0.8;
      } else {
        carRef.current.position.set(-0.5 + (cycle - 4) * 0.8, 0, (cycle - 4) * 1.5);
        carRef.current.rotation.y = -0.9 + (cycle - 4) * 0.45;
      }
    } else if (scenario === 'kerb') {
      // Kerb Stop: smooth glide to gutter and park
      const cycle = t % 4;
      const progress = Math.min(cycle / 2.5, 1);
      carRef.current.position.x = THREE.MathUtils.lerp(-1.2, 0.85, progress);
      carRef.current.position.z = THREE.MathUtils.lerp(-2.5, 0.5, progress);
      carRef.current.rotation.y = progress < 0.8 ? 0.15 : 0;
    } else {
      // Reverse Parallel Parking: glide alongside, cut back at 45 deg, straighten
      const cycle = t % 5;
      if (cycle < 2) {
        carRef.current.position.set(0.85, 0, -1.8 + cycle * 1.2);
        carRef.current.rotation.y = 0;
      } else if (cycle < 3.8) {
        const p = (cycle - 2) / 1.8;
        carRef.current.position.set(0.85 - p * 0.9, 0, 0.6 - p * 1.5);
        carRef.current.rotation.y = -Math.sin(p * Math.PI) * 0.55;
      } else {
        carRef.current.position.set(-0.05, 0, -0.9);
        carRef.current.rotation.y = 0;
      }
    }
  });

  return (
    <group ref={carRef}>
      <CarModel scale={0.75} color="#1B6C31" isRotating />
    </group>
  );
}

/**
 * 3D Road Environment with asphalt, road lines, kerbs, and traffic cones
 */
function RoadEnvironment() {
  return (
    <group position={[0, -0.3, 0]}>
      {/* Asphalt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>

      {/* Concrete Kerb */}
      <mesh position={[-2.8, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.16, 14]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>
      <mesh position={[2.8, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.16, 14]} />
        <meshStandardMaterial color="#475569" roughness={0.6} />
      </mesh>

      {/* Dashed White Center Line */}
      {[-4, -2, 0, 2, 4].map((z, idx) => (
        <mesh key={idx} position={[0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 1.2]} />
          <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
        </mesh>
      ))}

      {/* Traffic Cones */}
      {[
        [-1.8, 0.25, 2.0],
        [-1.8, 0.25, -2.0],
        [1.8, 0.25, 2.0],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh castShadow>
            <coneGeometry args={[0.18, 0.5, 16]} />
            <meshStandardMaterial color="#f97316" roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.14, 0.1, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, -0.24, 0]}>
            <boxGeometry args={[0.38, 0.03, 0.38]} />
            <meshStandardMaterial color="#ea580c" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * RoadScenario3D Component
 * Interactive 3D scene demonstrating VORT road test manoeuvres:
 * 1. Reverse Parallel Park
 * 2. 3-Point Turn
 * 3. Kerb Side Stop
 */
export default function RoadScenario3D({ className = '', style = {} }) {
  const [scenario, setScenario] = useState('parallel'); // 'parallel' | 'threepoint' | 'kerb'
  const { isSupported, dpr } = use3DPerformance();

  const scenarios = [
    { id: 'parallel', label: 'Reverse Parallel Park', desc: 'Accredited test criteria: within 300mm of kerb in two continuous motions.' },
    { id: 'threepoint', label: '3-Point Turn', desc: 'Smooth 2-way road turn with full 360-degree blind spot head checks.' },
    { id: 'kerb', label: 'Kerb Side Stop', desc: 'Smooth deceleration, left indicator, and parking parallel within 30cm.' },
  ];

  if (!isSupported) {
    return (
      <div className={`road-scenario-3d-box ${className}`} style={{ minHeight: '380px', ...style }}>
        <img
          src="/images/hero-driving.jpg"
          alt="VORT Road Test Manoeuvres"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`road-scenario-3d-box ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '420px',
        borderRadius: '24px',
        background: 'linear-gradient(145deg, #07172b 0%, #0d2645 100%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-3d-lg)',
        ...style,
      }}
    >
      <WebGLErrorBoundary>
        <PerformanceManager>
          <Canvas
            shadows
            camera={{ position: [0, 6.5, 6.5], fov: 45 }}
            dpr={dpr}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <LightingSystem intensity={1.1} />
              <RoadEnvironment />
              <ScenarioVehicle scenario={scenario} />
              <ContactShadows
                position={[0, -0.28, 0]}
                opacity={0.7}
                scale={10}
                blur={2}
                far={4}
                color="#000000"
              />
              <OrbitControls
                enableZoom={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
              />
            </Suspense>
          </Canvas>
        </PerformanceManager>
      </WebGLErrorBoundary>

      {/* Top Overlay Badge */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          pointerEvents: 'none',
        }}
      >
        <span className="badge-3d">
          <Compass size={14} /> VORT Manoeuvre Simulation
        </span>
      </div>

      {/* Scenario Selector Tabs */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          background: 'rgba(7, 23, 43, 0.88)',
          backdropFilter: 'blur(12px)',
          padding: '0.85rem 1rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {scenarios.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => setScenario(sc.id)}
              style={{
                flex: 1,
                minWidth: '120px',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: scenario === sc.id ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.1)',
                background: scenario === sc.id ? 'rgba(27, 108, 49, 0.4)' : 'rgba(255,255,255,0.04)',
                color: scenario === sc.id ? '#86efac' : '#cbd5e1',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {sc.label}
            </button>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={13} color="#22c55e" />
          {scenarios.find((s) => s.id === scenario)?.desc}
        </p>
      </div>
    </div>
  );
}
