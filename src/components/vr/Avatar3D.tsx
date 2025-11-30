'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface User {
  id: string;
  name: string;
  position: [number, number, number];
  avatar?: string;
}

interface Avatar3DProps {
  user: User;
  audioListener: THREE.AudioListener;
  onVoiceMessage?: (audioData: ArrayBuffer) => void;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({ user, audioListener, onVoiceMessage }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const audioRef = useRef<THREE.PositionalAudio | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Initialize positional audio
    if (meshRef.current) {
      const positionalAudio = new THREE.PositionalAudio(audioListener);
      audioRef.current = positionalAudio;
      meshRef.current.add(positionalAudio);
    }

    // Setup microphone access for voice chat
    const setupMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioStream(stream);

        if (audioRef.current) {
          const audioSource = audioListener.context.createMediaStreamSource(stream);
          audioRef.current.setNodeSource(audioSource);
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    setupMicrophone();

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioListener]);

  useFrame((state) => {
    if (meshRef.current) {
      // Simple animation: bobbing when speaking
      if (isSpeaking) {
        meshRef.current.position.y = user.position[1] + Math.sin(state.clock.elapsedTime * 5) * 0.05;
      } else {
        meshRef.current.position.y = user.position[1];
      }

      // Update position
      meshRef.current.position.x = user.position[0];
      meshRef.current.position.z = user.position[2];
    }
  });

  const handlePointerOver = () => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1.1);
    }
  };

  const handlePointerOut = () => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
    }
  };

  return (
    <group position={user.position}>
      {/* Avatar body */}
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.5, 1.8, 0.3]} />
        <meshStandardMaterial
          color={isSpeaking ? '#ff6b6b' : '#4ecdc4'}
          emissive={isSpeaking ? '#ff6b6b' : '#000000'}
          emissiveIntensity={isSpeaking ? 0.2 : 0}
        />
      </mesh>

      {/* Avatar head */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#fdbcb4" />
      </mesh>

      {/* Name tag */}
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-black/70 text-white px-2 py-1 rounded text-sm pointer-events-none">
          {user.name}
        </div>
      </Html>

      {/* Voice indicator */}
      {isSpeaking && (
        <mesh position={[0, 2, 0]}>
          <ringGeometry args={[0.3, 0.4, 16]} />
          <meshBasicMaterial color="#ff6b6b" transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  );
};