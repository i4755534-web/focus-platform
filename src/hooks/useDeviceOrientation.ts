import { useState, useEffect } from 'react';

interface DeviceOrientationState {
  alpha: number | null;
  beta: number | null;
  gamma: number | null;
  isSupported: boolean;
  isNightMode: boolean;
}

export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<DeviceOrientationState>({
    alpha: null,
    beta: null,
    gamma: null,
    isSupported: typeof window !== 'undefined' && !!window.DeviceOrientationEvent,
    isNightMode: false,
  });

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation(prev => ({
        ...prev,
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
        isNightMode: event.beta !== null && Math.abs(event.beta) > 45, // Tilted for night mode
      }));
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return orientation;
}