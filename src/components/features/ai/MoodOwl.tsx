'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Динамический импорт для производительности
const OwlIcon = dynamic(() => import('@heroicons/react/24/outline').then(mod => ({ default: mod.EyeIcon })), { ssr: false });

interface MoodOwlProps {
  messages: string[];
  onHelpRequest: (topic: string) => void;
}

export default function MoodOwl({ messages, onHelpRequest }: MoodOwlProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [detectedStress, setDetectedStress] = useState<string | null>(null);

  // Слова стресса
  const stressWords = ['не успеваю', 'стресс', 'экзамен', 'паника', 'помогите', 'сложно', 'не понимаю'];

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage) {
      const lowerMessage = latestMessage.toLowerCase();
      const foundStress = stressWords.find(word => lowerMessage.includes(word));

      if (foundStress) {
        setDetectedStress(foundStress);
        setIsGlowing(true);
        setIsVisible(true);

        // Автоматически скрыть через 10 секунд
        setTimeout(() => {
          setIsGlowing(false);
          setTimeout(() => setIsVisible(false), 2000);
        }, 10000);
      }
    }
  }, [messages]);

  const handleHelpClick = () => {
    if (detectedStress) {
      onHelpRequest(detectedStress);
      setIsGlowing(false);
      setIsVisible(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            className="relative cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleHelpClick}
            animate={isGlowing ? {
              boxShadow: [
                '0 0 20px oklch(var(--neon-primary) / 0.5)',
                '0 0 40px oklch(var(--neon-primary) / 0.8)',
                '0 0 20px oklch(var(--neon-primary) / 0.5)'
              ]
            } : {}}
            transition={{ duration: 2, repeat: isGlowing ? Infinity : 0 }}
          >
            {/* Сова */}
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white text-2xl">🦉</div>
            </div>

            {/* Глаза */}
            <div className="absolute top-3 left-4 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-3 right-4 w-2 h-2 bg-white rounded-full"></div>
            <div className="absolute top-4 left-3 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-4 right-3 w-1 h-1 bg-black rounded-full"></div>

            {/* Крылья */}
            <motion.div
              className="absolute -left-2 top-6 w-4 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full opacity-70"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute -right-2 top-6 w-4 h-6 bg-gradient-to-l from-amber-500 to-orange-500 rounded-full opacity-70"
              animate={{ rotate: [5, -5, 5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
            />

            {/* Пузырь с текстом */}
            <AnimatePresence>
              {isGlowing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -20 }}
                  className="absolute bottom-full right-0 mb-2 bg-white rounded-lg p-3 shadow-lg max-w-xs"
                >
                  <div className="text-sm text-gray-800">
                    Кажется, тебе нужна помощь с "{detectedStress}"?
                    <br />
                    <span className="text-blue-600 font-medium">Нажми на меня!</span>
                  </div>
                  <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}