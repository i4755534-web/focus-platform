'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface LiquidGradientProps {
  colors: string[];
  className?: string;
}

export default function LiquidGradient({ colors, className = '' }: LiquidGradientProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-50%", "50%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.3]);

  const gradientStyle = {
    background: `linear-gradient(45deg, ${colors.join(', ')})`,
    backgroundSize: '400% 400%',
    animation: 'liquidFlow 8s ease-in-out infinite'
  };

  return (
    <>
      <style jsx>{`
        @keyframes liquidFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
      <motion.div
        ref={ref}
        className={`absolute inset-0 ${className}`}
        style={{
          ...gradientStyle,
          y,
          scale,
          opacity
        }}
      />
    </>
  );
}