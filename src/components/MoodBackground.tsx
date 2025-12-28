'use client';

import { useEffect } from 'react';
import { useMoodAnalysis } from '@/hooks/useMoodAnalysis';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';

interface MoodBackgroundProps {
  children: React.ReactNode;
}

export default function MoodBackground({ children }: MoodBackgroundProps) {
  const { currentMood, theme } = useMoodAnalysis();
  const { currentScheme } = useAdaptiveColors();

  useEffect(() => {
    // Применяем mood-based градиенты к body
    const moodGradients = {
      joyful: 'linear-gradient(135deg, #FFE5B4 0%, #FFB74D 25%, #FF9800 50%, #FF6B35 75%, #E91E63 100%)',
      serious: 'linear-gradient(135deg, #263238 0%, #37474F 25%, #455A64 50%, #546E7A 75%, #607D8B 100%)',
      creative: 'linear-gradient(135deg, #4A148C 0%, #6A1B9A 25%, #8E24AA 50%, #BA68C8 75%, #E1BEE7 100%)',
      relaxed: 'linear-gradient(135deg, #00695C 0%, #00897B 25%, #26A69A 50%, #4DB6AC 75%, #80CBC4 100%)',
      energetic: 'linear-gradient(135deg, #BF360C 0%, #D84315 25%, #E64A19 50%, #F4511E 75%, #FF5722 100%)'
    };

    const selectedGradient = moodGradients[currentMood.mood] || moodGradients.energetic;

    // Применяем к body как фоновый слой
    document.body.style.background = `
      ${selectedGradient},
      ${currentScheme.background}
    `;
    document.body.style.backgroundSize = '400% 400%, 200% 200%';
    document.body.style.backgroundBlendMode = 'multiply, normal';
    document.body.style.animation = 'gradient-shift 20s ease infinite, liquid-flow 30s ease-in-out infinite';

    // Сохраняем в CSS переменные для использования в компонентах
    document.documentElement.style.setProperty('--mood-gradient', selectedGradient);
    document.documentElement.style.setProperty('--mood-intensity', currentMood.intensity.toString());

  }, [currentMood, currentScheme.background]);

  return (
    <>
      {/* Дополнительный слой с theme градиентами */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: theme.background,
          opacity: 0.3,
          mixBlendMode: 'overlay'
        }}
      />
      {/* Основной контент */}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}