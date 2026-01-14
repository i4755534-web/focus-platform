'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface ContextualTransitionProps {
  isActive: boolean;
  direction: 'chat-to-call' | 'call-to-board' | 'board-to-chat' | 'default';
  children: ReactNode;
  className?: string;
}

const transitionVariants = {
  'chat-to-call': {
    initial: { scale: 0.8, rotateY: -90, opacity: 0 },
    animate: { scale: 1, rotateY: 0, opacity: 1 },
    exit: { scale: 0.8, rotateY: 90, opacity: 0 },
  },
  'call-to-board': {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 },
  },
  'board-to-chat': {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 },
  },
  'default': {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

export function ContextualTransition({
  isActive,
  direction,
  children,
  className = ''
}: ContextualTransitionProps) {
  const variants = transitionVariants[direction] || transitionVariants.default;

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: 0.6,
            ease: "easeInOut",
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          className={`fixed inset-0 z-50 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook for managing transition state
export function useContextualTransition() {
  const [currentTransition, setCurrentTransition] = useState<{
    isActive: boolean;
    direction: ContextualTransitionProps['direction'];
  }>({
    isActive: false,
    direction: 'default',
  });

  const startTransition = (direction: ContextualTransitionProps['direction']) => {
    setCurrentTransition({ isActive: true, direction });
  };

  const endTransition = () => {
    setCurrentTransition((prev: { isActive: boolean; direction: ContextualTransitionProps['direction'] }) => ({ ...prev, isActive: false }));
  };

  return {
    currentTransition,
    startTransition,
    endTransition,
  };
}