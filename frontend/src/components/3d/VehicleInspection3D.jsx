import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, Html } from '@react-three/drei';
import CarModel from './CarModel';
import LightingSystem from './LightingSystem';
import PerformanceManager from './PerformanceManager';
import WebGLErrorBoundary from './WebGLFallback';
import { use3DPerformance } from '../../hooks/use3DPerformance';
import { ShieldAlert, Check, Eye } from 'lucide-react';

/**
 * VehicleInspection3D Component
 * Interactive 3D vehicle inspection with 3D hotspots for dual controls, blind spots,
 * transmission, and 5-star ANCAP safety features.
 */
export default function VehicleInspection3D({ className = '', style = {} }) {
  const [activeHotspot, setActiveHotspot] = useState('dualcontrols');
  const { isSupported, dpr } = use3DPerformance();

  const hotspots = [
    {
      id: 'dualcontrols',
      title: 'Dual Control Pedals',
      desc: 'Dual brake installed on instructor passenger side for 100% learner safety.',
      position: [0.65, 0.7, 0.4],
    },
    {
      id: 'blindspots',
      title: 'Dual Wide Mirrors',
      desc: 'Expanded auxiliary mirrors ensure full situational awareness and zero blind spots.',
      position: [-1.1, 0.9, 0.6],
    },
    {
      id: 'automatic',
      title: 'Smooth Automatic Transmission',
      desc: 'Late-model automatic gearbox allows complete focus on hazard perception and road positioning.',
      position: [0, 0.65, 0.2],
    },
    {
      id: 'ancap',
      title: '5-Star ANCAP Safety',
      desc: 'Equipped with electronic stability control, curtain airbags, and autonomous emergency braking.',
      position: [0, 1.4, -0.2],
    },
  ];

  if (!isSupported) {
    return (
      <div className={`inspection-3d-box ${className}`} style={{ minHeight: '380px', ...style }}>
        <img
          src="/images/hero-car.jpg"
          alt="A1 Smart Driving Dual-Controlled Car"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '20px' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`inspection-3d-box ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '440px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #07172b 0%, #0d2645 100%)',
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
            camera={{ position: [3.2, 2.0, 3.6], fov: 44 }}
            dpr={dpr}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%', cursor: 'grab' }}
          >
            <Suspense fallback={null}>
              <LightingSystem intensity={1.2} />
              <Float speed={1} rotationIntensity={0.1} floatIntensity={0.15}>
                <CarModel color="#1B6C31" />
              </Float>

              {/* 3D Interactive Hotspot Markers */}
              {hotspots.map((spot) => (
                <Html key={spot.id} position={spot.position} center>
                  <button
                    type="button"
                    onClick={() => setActiveHotspot(spot.id)}
                    aria-label={spot.title}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: activeHotspot === spot.id ? '#22c55e' : 'rgba(13, 38, 69, 0.85)',
                      border: '2px solid #ffffff',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: activeHotspot === spot.id ? '0 0 20px #22c55e' : '0 4px 10px rgba(0,0,0,0.5)',
                      transform: activeHotspot === spot.id ? 'scale(1.25)' : 'scale(1)',
                      transition: 'all 0.2s ease',
                      padding: 0,
                    }}
                  >
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>+</span>
                  </button>
                </Html>
              ))}

              <ContactShadows
                position={[0, -0.44, 0]}
                opacity={0.65}
                scale={8}
                blur={2}
                far={3}
                color="#000000"
              />
              <OrbitControls
                enableZoom={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Suspense>
          </Canvas>
        </PerformanceManager>
      </WebGLErrorBoundary>

      {/* Floating Info Card */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          right: '1rem',
          background: 'rgba(7, 23, 43, 0.92)',
          backdropFilter: 'blur(14px)',
          padding: '1rem 1.25rem',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Eye size={16} color="#22c55e" />
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#ffffff', fontWeight: 700 }}>
            {hotspots.find((h) => h.id === activeHotspot)?.title}
          </h4>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          {hotspots.find((h) => h.id === activeHotspot)?.desc}
        </p>
      </div>
    </div>
  );
}
