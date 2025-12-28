import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface UserBehavior {
  activeHours: number[];
  preferredColors: string[];
  contentType: 'chat' | 'work' | 'social' | 'learning';
  activityLevel: 'low' | 'medium' | 'high';
}

interface AdaptiveColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  mood: 'calm' | 'energetic' | 'creative' | 'focused' | 'social';
}

export const useAdaptiveColors = () => {
  const { user } = useAuth();
  const [currentScheme, setCurrentScheme] = useState<AdaptiveColorScheme>({
    primary: '#FF00FF',
    secondary: '#00FFFF',
    accent: '#FFFF00',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    surface: 'oklch(0.15 0.05 240)',
    text: 'oklch(0.95 0.02 0)',
    mood: 'energetic'
  });

  const [userBehavior, setUserBehavior] = useState<UserBehavior>({
    activeHours: [],
    preferredColors: [],
    contentType: 'chat',
    activityLevel: 'medium'
  });

  // Анализ времени суток
  const getTimeBasedColors = useCallback((hour: number): Partial<AdaptiveColorScheme> => {
    if (hour >= 6 && hour < 12) {
      // Утро - свежие, бодрящие цвета
      return {
        primary: '#FF6B35', // Warm orange
        secondary: '#F7931E', // Golden yellow
        accent: '#FFD23F', // Bright yellow
        background: 'linear-gradient(135deg, #FFE5B4 0%, #FFB74D 50%, #FF8F00 100%)',
        mood: 'energetic'
      };
    } else if (hour >= 12 && hour < 18) {
      // День - продуктивные, свежие цвета
      return {
        primary: '#4CAF50', // Green
        secondary: '#81C784', // Light green
        accent: '#FFC107', // Amber
        background: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 50%, #A5D6A7 100%)',
        mood: 'focused'
      };
    } else if (hour >= 18 && hour < 21) {
      // Вечер - расслабляющие цвета
      return {
        primary: '#9C27B0', // Purple
        secondary: '#BA68C8', // Light purple
        accent: '#FF9800', // Orange
        background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 50%, #CE93D8 100%)',
        mood: 'calm'
      };
    } else {
      // Ночь - глубокие, творческие цвета
      return {
        primary: '#3F51B5', // Indigo
        secondary: '#7986CB', // Light indigo
        accent: '#00BCD4', // Cyan
        background: 'linear-gradient(135deg, #1A237E 0%, #3949AB 50%, #5E35B1 100%)',
        mood: 'creative'
      };
    }
  }, []);

  // Анализ типа контента
  const getContentBasedColors = useCallback((contentType: string): Partial<AdaptiveColorScheme> => {
    switch (contentType) {
      case 'work':
        return {
          primary: '#1976D2', // Blue
          secondary: '#42A5F5', // Light blue
          accent: '#FF5722', // Deep orange
          mood: 'focused'
        };
      case 'learning':
        return {
          primary: '#388E3C', // Green
          secondary: '#66BB6A', // Light green
          accent: '#FFEB3B', // Yellow
          mood: 'focused'
        };
      case 'social':
        return {
          primary: '#E91E63', // Pink
          secondary: '#F48FB1', // Light pink
          accent: '#FFC107', // Amber
          mood: 'social'
        };
      case 'chat':
      default:
        return {
          primary: '#FF00FF', // Magenta
          secondary: '#00FFFF', // Cyan
          accent: '#FFFF00', // Yellow
          mood: 'energetic'
        };
    }
  }, []);

  // Анализ уровня активности
  const getActivityBasedColors = useCallback((activityLevel: string): Partial<AdaptiveColorScheme> => {
    switch (activityLevel) {
      case 'high':
        return {
          primary: '#FF1744', // Red accent
          secondary: '#FF8A80', // Light red
          accent: '#FFD740', // Yellow accent
          mood: 'energetic'
        };
      case 'low':
        return {
          primary: '#26A69A', // Teal
          secondary: '#80CBC4', // Light teal
          accent: '#B2DFDB', // Very light teal
          mood: 'calm'
        };
      case 'medium':
      default:
        return {
          primary: '#FF9800', // Orange
          secondary: '#FFB74D', // Light orange
          accent: '#FFCC02', // Gold
          mood: 'creative'
        };
    }
  }, []);

  // Основная функция адаптации цветов
  const adaptColors = useCallback(() => {
    const now = new Date();
    const hour = now.getHours();

    // Получаем базовые цвета по времени суток
    const timeColors = getTimeBasedColors(hour);

    // Получаем цвета по типу контента
    const contentColors = getContentBasedColors(userBehavior.contentType);

    // Получаем цвета по уровню активности
    const activityColors = getActivityBasedColors(userBehavior.activityLevel);

    // Комбинируем цвета с приоритетами
    const adaptedScheme: AdaptiveColorScheme = {
      primary: contentColors.primary || timeColors.primary || currentScheme.primary,
      secondary: activityColors.secondary || timeColors.secondary || currentScheme.secondary,
      accent: timeColors.accent || contentColors.accent || currentScheme.accent,
      background: timeColors.background || currentScheme.background,
      surface: currentScheme.surface,
      text: currentScheme.text,
      mood: contentColors.mood || timeColors.mood || activityColors.mood || currentScheme.mood
    };

    setCurrentScheme(adaptedScheme);

    // Применяем CSS переменные
    document.documentElement.style.setProperty('--adaptive-primary', adaptedScheme.primary);
    document.documentElement.style.setProperty('--adaptive-secondary', adaptedScheme.secondary);
    document.documentElement.style.setProperty('--adaptive-accent', adaptedScheme.accent);
    document.documentElement.style.setProperty('--adaptive-mood', adaptedScheme.mood);

  }, [userBehavior, getTimeBasedColors, getContentBasedColors, getActivityBasedColors, currentScheme]);

  // Обновление поведения пользователя
  const updateUserBehavior = useCallback((updates: Partial<UserBehavior>) => {
    setUserBehavior(prev => ({ ...prev, ...updates }));
  }, []);

  // Эффект для периодической адаптации
  useEffect(() => {
    // Адаптируем цвета каждые 30 минут
    const interval = setInterval(() => {
      adaptColors();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [adaptColors]);

  // Эффект для начальной адаптации
  useEffect(() => {
    adaptColors();
  }, []); // Пустой массив зависимостей для однократного выполнения

  // Эффект для отслеживания активности пользователя
  useEffect(() => {
    const handleActivity = () => {
      const now = new Date();
      const hour = now.getHours();

      setUserBehavior(prev => ({
        ...prev,
        activeHours: [...new Set([...prev.activeHours, hour])],
        activityLevel: 'high' // Можно улучшить логику определения уровня активности
      }));
    };

    // Отслеживаем клики, скролл, ввод текста
    document.addEventListener('click', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('keydown', handleActivity);

    return () => {
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('scroll', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, []);

  return {
    currentScheme,
    userBehavior,
    updateUserBehavior,
    adaptColors
  };
};