import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { use3DPerformance } from '../../hooks/use3DPerformance';

/**
 * Procedural undulating road particles and speed streaks
 */
function ParticleField({ count = 200, isMobile = false }) {
  const pointsRef = useRef();
  const speedRef = useRef(0.003);
  const targetSpeedRef = useRef(0.003);

  // Generate particle coordinates along a 3D curving road corridor
  const [positions, colors] = useMemo(() => {
    const actualCount = isMobile ? Math.min(count, 80) : count;
    const pos = new Float32Array(actualCount * 3);
    const col = new Float32Array(actualCount * 3);

    const greenColor = new THREE.Color('#22c55e');
    const whiteColor = new THREE.Color('#ffffff');

    for (let i = 0; i < actualCount; i++) {
      // Scatter in a forward-stretching tunnel corridor
      const x = (Math.random() - 0.5) * 18;
      const y = (Math.random() - 0.5) * 8 - 1;
      const z = (Math.random() - 0.5) * 35;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Color variation between A1 Green and Crisp White
      const r = Math.random();
      const chosenColor = r < 0.5 ? greenColor : whiteColor;
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }

    return [pos, col];
  }, [count, isMobile]);

  // Accelerate particles during scroll
  useEffect(() => {
    let lastScroll = window.scrollY;
    let timeout;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const delta = Math.abs(currentScroll - lastScroll);
      lastScroll = currentScroll;

      // Temporary speed burst on scroll
      targetSpeedRef.current = 0.003 + Math.min(delta * 0.0008, 0.04);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        targetSpeedRef.current = 0.003;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    // Smooth speed lerp
    speedRef.current += (targetSpeedRef.current - speedRef.current) * 0.1;

    const positionsArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < positionsArray.length; i += 3) {
      positionsArray[i + 2] += speedRef.current * 10;
      // Loop back when reaching camera
      if (positionsArray[i + 2] > 15) {
        positionsArray[i + 2] = -20;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isMobile ? 0.08 : 0.12}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * GlobalAtmosphere Component
 * Ambient background WebGL canvas that renders a subtle particle road tunnel across the site.
 */
export default function GlobalAtmosphere() {
  const prefersReducedMotion = useReducedMotion();
  const { isSupported, isMobile, dpr } = use3DPerformance();

  if (prefersReducedMotion || !isSupported) {
    return null;
  }

  return (
    <div className="global-3d-background-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 1, 10], fov: 60 }}
        dpr={dpr}
        gl={{
          antialias: false,
          powerPreference: 'low-power',
          stencil: false,
          depth: false,
        }}
      >
        <ParticleField isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
