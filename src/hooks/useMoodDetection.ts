import { useState, useEffect } from 'react';

export type InterfaceMood = 'calm' | 'energetic' | 'focused';

export const useMoodDetection = (userId: string) => {
  const [interfaceMood, setInterfaceMood] = useState<InterfaceMood>('calm');

  useEffect(() => {
    // Анализ последних сообщений через AI-стек
    const analyzeMood = async () => {
      try {
        const chatHistory = await fetch(`/api/users/${userId}/chats/recent`);
        if (!chatHistory.ok) return;

        const messages = await chatHistory.json();
        const moodResponse = await fetch('/api/ai/analyze-mood', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ messages })
        });

        if (moodResponse.ok) {
          const moodData = await moodResponse.json();
          setInterfaceMood(moodData.theme as InterfaceMood);
        }
      } catch (error) {
        console.error('Error analyzing mood:', error);
      }
    };

    analyzeMood();
    const interval = setInterval(analyzeMood, 300000); // Обновляем каждые 5 минут

    return () => clearInterval(interval);
  }, [userId]);

  return interfaceMood;
};