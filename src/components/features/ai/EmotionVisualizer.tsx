import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface EmotionData {
  type: 'joy' | 'sadness' | 'anger' | 'fear' | 'surprise' | 'calm';
  intensity: number;
  color: string;
  icon: string;
}

interface EmotionVisualizerProps {
  messageId: string;
  emotions: EmotionData[];
}

export const EmotionVisualizer: React.FC<EmotionVisualizerProps> = ({ messageId, emotions }) => {
  const [visibleEmotions, setVisibleEmotions] = useState<EmotionData[]>([]);

  useEffect(() => {
    // Анимируем появление эмоций
    const timer = setTimeout(() => {
      setVisibleEmotions(emotions);
    }, 500);

    return () => clearTimeout(timer);
  }, [emotions]);

  return (
    <div className="flex space-x-1 mt-2">
      {visibleEmotions.map((emotion, index) => (
        <motion.div
          key={`${messageId}-${emotion.type}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: index * 0.1,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className={`emotion-badge ${emotion.type}`}
          style={{
            backgroundColor: emotion.color,
            boxShadow: `0 0 ${emotion.intensity * 10}px ${emotion.color}40`
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -10, 10, 0],
            transition: { duration: 0.3 }
          }}
        >
          <span className="text-sm">{emotion.icon}</span>
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 0 0 ${emotion.color}40`,
                `0 0 0 8px ${emotion.color}00`,
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};