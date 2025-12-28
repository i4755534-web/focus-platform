/* eslint-disable */

'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface WavePointProps {
  position: [number, number, number];
  amplitude: number;
  color: string;
}

function WavePoint({ position, amplitude, color }: WavePointProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + position[0]) * amplitude;
      meshRef.current.position.z = position[2] + Math.cos(time * 1.5 + position[0]) * amplitude * 0.5;
      meshRef.current.scale.setScalar(1 + Math.sin(time * 3 + position[0]) * 0.3);

      // 3D rotation for more depth
      meshRef.current.rotation.x = Math.sin(time + position[0]) * 0.2;
      meshRef.current.rotation.y = Math.cos(time + position[0]) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.08, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

interface VoiceMessageVisualizationProps {
  audioBlob?: Blob;
  duration?: number;
  isPlaying?: boolean;
  onEmotionDetected?: (emotion: string) => void;
}

export default function VoiceMessageVisualization({
  audioBlob,
  duration = 10,
  isPlaying = false,
  onEmotionDetected
}: VoiceMessageVisualizationProps) {
  const [emotion, setEmotion] = useState('neutral');
  const [waveData, setWaveData] = useState<number[]>([]);

  const analyzeVoiceEmotion = async (blob: Blob) => {
    try {
      // In real implementation, convert blob to base64 and send to OpenAI
      // For now, simulate with random emotion
      const emotions = ['excited', 'calm', 'angry', 'sad', 'neutral'];
      const detectedEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setEmotion(detectedEmotion);
      onEmotionDetected?.(detectedEmotion);
    } catch (error) {
      console.error('Voice emotion analysis failed:', error);
    }
  };

  // Simulate wave data - in real implementation, analyze audio
  const wavePoints = useMemo(() => {
    const points = [];
    const emotionColors = {
      excited: '#FF00FF',
      calm: '#00FFFF',
      angry: '#FF6B6B',
      sad: '#4A90E2',
      neutral: '#FFFFFF'
    };

    for (let i = 0; i < 50; i++) {
      points.push({
        position: [i * 0.1 - 2.5, 0, Math.sin(i * 0.2) * 0.5] as [number, number, number],
        amplitude: Math.random() * 0.5 + 0.2,
        color: emotionColors[emotion as keyof typeof emotionColors] || '#FFFFFF'
      });
    }
    return points;
  }, [emotion]);

  // 3D Background particles
  const backgroundParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ] as [number, number, number],
        size: Math.random() * 0.02 + 0.01
      });
    }
    return particles;
  }, []);

  useEffect(() => {
    if (audioBlob) {
      // Simulate emotion analysis
      analyzeVoiceEmotion(audioBlob);
    }
  }, [audioBlob]);

  return (
    <div className="w-full h-32 bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-pink-900/30 rounded-lg overflow-hidden relative">
      <Canvas
        camera={{
          position: [0, 2, 6],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced lighting for 3D depth */}
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 5]} intensity={1} color="#FF00FF" />
        <pointLight position={[5, 5, 5]} intensity={0.5} color="#00FFFF" />
        <pointLight position={[-5, -5, 5]} intensity={0.3} color="#FFFF00" />

        {/* Background particles for atmosphere */}
        {backgroundParticles.map((particle, index) => (
          <mesh key={`bg-${index}`} position={particle.position}>
            <sphereGeometry args={[particle.size, 4, 4]} />
            <meshBasicMaterial
              color="#FFFFFF"
              transparent
              opacity={0.1}
            />
          </mesh>
        ))}

        {wavePoints.map((point, index) => (
          <WavePoint
            key={index}
            position={point.position}
            amplitude={point.amplitude}
            color={point.color}
          />
        ))}
      </Canvas>

      {/* Enhanced emotion indicator with 3D effect */}
      <div className="absolute top-2 right-2 text-xs text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 shadow-lg">
        <span className="font-semibold tracking-wide">{emotion.toUpperCase()}</span>
      </div>

      {/* 3D depth indicator */}
      <div className="absolute bottom-2 left-2 text-xs text-white/60">
        3D VOICE WAVE
      </div>
    </div>
  );
}