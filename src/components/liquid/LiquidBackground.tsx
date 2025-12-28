/* eslint-disable */

'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Mesh, Vector3, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMoodAnalyzer } from '@/hooks/useMoodAnalyzer';

interface LiquidParticleProps {
  position: [number, number, number];
  color: string;
}

function LiquidParticle({ position, color }: LiquidParticleProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.01;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
    </mesh>
  );
}

interface LiquidBackgroundProps {
  moodColors?: string[];
}

export default function LiquidBackground({ moodColors: propMoodColors = ['#FF00FF', '#00FFFF', '#FF6B6B'] }: LiquidBackgroundProps) {
  const { moodAnalysis } = useMoodAnalyzer();
  const moodColors = moodAnalysis.colors.length > 0 ? moodAnalysis.colors : propMoodColors;
  const particles = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const temp = [];
    for (let i = 0; i < 50; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      temp.push({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10
        ] as [number, number, number],
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        color: moodColors[Math.floor(Math.random() * moodColors.length)]
      });
    }
    return temp;
  }, [moodColors]);

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {particles.map((particle, index) => (
          <LiquidParticle key={index} position={particle.position} color={particle.color} />
        ))}
      </Canvas>
    </div>
  );
}