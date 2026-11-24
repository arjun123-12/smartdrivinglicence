import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Procedural Detailed Driving School Sedan Model
 * Features:
 * - PBR Physical metallic clearcoat car body
 * - Glass windshield and tinted windows
 * - Dual chrome alloy wheels with rotating rims
 * - Dual LED headlights & taillights
 * - Illuminated roof-top Driving School "A1" sign
 * - South Australian "A1-SMART" licence plates
 */
export default function CarModel({
  color = '#ffffff',
  isRotating = true,
  turnAngle = 0,
  ...props
}) {
  const groupRef = useRef();
  const wheelsRef = useRef([]);

  // Spin wheels smoothly to simulate driving
  useFrame((_, delta) => {
    if (isRotating) {
      wheelsRef.current.forEach((wheel) => {
        if (wheel) wheel.rotation.x += delta * 4;
      });
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      {/* 1. MAIN CAR CHASSIS */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.9, 0.5, 4.2]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* 2. CABIN & ROOF (AERODYNAMIC GREENHOUSE) */}
      <mesh position={[0, 0.95, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.55, 2.3]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* 3. WINDSHIELD & WINDOWS (TINTED GLASS) */}
      {/* Front Windshield */}
      <mesh position={[0, 0.92, 0.96]} rotation={[0.42, 0, 0]}>
        <boxGeometry args={[1.52, 0.52, 0.08]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.05}
          transmission={0.65}
          thickness={0.5}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Rear Windshield */}
      <mesh position={[0, 0.92, -1.36]} rotation={[-0.42, 0, 0]}>
        <boxGeometry args={[1.52, 0.52, 0.08]} />
        <meshPhysicalMaterial
          color="#0f172a"
          roughness={0.05}
          transmission={0.65}
          thickness={0.5}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Side Windows */}
      <mesh position={[0, 0.95, -0.2]}>
        <boxGeometry args={[1.63, 0.46, 2.1]} />
        <meshPhysicalMaterial
          color="#020617"
          roughness={0.1}
          transmission={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 4. ROOF DRIVING SCHOOL SIGN (ILLUMINATED TOPPER) */}
      <group position={[0, 1.34, -0.15]}>
        {/* Base bracket */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[0.5, 0.04, 0.4]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
        {/* Glowing Sign Shell */}
        <mesh castShadow>
          <boxGeometry args={[1.05, 0.22, 0.35]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.25}
            roughness={0.3}
          />
        </mesh>
        {/* A1 L-Plate Emblem */}
        <mesh position={[0, 0, 0.181]}>
          <planeGeometry args={[0.9, 0.16]} />
          <meshBasicMaterial color="#1B6C31" />
        </mesh>
      </group>

      {/* 5. FRONT BUMPER, GRILLE & HEADLIGHTS */}
      <mesh position={[0, 0.32, 2.12]}>
        <boxGeometry args={[1.75, 0.25, 0.15]} />
        <meshStandardMaterial color="#020617" roughness={0.5} />
      </mesh>
      {/* Chrome Grille Accent */}
      <mesh position={[0, 0.44, 2.12]}>
        <boxGeometry args={[1.1, 0.12, 0.05]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Left Headlight */}
      <mesh position={[-0.68, 0.48, 2.1]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e0f2fe"
          emissiveIntensity={1.8}
        />
      </mesh>
      {/* Right Headlight */}
      <mesh position={[0.68, 0.48, 2.1]}>
        <boxGeometry args={[0.35, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#e0f2fe"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* 6. REAR TAILLIGHTS */}
      <mesh position={[-0.68, 0.52, -2.12]}>
        <boxGeometry args={[0.36, 0.14, 0.08]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#ef4444"
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0.68, 0.52, -2.12]}>
        <boxGeometry args={[0.36, 0.14, 0.08]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#ef4444"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* 7. SOUTH AUSTRALIA NUMBER PLATES */}
      {/* Front Plate */}
      <mesh position={[0, 0.28, 2.21]}>
        <boxGeometry args={[0.55, 0.14, 0.02]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Rear Plate */}
      <mesh position={[0, 0.35, -2.17]}>
        <boxGeometry args={[0.55, 0.14, 0.02]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>

      {/* 8. DUAL SIDE MIRRORS */}
      <mesh position={[-0.98, 0.78, 0.7]}>
        <boxGeometry args={[0.22, 0.12, 0.16]} />
        <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh position={[0.98, 0.78, 0.7]}>
        <boxGeometry args={[0.22, 0.12, 0.16]} />
        <meshPhysicalMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* 9. WHEELS & ALLOY RIMS */}
      {[
        [-0.96, 0.28, 1.25, 0],   // Front Left
        [0.96, 0.28, 1.25, 1],    // Front Right
        [-0.96, 0.28, -1.25, 2],  // Rear Left
        [0.96, 0.28, -1.25, 3],   // Rear Right
      ].map(([x, y, z, index]) => (
        <group
          key={index}
          position={[x, y, z]}
          rotation={[0, x > 0 ? 0 : Math.PI, 0]}
          ref={(el) => (wheelsRef.current[index] = el)}
        >
          {/* Rubber Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.24, 24]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>
          {/* Chrome Alloy Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0, 0]}>
            <cylinderGeometry args={[0.23, 0.23, 0.25, 16]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.15} />
          </mesh>
          {/* Wheel Hub Center Cap */}
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0.13, 0, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.05, 12]} />
            <meshStandardMaterial color="#1B6C31" metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
