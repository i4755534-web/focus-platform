import { useState, useEffect, useCallback } from 'react';
import { useAI } from './useAI';

interface MoodAnalysis {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  mood: 'joyful' | 'serious' | 'creative' | 'relaxed' | 'energetic';
  intensity: number;
}

interface MoodTheme {
  background: string;
  gradients: string[];
  animations: string[];
}

export const useMoodAnalysis = (chatId?: string) => {
  const [currentMood, setCurrentMood] = useState<MoodAnalysis>({
    primaryColor: '#FF00FF',
    secondaryColor: '#00FFFF',
    accentColor: '#FFFF00',
    mood: 'energetic',
    intensity: 0.7
  });

  const [theme, setTheme] = useState<MoodTheme>({
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    gradients: [],
    animations: []
  });

  const { analyzeSentiment } = useAI();

  const analyzeChatMood = useCallback(async (messages: string[]) => {
    if (!messages.length) return;

    try {
      const sentiments = await Promise.all(
        messages.slice(-10).map(msg => analyzeSentiment(msg))
      );

      const avgSentiment = sentiments.reduce((acc, s) => acc + s.score, 0) / sentiments.length;
      const avgMagnitude = sentiments.reduce((acc, s) => acc + s.magnitude, 0) / sentiments.length;

      // Определяем настроение на основе анализа
      let mood: MoodAnalysis['mood'] = 'relaxed';
      let primaryColor = '#FF00FF';
      let secondaryColor = '#00FFFF';
      let accentColor = '#FFFF00';

      if (avgSentiment > 0.3) {
        mood = 'joyful';
        primaryColor = '#FF6B6B';
        secondaryColor = '#4ECDC4';
        accentColor = '#FFE66D';
      } else if (avgSentiment < -0.3) {
        mood = 'serious';
        primaryColor = '#2C3E50';
        secondaryColor = '#34495E';
        accentColor = '#E74C3C';
      } else if (avgMagnitude > 0.7) {
        mood = 'energetic';
        primaryColor = '#E91E63';
        secondaryColor = '#9C27B0';
        accentColor = '#FFC107';
      } else {
        mood = 'creative';
        primaryColor = '#00BCD4';
        secondaryColor = '#009688';
        accentColor = '#8BC34A';
      }

      const intensity = Math.min(avgMagnitude, 1);

      setCurrentMood({
        primaryColor,
        secondaryColor,
        accentColor,
        mood,
        intensity
      });

      // Генерируем тему на основе настроения
      generateTheme(primaryColor, secondaryColor, accentColor, mood, intensity);

    } catch (error) {
      console.error('Mood analysis failed:', error);
    }
  }, [analyzeSentiment]);

  const generateTheme = useCallback((
    primary: string,
    secondary: string,
    accent: string,
    mood: string,
    intensity: number
  ) => {
    const gradients = [
      `linear-gradient(45deg, ${primary}, ${secondary})`,
      `radial-gradient(circle, ${primary}20, ${secondary}20)`,
      `conic-gradient(from 0deg, ${primary}, ${accent}, ${secondary})`
    ];

    const animations = [
      intensity > 0.5 ? 'liquid-flow 3s ease infinite' : 'none',
      mood === 'energetic' ? 'parallax-float 2s ease-in-out infinite' : 'none'
    ];

    const background = `linear-gradient(135deg,
      ${primary}10 0%,
      ${secondary}15 50%,
      ${accent}05 100%)`;

    setTheme({
      background,
      gradients,
      animations: animations.filter(a => a !== 'none')
    });

    // Применяем CSS переменные
    document.documentElement.style.setProperty('--mood-primary', primary);
    document.documentElement.style.setProperty('--mood-secondary', secondary);
    document.documentElement.style.setProperty('--mood-accent', accent);
    document.documentElement.style.setProperty('--mood-intensity', intensity.toString());
  }, []);

  // Анализ времени суток для автоматической адаптации
  useEffect(() => {
    const updateTimeBasedMood = () => {
      const hour = new Date().getHours();
      let timeMood = 'night';

      if (hour >= 6 && hour < 12) timeMood = 'dawn';
      else if (hour >= 12 && hour < 18) timeMood = 'day';
      else if (hour >= 18 && hour < 21) timeMood = 'dusk';
      else timeMood = 'night';

      document.documentElement.setAttribute('data-time-mood', timeMood);
    };

    updateTimeBasedMood();
    const interval = setInterval(updateTimeBasedMood, 60000); // Каждую минуту

    return () => clearInterval(interval);
  }, []);

  return {
    currentMood,
    theme,
    analyzeChatMood,
    setMood: setCurrentMood
  };
};