import { useEffect, useRef, useState } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}

export function useSwipe(config: SwipeConfig) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const threshold = config.threshold || 50;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      setStartPos({ x: touch.clientX, y: touch.clientY });
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!startPos) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startPos.x;
      const deltaY = touch.clientY - startPos.y;

      // Prevent default scrolling if horizontal swipe is detected
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startPos || !isSwiping) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startPos.x;
      const deltaY = touch.clientY - startPos.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > threshold || absDeltaY > threshold) {
        if (absDeltaX > absDeltaY) {
          // Horizontal swipe
          if (deltaX > 0) {
            config.onSwipeRight?.();
          } else {
            config.onSwipeLeft?.();
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            config.onSwipeDown?.();
          } else {
            config.onSwipeUp?.();
          }
        }
      }

      setStartPos(null);
      setIsSwiping(false);
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startPos, isSwiping, config, threshold]);

  return { ref: elementRef, isSwiping };
}