'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  duration: number;
}

export default function StarField() {
  const { isNightMode } = useDeviceOrientation();
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    if (isNightMode) {
      const newStars: Star[] = [];
      for (let i = 0; i < 100; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          brightness: Math.random() * 0.8 + 0.2,
          duration: 2 + Math.random() * 3,
        });
      }
      setStars(newStars);
    } else {
      setStars([]);
    }
  }, [isNightMode]);

  if (!isNightMode) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.brightness,
          }}
          animate={{
            opacity: [star.brightness, star.brightness * 1.5, star.brightness],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}