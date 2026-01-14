'use client';

import { motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  letter?: string;
  originalX: number;
  originalY: number;
}

// Function to generate particles forming "FOCUS"
const generateFocusParticles = (): Particle[] => {
  const letters = ['F', 'O', 'C', 'U', 'S'];
  const particles: Particle[] = [];
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const spacing = 100;

  letters.forEach((letter, index) => {
    const baseX = centerX - (letters.length - 1) * spacing / 2 + index * spacing;
    const baseY = centerY - 50;

    // Create multiple particles per letter
    for (let i = 0; i < 10; i++) {
      particles.push({
        id: index * 10 + i,
        x: baseX + (Math.random() - 0.5) * 80,
        y: baseY + (Math.random() - 0.5) * 80,
        originalX: baseX + (Math.random() - 0.5) * 80,
        originalY: baseY + (Math.random() - 0.5) * 80,
        size: Math.random() * 3 + 1,
        color: Math.random() > 0.5 ? '#6c43ff' : '#00f3ff',
        duration: 2 + Math.random() * 2,
        letter,
      });
    }
  });

  return particles;
};

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setParticles(generateFocusParticles());
    }
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particles.length]);

  if (particles.length === 0) {
    return null; // Don't render until particles are generated
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => {
        const distance = Math.sqrt(
          Math.pow(mousePosition.x - particle.originalX, 2) +
          Math.pow(mousePosition.y - particle.originalY, 2)
        );

        const repulsion = Math.max(0, 150 - distance) / 150;
        const scatterX = (particle.originalX - mousePosition.x) * repulsion * 2;
        const scatterY = (particle.originalY - mousePosition.y) * repulsion * 2;

        const newX = particle.originalX + scatterX;
        const newY = particle.originalY + scatterY;

        return (
          <motion.div
            key={particle.id}
            className="absolute flex items-center justify-center text-white font-bold"
            style={{
              width: particle.size * 10,
              height: particle.size * 10,
              fontSize: particle.size * 5,
              color: particle.color,
              textShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
            animate={{
              x: newX,
              y: newY,
              scale: [1, 1.5, 1],
            }}
            transition={{
              x: { type: 'spring', stiffness: 200, damping: 25 },
              y: { type: 'spring', stiffness: 200, damping: 25 },
              scale: {
                duration: particle.duration,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            initial={{
              x: particle.originalX,
              y: particle.originalY,
            }}
          >
            {particle.letter}
          </motion.div>
        );
      })}
    </div>
  );
}