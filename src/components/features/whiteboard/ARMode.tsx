import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface Problem3DProps {
  problemData: any;
  onSolve: (solution: any) => void;
}

function Problem3D({ problemData, onSolve }: Problem3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} onClick={() => onSolve({ solved: true })}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#6c43ff" />
      </mesh>
      <Text
        position={[0, 3, 0]}
        fontSize={0.5}
        color="#00f3ff"
        anchorX="center"
        anchorY="middle"
      >
        {problemData?.title || "3D Problem"}
      </Text>
    </group>
  );
}

interface ARModeProps {
  problemData: any;
  onSolve: (solution: any) => void;
}

export const ARMode: React.FC<ARModeProps> = ({ problemData, onSolve }) => {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-[#0f0a1a] to-[#1a1133] rounded-lg overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Problem3D
          problemData={problemData}
          onSolve={onSolve}
        />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};