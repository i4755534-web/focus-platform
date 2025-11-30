'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { VRButton, XR, Controllers, Hands } from '@react-three/xr';
import { OrbitControls, Text, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { Avatar3D } from './Avatar3D';
import { VRControls } from './VRControls';

interface VRChatProps {
  users: Array<{
    id: string;
    name: string;
    position: [number, number, number];
    avatar?: string;
  }>;
  onVoiceMessage?: (audioData: ArrayBuffer) => void;
  onGesture?: (gesture: string) => void;
}

const VRScene: React.FC<VRChatProps> = ({ users, onVoiceMessage, onGesture }) => {
  const { gl } = useThree();
  const audioListener = useRef<THREE.AudioListener>(new THREE.AudioListener());

  useEffect(() => {
    gl.setClearColor('#87CEEB');
    audioListener.current.setMasterVolume(1);
  }, [gl]);

  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#4a5568" />
      </mesh>

      {/* Users' avatars */}
      {users.map((user) => (
        <Avatar3D
          key={user.id}
          user={user}
          audioListener={audioListener.current}
          onVoiceMessage={onVoiceMessage}
        />
      ))}

      {/* VR Controls */}
      <VRControls onGesture={onGesture} />

      {/* Controllers and Hands for VR interaction */}
      <Controllers />
      <Hands />
    </>
  );
};

const FallbackScene: React.FC<VRChatProps> = ({ users }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-2xl font-bold mb-4">VR Chat</h2>
        <p className="mb-4">VR не поддерживается на этом устройстве</p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {users.map((user) => (
            <div key={user.id} className="bg-white/20 rounded-lg p-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
              <p className="text-sm">{user.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const VRChat: React.FC<VRChatProps> = (props) => {
  const [isVRSupported, setIsVRSupported] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then(setIsVRSupported);
    } else {
      setIsVRSupported(false);
    }
  }, []);

  if (isVRSupported === null) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Проверка поддержки VR...</div>
      </div>
    );
  }

  if (!isVRSupported) {
    return <FallbackScene {...props} />;
  }

  return (
    <div className="w-full h-full relative">
      <VRButton className="absolute top-4 left-4 z-10" />
      <Canvas
        camera={{ position: [0, 1.6, 3], fov: 75 }}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <XR>
          <VRScene {...props} />
        </XR>
      </Canvas>
    </div>
  );
};