import { useState, useEffect, useCallback } from 'react';
import { analyzeChatMood, getTimeBasedColors, blendMoodWithTime, MoodAnalysis } from '@/lib/moodAnalyzer';

export function useMoodAnalyzer(chatId?: string, messages: string[] = []) {
  const [moodAnalysis, setMoodAnalysis] = useState<MoodAnalysis>({
    mood: 'neutral',
    intensity: 0.5,
    colors: ['#FF00FF', '#00FFFF'],
    gradient: { from: '#FF00FF', to: '#00FFFF' }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMood = useCallback(async () => {
    if (!messages.length) return;

    setIsAnalyzing(true);
    try {
      const moodResult = await analyzeChatMood(messages);
      const timeColors = getTimeBasedColors();
      const blendedColors = blendMoodWithTime(moodResult.colors, timeColors);

      setMoodAnalysis({
        ...moodResult,
        colors: blendedColors
      });
    } catch (error) {
      console.error('Failed to analyze mood:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [messages]);

  useEffect(() => {
    // Analyze mood when messages change significantly
    if (messages.length > 0 && messages.length % 5 === 0) {
      analyzeMood();
    }
  }, [messages.length, analyzeMood]);

  useEffect(() => {
    // Periodic time-based color updates
    const interval = setInterval(() => {
      const timeColors = getTimeBasedColors();
      setMoodAnalysis(prev => ({
        ...prev,
        colors: blendMoodWithTime(prev.colors, timeColors)
      }));
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return {
    moodAnalysis,
    isAnalyzing,
    analyzeMood
  };
}