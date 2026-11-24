import React from 'react';

/**
 * LightingSystem
 * Studio 3-point lighting setup with soft environmental key light, rim specular reflections,
 * and ambient road bounce for automotive and prop scenes.
 */
export default function LightingSystem({ intensity = 1, showGrid = false }) {
  return (
    <>
      {/* Ambient Fill */}
      <ambientLight intensity={0.45 * intensity} />

      {/* Main Studio Key Light */}
      <directionalLight
        position={[6, 8, 5]}
        intensity={1.2 * intensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={25}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />

      {/* Cool Sky Fill */}
      <directionalLight position={[-6, 6, -4]} intensity={0.5 * intensity} color="#93c5fd" />

      {/* Clean White Specular Rim Light */}
      <spotLight
        position={[0, 10, -8]}
        intensity={0.8 * intensity}
        angle={0.6}
        penumbra={0.8}
        color="#ffffff"
      />

      {/* Ground road bounce light */}
      <pointLight position={[0, -2, 2]} intensity={0.3 * intensity} color="#22c55e" />

      {showGrid && (
        <gridHelper
          args={[20, 20, '#1B6C31', '#0d2645']}
          position={[0, -1.01, 0]}
        />
      )}
    </>
  );
}
