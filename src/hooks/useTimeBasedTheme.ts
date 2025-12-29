import { useState, useEffect } from 'react';

export type TimeTheme = 'day' | 'sunset' | 'night';

export const useTimeBasedTheme = () => {
  const [theme, setTheme] = useState<TimeTheme>('day');

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) setTheme('day');
      else if (hour >= 18 && hour < 21) setTheme('sunset');
      else setTheme('night');
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Обновляем каждую минуту

    return () => clearInterval(interval);
  }, []);

  return theme;
};