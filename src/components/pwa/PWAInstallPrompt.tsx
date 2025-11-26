'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Smartphone, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export default function PWAInstallPrompt() {
  const { pwaState, installPWA, updatePWA } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Show prompt after some time if installable
  useEffect(() => {
    if (pwaState.isInstallable && !pwaState.isInstalled && !dismissed) {
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [pwaState.isInstallable, pwaState.isInstalled, dismissed]);

  // Show update prompt
  useEffect(() => {
    if (pwaState.updateAvailable) {
      setIsVisible(true);
    }
  }, [pwaState.updateAvailable]);

  const handleInstall = async () => {
    const installed = await installPWA();
    if (installed) {
      setIsVisible(false);
    }
  };

  const handleUpdate = () => {
    updatePWA();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {pwaState.updateAvailable ? (
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">⬆️</span>
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-sm">
                  {pwaState.updateAvailable ? 'Обновление доступно' : 'Установить FOCUS'}
                </h3>
                <p className="text-xs text-gray-600">
                  {pwaState.updateAvailable
                    ? 'Новая версия приложения готова'
                    : 'Работайте быстрее с PWA'
                  }
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs">
              <Smartphone className="w-3 h-3 text-green-600" />
              <span>Быстрый запуск</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              {pwaState.isOffline ? (
                <WifiOff className="w-3 h-3 text-red-600" />
              ) : (
                <Wifi className="w-3 h-3 text-green-600" />
              )}
              <span>Оффлайн режим</span>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex gap-2 mb-3">
            {pwaState.isOffline && (
              <Badge variant="secondary" className="text-xs">
                <WifiOff className="w-3 h-3 mr-1" />
                Оффлайн
              </Badge>
            )}
            {pwaState.isInstalled && (
              <Badge variant="default" className="text-xs">
                <Smartphone className="w-3 h-3 mr-1" />
                Установлено
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {pwaState.updateAvailable ? (
              <Button onClick={handleUpdate} className="flex-1 text-sm">
                Обновить
              </Button>
            ) : (
              <Button onClick={handleInstall} className="flex-1 text-sm">
                <Download className="w-4 h-4 mr-1" />
                Установить
              </Button>
            )}
            <Button variant="outline" onClick={handleDismiss} className="text-sm">
              Позже
            </Button>
          </div>

          {/* Offline indicator */}
          {pwaState.isOffline && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              Вы находитесь в оффлайн режиме. Некоторые функции могут быть недоступны.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}