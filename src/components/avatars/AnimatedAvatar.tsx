'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getAvatarStyles } from '@/lib/avatarGenerator';

interface AnimatedAvatarProps {
  src: string;
  alt: string;
  size?: number;
  style?: 'cyberpunk' | 'watercolor' | 'mixed';
  isOnline?: boolean;
  isTyping?: boolean;
  onClick?: () => void;
}

export default function AnimatedAvatar({
  src,
  alt,
  size = 40,
  style = 'cyberpunk',
  isOnline = false,
  isTyping = false,
  onClick
}: AnimatedAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const avatarStyles = getAvatarStyles(style);

  const pulseVariants = {
    idle: { scale: 1, rotate: 0 },
    typing: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity as number,
        ease: "easeInOut" as const
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  const glowVariants = {
    idle: { boxShadow: '0 0 0 rgba(255, 0, 255, 0)' },
    online: {
      boxShadow: [
        '0 0 0 rgba(255, 0, 255, 0)',
        '0 0 20px rgba(255, 0, 255, 0.8)',
        '0 0 0 rgba(255, 0, 255, 0)'
      ],
      transition: {
        duration: 2,
        repeat: Infinity as number,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: size, height: size }}
      variants={pulseVariants}
      animate={isTyping ? 'typing' : isHovered ? 'hover' : 'idle'}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full rounded-full object-cover"
        style={avatarStyles}
        variants={glowVariants}
        animate={isOnline ? 'online' : 'idle'}
      />

      {isOnline && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {isTyping && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" />
        </motion.div>
      )}
    </motion.div>
  );
}