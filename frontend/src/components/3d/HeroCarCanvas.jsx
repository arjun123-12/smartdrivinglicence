import React, { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import CarModel from './CarModel';
import LightingSystem from './LightingSystem';
import WebGLErrorBoundary from './WebGLFallback';
import PerformanceManager from './PerformanceManager';
import { use3DPerformance } from '../../hooks/use3DPerformance';
import { Sparkles, Palette, ShieldCheck, RotateCw } from 'lucide-react';

/**
 * Camera & Scene Parallax Controller
 */
function InteractiveCameraRig() {
  useFrame((state) => {
    // Gentle mouse parallax tilt
    const targetX = state.pointer.x * 0.8;
    const targetY = 2.2 + state.pointer.y * 0.4;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 3.8 + targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0.4, 0);
  });
  return null;
}

/**
 * HeroCarCanvas Component
 * Interactive 3D vehicle experience featured in the Hero section.
 * Includes realistic PBR lighting, ground contact shadows, color customizer, and 360 rotation.
 */
export default function HeroCarCanvas({ className = '', style = {} }) {
  const [carColor, setCarColor] = useState('#ffffff'); // Default Pure White
  const [autoRotate, setAutoRotate] = useState(true);
  const { isSupported, dpr, isMobile } = use3DPerformance();

  const colorOptions = [
    { name: 'Pure White', hex: '#ffffff' },
    { name: 'A1 Forest Green', hex: '#1B6C31' },
    { name: 'Midnight Navy', hex: '#0D2645' },
    { name: 'Platinum Silver', hex: '#94a3b8' },
  ];

  if (!isSupported) {
    return (
      <div className={`hero-3d-car-container ${className}`} style={{ minHeight: '440px', ...style }}>
        <img
          src="/images/hero-car.jpg"
          alt="A1 Smart Driving Dual-Controlled Vehicle"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '24px' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`hero-3d-car-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '380px' : '480px',
        borderRadius: '24px',
        background: 'radial-gradient(circle at 50% 30%, rgba(27, 108, 49, 0.18) 0%, rgba(7, 23, 43, 0.95) 75%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 35px rgba(27, 108, 49, 0.25)',
        overflow: 'hidden',
        ...style,
      }}
    >
      <WebGLErrorBoundary>
        <PerformanceManager>
          <Canvas
            shadows
            camera={{ position: [3.8, 2.2, 4.8], fov: 42 }}
            dpr={dpr}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%', cursor: 'grab' }}
          >
            <Suspense fallback={null}>
              <LightingSystem intensity={1.15} />

              <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25} floatingRange={[-0.05, 0.05]}>
                <CarModel color={carColor} isRotating={autoRotate} position={[0, -0.15, 0]} />
              </Float>

              {/* Realistic Soft Contact Shadows on ground */}
              <ContactShadows
                position={[0, -0.44, 0]}
                opacity={0.7}
                scale={10}
                blur={1.8}
                far={4.5}
                color="#020617"
              />

              <InteractiveCameraRig />

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={1.0}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.05} // prevent going below asphalt ground
                onStart={() => setAutoRotate(false)}
              />
            </Suspense>
          </Canvas>
        </PerformanceManager>
      </WebGLErrorBoundary>

      {/* Floating Badges */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          pointerEvents: 'none',
        }}
      >
        <span className="badge-3d">
          <ShieldCheck size={14} /> 5-Star ANCAP Safety
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            background: 'rgba(13, 38, 69, 0.8)',
            padding: '0.25rem 0.65rem',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <RotateCw size={12} /> Drag to inspect 360°
        </span>
      </div>

      {/* Vehicle Paint Color Switcher */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.25rem',
          right: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(10, 25, 45, 0.85)',
          padding: '0.4rem 0.75rem',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.4)',
        }}
      >
        <Palette size={15} color="#94a3b8" />
        <span style={{ fontSize: '0.75rem', color: '#cbd5e1', marginRight: '0.25rem' }}>Color:</span>
        {colorOptions.map((opt) => (
          <button
            key={opt.hex}
            type="button"
            onClick={() => setCarColor(opt.hex)}
            title={opt.name}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: opt.hex,
              border: carColor === opt.hex ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transform: carColor === opt.hex ? 'scale(1.2)' : 'scale(1)',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
