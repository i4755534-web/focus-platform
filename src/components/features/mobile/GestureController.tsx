import { useEffect, useState } from 'react';
import { useMoodDetection } from '@/hooks/useMoodDetection';

interface RescueOption {
  text: string;
  action: () => void;
}

interface GestureControllerProps {
  onRescueCircle: (options: { options: RescueOption[] }) => void;
}

export const GestureController: React.FC<GestureControllerProps> = ({ onRescueCircle }) => {
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const userMood = useMoodDetection('current-user-id'); // Нужно получить реальный userId

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchEnd = async (e: TouchEvent) => {
      setTouchEndY(e.touches[0].clientY);

      // Жест "спасательный круг" для стрессовых ситуаций
      if (touchStartY - touchEndY > 100 && userMood === 'calm') {
        // Показать "спасательный круг" с быстрыми решениями
        onRescueCircle({
          options: [
            { text: "Краткий конспект", action: () => console.log("Generate summary") },
            { text: "Найти репетитора", action: () => console.log("Find tutor") },
            { text: "Таймер для отдыха", action: () => console.log("Start pomodoro") }
          ]
        });
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStartY, touchEndY, userMood, onRescueCircle]);

  return null; // Этот компонент не рендерит ничего видимого
};