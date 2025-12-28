'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { Mesh } from 'three';

function RotatingCube() {
  const meshRef = useRef<Mesh>(null);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#6c43ff" />
    </mesh>
  );
}

function FloatingSpheres() {
  const spheres = [
    { position: [5, 5, 5], color: '#6c43ff' },
    { position: [-5, 5, -5], color: '#00f3ff' },
    { position: [5, -5, 5], color: '#6c43ff' },
    { position: [-5, -5, -5], color: '#00f3ff' },
    { position: [0, 10, 0], color: '#6c43ff' },
    { position: [0, -10, 0], color: '#00f3ff' },
    { position: [10, 0, 0], color: '#6c43ff' },
    { position: [-10, 0, 0], color: '#00f3ff' },
    { position: [0, 0, 10], color: '#6c43ff' },
    { position: [0, 0, -10], color: '#00f3ff' },
  ].map((sphere, i) => (
    <mesh key={i} position={sphere.position as [number, number, number]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={sphere.color} />
    </mesh>
  ));

  return <>{spheres}</>;
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
        <RotatingCube />
        <FloatingSpheres />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}