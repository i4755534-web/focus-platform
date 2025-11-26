'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error
    logger.error('ErrorBoundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    this.setState({
      errorInfo,
    });

    // Report to error tracking service (e.g., Sentry)
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, send to error tracking service
    console.error('Error reported:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const errorDetails = encodeURIComponent(
      `Error ID: ${this.state.errorId}\n` +
      `Message: ${this.state.error?.message}\n` +
      `URL: ${window.location.href}\n` +
      `User Agent: ${navigator.userAgent}\n` +
      `Timestamp: ${new Date().toISOString()}`
    );

    // Open bug report URL (replace with your bug tracking system)
    window.open(
      `mailto:support@focusapp.com?subject=Bug Report&body=${errorDetails}`,
      '_blank'
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-600">
                Что-то пошло не так
              </CardTitle>
              <CardDescription className="text-lg">
                Произошла неожиданная ошибка. Мы уже работаем над её исправлением.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error ID */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ID ошибки: <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {this.state.errorId}
                  </code>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={this.handleRetry} className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Попробовать снова
                </Button>

                <Button variant="outline" onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  На главную
                </Button>

                <Button variant="outline" onClick={this.handleReportBug} className="flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Сообщить об ошибке
                </Button>
              </div>

              {/* Error details (only in development or if showDetails is true) */}
              {(this.props.showDetails || process.env.NODE_ENV === 'development') && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                    Технические детали ошибки
                  </summary>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-red-600">Ошибка:</h4>
                        <pre className="text-xs text-red-800 whitespace-pre-wrap">
                          {this.state.error?.message}
                        </pre>
                      </div>

                      {this.state.error?.stack && (
                        <div>
                          <h4 className="font-medium text-red-600">Stack trace:</h4>
                          <pre className="text-xs text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {this.state.error.stack}
                          </pre>
                        </div>
                      )}

                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h4 className="font-medium text-red-600">Component stack:</h4>
                          <pre className="text-xs text-gray-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </details>
              )}

              {/* Recovery suggestions */}
              <div className="text-center text-sm text-gray-600">
                <p>Попробуйте:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Обновить страницу</li>
                  <li>Очистить кэш браузера</li>
                  <li>Попробовать другой браузер</li>
                  <li>Связаться с поддержкой</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for error handling in functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    logger.error('Error handled by hook', error, {
      componentStack: errorInfo?.componentStack,
    });

    // Could trigger error boundary or show toast
    console.error('Error handled:', error);
  };
}

// Async error boundary for promises
export function withAsyncErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return class AsyncErrorBoundary extends React.Component<P, { hasError: boolean; error: Error | null }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      logger.error('Async error boundary caught error', error, {
        componentStack: errorInfo.componentStack,
      });
    }

    render() {
      if (this.state.hasError && this.state.error) {
        if (fallback) {
          const FallbackComponent = fallback;
          return (
            <FallbackComponent
              error={this.state.error!}
              retry={() => this.setState({ hasError: false, error: null })}
            />
          );
        }

        return (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium">Ошибка загрузки</h3>
            <p className="text-red-600 text-sm mt-1">{this.state.error.message}</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-2"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Повторить
            </Button>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
}