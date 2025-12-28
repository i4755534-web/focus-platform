import { useState, useEffect, useCallback } from 'react';

export const useCyberpunkMode = () => {
  const [isCyberpunkMode, setIsCyberpunkMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const toggleCyberpunkMode = useCallback(() => {
    setIsCyberpunkMode(prev => !prev);
  }, []);

  const handleLogoClick = useCallback(() => {
    setClickCount(prev => {
      const newCount = prev + 1;

      if (newCount === 3) {
        toggleCyberpunkMode();
        // Play activation sound (if audio is available)
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance('Cyberpunk mode activated');
          utterance.rate = 1.5;
          utterance.pitch = 0.8;
          speechSynthesis.speak(utterance);
        }
        return 0;
      }

      // Reset counter after 2 seconds
      setTimeout(() => setClickCount(0), 2000);
      return newCount;
    });
  }, [toggleCyberpunkMode]);

  useEffect(() => {
    if (isCyberpunkMode) {
      document.documentElement.classList.add('cyberpunk-mode');
      // Add cyberpunk synthwave soundtrack (placeholder)
      console.log('🎵 Synthwave soundtrack activated');
    } else {
      document.documentElement.classList.remove('cyberpunk-mode');
    }
  }, [isCyberpunkMode]);

  return {
    isCyberpunkMode,
    toggleCyberpunkMode,
    handleLogoClick,
  };
};