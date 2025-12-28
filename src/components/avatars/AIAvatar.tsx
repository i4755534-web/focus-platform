'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function AvatarModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={0.5} />;
}

interface AIAvatarProps {
  userId: string;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  status?: 'online' | 'offline' | 'typing' | 'away';
  mood?: 'happy' | 'serious' | 'creative' | 'energetic' | 'calm';
}

interface AvatarData {
  avatarUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pattern: string;
  shape: string;
  effects: string[];
  moodExpression: string;
}

export default function AIAvatar({
  userId,
  username,
  size = 'md',
  animated = true,
  status = 'offline',
  mood = 'calm'
}: AIAvatarProps) {
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    typing: 'bg-blue-400 animate-pulse',
    away: 'bg-yellow-400'
  };

  const moodGradients = {
    happy: 'from-yellow-400 via-pink-500 to-red-500',
    serious: 'from-blue-600 via-purple-600 to-indigo-700',
    creative: 'from-purple-500 via-pink-500 to-orange-400',
    energetic: 'from-red-500 via-orange-500 to-yellow-400',
    calm: 'from-green-400 via-blue-400 to-purple-500'
  };

  // Генерация AI аватара
  const generateAvatar = async () => {
    if (avatarData) return; // Уже сгенерирован

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username,
          mood,
          style: 'cyberpunk-watercolor'
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAvatarData(data);
      }
    } catch (error) {
      console.error('Failed to generate avatar:', error);
      // Fallback to default
      setAvatarData({
        avatarUrl: undefined,
        primaryColor: '#6c43ff',
        secondaryColor: '#00f3ff',
        accentColor: '#e8d7ff',
        pattern: 'cyberpunk',
        shape: 'circle',
        effects: ['glow'],
        moodExpression: 'neutral'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateAvatar();
  }, [userId, username, mood]);

  // Рисуем аватар на canvas
  useEffect(() => {
    if (!canvasRef.current || !avatarData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Создаем градиентный фон
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, avatarData.primaryColor || '#FF00FF');
    gradient.addColorStop(0.5, avatarData.secondaryColor || '#00FFFF');
    gradient.addColorStop(1, avatarData.accentColor || '#FFFF00');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2 - 2, 0, 2 * Math.PI);
    ctx.fill();

    // Добавляем паттерн или текстуру
    if (avatarData.pattern === 'cyberpunk') {
      // Добавляем grid паттерн
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 8) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
    }

    // Добавляем инициалы
    ctx.fillStyle = 'white';
    ctx.font = `bold ${width / 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      username.charAt(0).toUpperCase(),
      width / 2,
      height / 2
    );

  }, [avatarData, username]);

  return (
    <div className="relative inline-block">
      <motion.div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white shadow-lg ${
          animated ? 'parallax-element-advanced' : ''
        }`}
        style={{
          background: avatarData
            ? `linear-gradient(135deg, ${avatarData.primaryColor}, ${avatarData.secondaryColor})`
            : `bg-gradient-to-br ${moodGradients[mood]}`,
          transformStyle: 'preserve-3d'
        }}
        whileHover={{
          scale: 1.1,
          rotateY: 15,
          rotateX: 10,
          z: 20
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {avatarData?.avatarUrl ? (
          <Canvas
            camera={{ position: [0, 0, 2], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <AvatarModel url={avatarData.avatarUrl} />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        ) : avatarData ? (
          <canvas
            ref={canvasRef}
            width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
            height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : 96}
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
            {isGenerating ? '...' : username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Анимированные частицы для статуса */}
        {status === 'typing' && animated && (
          <div className="absolute inset-0">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${20 + i * 25}%`,
                  top: '80%'
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Статус индикатор */}
      <div
        className={`absolute -bottom-1 -right-1 w-4 h-4 ${statusColors[status]} border-2 border-white rounded-full`}
      />

      {/* Неоновое свечение при наведении */}
      <div className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 to-pink-400 blur-md scale-110" />
      </div>
    </div>
  );
}