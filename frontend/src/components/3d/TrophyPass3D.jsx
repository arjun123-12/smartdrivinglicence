import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import LightingSystem from './LightingSystem';
import PerformanceManager from './PerformanceManager';
import WebGLErrorBoundary from './WebGLFallback';
import { use3DPerformance } from '../../hooks/use3DPerformance';
import { Award, CheckCircle } from 'lucide-react';

/**
 * 3D South Australian Provisional P-Plate & Trophy Shield
 */
function PlateShield() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Outer Golden Shield Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 2.6, 0.18]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Inner White Plate Body */}
      <mesh position={[0, 0, 0.1]}>
        <boxGeometry args={[1.9, 2.3, 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* SA Red P-Plate Letter Symbol */}
      <mesh position={[-0.1, 0.25, 0.14]}>
        <boxGeometry args={[0.3, 1.2, 0.04]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.55, 0.14]}>
        <boxGeometry args={[0.65, 0.6, 0.04]} />
        <meshStandardMaterial color="#dc2626" roughness={0.2} />
      </mesh>

      {/* Adelaide South Australia Text Plate */}
      <mesh position={[0, -0.75, 0.13]}>
        <boxGeometry args={[1.5, 0.22, 0.02]} />
        <meshStandardMaterial color="#1B6C31" roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * TrophyPass3D Component
 * 3D Metallic P-Plate & Pass Shield for the Pass Wall section.
 */
export default function TrophyPass3D({ className = '', style = {} }) {
  const { isSupported, dpr } = use3DPerformance();

  if (!isSupported) {
    return null;
  }

  return (
    <div
      className={`trophy-pass-3d-box ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '260px',
        overflow: 'hidden',
        ...style,
      }}
    >
      <WebGLErrorBoundary fallback={<div />}>
        <PerformanceManager>
          <Canvas
            shadows
            camera={{ position: [0, 0, 4.2], fov: 45 }}
            dpr={dpr}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <LightingSystem intensity={1.3} />
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                <PlateShield />
              </Float>
              <ContactShadows
                position={[0, -1.6, 0]}
                opacity={0.6}
                scale={5}
                blur={1.8}
                far={3}
                color="#000000"
              />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.5} />
            </Suspense>
          </Canvas>
        </PerformanceManager>
      </WebGLErrorBoundary>
    </div>
  );
}
