'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, AlertTriangle } from 'lucide-react';

interface OfflineFallbackProps {
  children: React.ReactNode;
  showNotification?: boolean;
}

export default function OfflineFallback({ children, showNotification = true }: OfflineFallbackProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineUI, setShowOfflineUI] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineUI(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (showNotification) {
        setShowOfflineUI(true);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showNotification]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      // Try to fetch a small resource to verify connection
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      if (response.ok) {
        setIsOnline(true);
        setShowOfflineUI(false);
        window.location.reload(); // Reload to get fresh data
      }
    } catch (error) {
      // Still offline
    } finally {
      setRetrying(false);
    }
  };

  // If online, render children normally
  if (isOnline && !showOfflineUI) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline notification banner */}
      {showOfflineUI && (
        <div className="bg-yellow-500 text-yellow-900 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">
              Оффлайн режим - некоторые функции недоступны
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            disabled={retrying}
            className="text-yellow-900 hover:bg-yellow-600"
          >
            {retrying ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Main content with offline fallbacks */}
      <div className="relative">
        {children}

        {/* Offline overlay for critical features */}
        {!isOnline && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <WifiOff className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Нет подключения</h3>
                <p className="text-gray-600 mb-4">
                  Некоторые функции FOCUS недоступны без интернета.
                  Попробуйте позже.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={handleRetry} disabled={retrying}>
                    {retrying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        Проверка...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Проверить подключение
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Offline status indicator */}
      <div className="fixed bottom-4 right-4 z-40">
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className="flex items-center gap-1"
        >
          {isOnline ? (
            <Wifi className="w-3 h-3" />
          ) : (
            <WifiOff className="w-3 h-3" />
          )}
          {isOnline ? 'Онлайн' : 'Оффлайн'}
        </Badge>
      </div>
    </div>
  );
}

// Hook for checking online status in components
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Component for handling API calls with offline fallback
export function withOfflineHandling<T extends unknown[], R>(
  apiCall: (...args: T) => Promise<R>,
  fallbackData?: R
) {
  return async (...args: T): Promise<R> => {
    if (!navigator.onLine) {
      if (fallbackData !== undefined) {
        return fallbackData;
      }
      throw new Error('No internet connection');
    }

    try {
      return await apiCall(...args);
    } catch (error) {
      if (!navigator.onLine && fallbackData !== undefined) {
        return fallbackData;
      }
      throw error;
    }
  };
}