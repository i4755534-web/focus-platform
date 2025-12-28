'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Generate particles
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? '#6c43ff' : '#00f3ff',
          duration: 2 + Math.random() * 2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - particle.x, 2) +
          Math.pow(mousePosition.y - particle.y, 2)
        );

        const attraction = Math.max(0, 200 - distance) / 200;
        const newX = particle.x + (mousePosition.x - particle.x) * attraction * 0.02;
        const newY = particle.y + (mousePosition.y - particle.y) * attraction * 0.02;

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            animate={{
              x: newX,
              y: newY,
              scale: [1, 1.2, 1],
            }}
            transition={{
              x: { type: 'spring', stiffness: 100, damping: 20 },
              y: { type: 'spring', stiffness: 100, damping: 20 },
              scale: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            initial={{
              x: particle.x,
              y: particle.y,
            }}
          />
        );
      })}
    </div>
  );
}