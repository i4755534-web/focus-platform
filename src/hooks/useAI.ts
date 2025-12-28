import { useCallback } from 'react';

interface SentimentResult {
  score: number; // от -1 до 1, где -1 негатив, 1 позитив
  magnitude: number; // интенсивность эмоций
}

export const useAI = () => {
  const analyzeSentiment = useCallback(async (text: string): Promise<SentimentResult> => {
    try {
      const response = await fetch('/api/ai/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze sentiment');
      }

      const data = await response.json();
      return {
        score: data.score || 0,
        magnitude: data.magnitude || 0,
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      // Возвращаем нейтральные значения в случае ошибки
      return { score: 0, magnitude: 0.5 };
    }
  }, []);

  return {
    analyzeSentiment,
  };
};