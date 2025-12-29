import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text } from '@react-three/drei';

export default function Problem3D({ problemText }: { problemText: string }) {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden glass-card">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={1} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom={false} />
        <Environment preset="city" />

        {/* Текст задачи в 3D-пространстве */}
        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#6c43ff"
          anchorX="center"
          anchorY="middle"
        >
          {problemText.split('\n').map((line, i) => (
            <Text key={i} position={[0, -i * 0.6, 0]}>
              {line}
            </Text>
          ))}
        </Text>

        {/* Вращающийся академический значок */}
        <mesh position={[2, -2, 0]}>
          <torusKnotGeometry args={[0.3, 0.1, 100, 16]} />
          <meshStandardMaterial color="#00f3ff" wireframe />
        </mesh>
      </Canvas>
    </div>
  );
}