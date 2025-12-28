import { useState, useEffect } from 'react';

export function useSecretMode() {
  const [isWindows95Mode, setIsWindows95Mode] = useState(false);
  const [fPresses, setFPresses] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'F') {
        setFPresses(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
            setIsWindows95Mode(prev => !prev);
            // Play floppy disk sound (mock)
            console.log('Floppy disk sound!');
            return 0;
          }
          return newCount;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isWindows95Mode };
}