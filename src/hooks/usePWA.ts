'use client';

import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  updateAvailable: boolean;
  installPrompt: Event | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: false,
    updateAvailable: false,
    installPrompt: null,
  });

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;

      setPwaState(prev => ({
        ...prev,
        isInstalled: isStandalone || isInWebAppiOS,
      }));
    };

    checkInstalled();
    window.addEventListener('resize', checkInstalled);

    return () => window.removeEventListener('resize', checkInstalled);
  }, []);

  // Listen for install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      logger.info('PWA install prompt available');

      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e,
      }));
    };

    const handleAppInstalled = () => {
      logger.info('PWA installed');
      setPwaState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        installPrompt: null,
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Check online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOffline: false }));
      logger.info('Connection restored');
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOffline: true }));
      logger.warn('Connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setPwaState(prev => ({ ...prev, isOffline: !navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setPwaState(prev => ({ ...prev, updateAvailable: true }));
                logger.info('PWA update available');
              }
            });
          }
        });
      });
    }
  }, []);

  // Install PWA
  const installPWA = async () => {
    if (!pwaState.installPrompt) return false;

    try {
      const promptEvent = pwaState.installPrompt as any;
      promptEvent.prompt();

      const { outcome } = await promptEvent.userChoice;
      const accepted = outcome === 'accepted';

      logger.info('PWA install prompt result', { accepted });

      setPwaState(prev => ({
        ...prev,
        isInstallable: false,
        installPrompt: null,
      }));

      return accepted;
    } catch (error) {
      logger.error('PWA install failed', error as Error);
      return false;
    }
  };

  // Update PWA
  const updatePWA = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  // Share content
  const shareContent = async (data: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    if (!navigator.share) {
      logger.warn('Web Share API not supported');
      return false;
    }

    try {
      await navigator.share(data);
      logger.info('Content shared successfully');
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        logger.error('Share failed', error as Error);
      }
      return false;
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      logger.warn('Notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';

      logger.info('Notification permission result', { granted });
      return granted;
    } catch (error) {
      logger.error('Notification permission request failed', error as Error);
      return false;
    }
  };

  // Send notification
  const sendNotification = (title: string, options?: NotificationOptions) => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-192x192.png',
          ...options,
        });
      });
    }
  };

  // Get cache info
  const getCacheInfo = async () => {
    if (!('caches' in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async cacheName => {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          return {
            name: cacheName,
            size: keys.length,
          };
        })
      );

      return cacheInfo;
    } catch (error) {
      logger.error('Failed to get cache info', error as Error);
      return null;
    }
  };

  // Clear cache
  const clearCache = async () => {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

      logger.info('Cache cleared');
      return true;
    } catch (error) {
      logger.error('Failed to clear cache', error as Error);
      return false;
    }
  };

  return {
    pwaState,
    installPWA,
    updatePWA,
    shareContent,
    requestNotificationPermission,
    sendNotification,
    getCacheInfo,
    clearCache,
  };
};