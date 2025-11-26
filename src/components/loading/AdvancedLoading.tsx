'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Wifi, WifiOff, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error' | 'offline';
  progress?: number;
  message?: string;
  retry?: () => void;
}

interface AdvancedLoadingProps {
  state: LoadingState;
  children?: React.ReactNode;
  skeleton?: React.ReactNode;
  showProgress?: boolean;
  showMessage?: boolean;
  className?: string;
}

export function AdvancedLoading({
  state,
  children,
  skeleton,
  showProgress = true,
  showMessage = true,
  className = '',
}: AdvancedLoadingProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (state.status === 'loading') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [state.status]);

  const getStatusIcon = () => {
    switch (state.status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'offline':
        return <WifiOff className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'offline':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  if (state.status === 'idle' && children) {
    return <>{children}</>;
  }

  if (state.status === 'success' && children) {
    return <>{children}</>;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className={`font-medium ${getStatusColor()}`}>
                {state.status === 'loading' && 'Загрузка'}
                {state.status === 'success' && 'Готово'}
                {state.status === 'error' && 'Ошибка'}
                {state.status === 'offline' && 'Нет подключения'}
                {state.status === 'idle' && 'Ожидание'}
              </h3>
              {showMessage && state.message && (
                <p className="text-sm text-gray-600 mt-1">
                  {state.message}{dots}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        {showProgress && state.progress !== undefined && (
          <CardContent>
            <div className="space-y-2">
              <Progress value={state.progress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">
                {state.progress}%
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Skeleton or Custom Loading */}
      {state.status === 'loading' && (
        <div className="space-y-3">
          {skeleton || (
            <>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Actions */}
      {state.status === 'error' && state.retry && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Что-то пошло не так. Попробуйте еще раз.
              </p>
              <button
                onClick={state.retry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Повторить
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Message */}
      {state.status === 'offline' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Wifi className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h4 className="font-medium text-orange-900 mb-2">
                Нет подключения к интернету
              </h4>
              <p className="text-sm text-gray-600">
                Проверьте подключение и попробуйте еще раз.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook for managing loading states
export function useLoadingState(initialState: Partial<LoadingState> = {}) {
  const [state, setState] = useState<LoadingState>({
    status: 'idle',
    progress: 0,
    ...initialState,
  });

  const actions = {
    start: (message?: string) => setState({
      status: 'loading',
      progress: 0,
      message,
    }),

    progress: (progress: number, message?: string) => setState(prev => ({
      ...prev,
      progress,
      message: message || prev.message,
    })),

    success: (message?: string) => setState({
      status: 'success',
      progress: 100,
      message,
    }),

    error: (message?: string, retry?: () => void) => setState({
      status: 'error',
      message,
      retry,
    }),

    offline: (message?: string) => setState({
      status: 'offline',
      message: message || 'Нет подключения к интернету',
    }),

    reset: () => setState({
      status: 'idle',
      progress: 0,
      message: undefined,
    }),
  };

  return { state, ...actions };
}

// Loading overlay component
export function LoadingOverlay({
  isVisible,
  message = 'Загрузка...',
  children,
}: {
  isVisible: boolean;
  message?: string;
  children: React.ReactNode;
}) {
  if (!isVisible) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-lg font-medium">{message}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Progressive loading hook
export function useProgressiveLoading<T>(
  loadFunction: () => Promise<T>,
  options?: {
    onProgress?: (progress: number) => void;
    simulateProgress?: boolean;
  }
) {
  const { state, start, progress, success, error } = useLoadingState();

  const load = async () => {
    try {
      start('Загрузка данных...');

      if (options?.simulateProgress) {
        // Simulate progress for better UX
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          currentProgress = Math.min(currentProgress + Math.random() * 15, 90);
          progress(currentProgress);
          options?.onProgress?.(currentProgress);
        }, 200);

        const result = await loadFunction();

        clearInterval(progressInterval);
        success('Загрузка завершена');
        return result;
      } else {
        const result = await loadFunction();
        success('Загрузка завершена');
        return result;
      }
    } catch (err) {
      error('Ошибка загрузки', () => load());
      throw err;
    }
  };

  return { state, load };
}