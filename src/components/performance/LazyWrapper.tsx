'use client';

import React, { Suspense, ComponentType, lazy } from 'react';

// Simple skeleton component
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export function LazyWrapper({ children, fallback, className }: LazyWrapperProps) {
  return (
    <Suspense
      fallback={fallback || (
        <div className={`space-y-3 ${className}`}>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
    >
      {children}
    </Suspense>
  );
}

// Lazy load components with intersection observer
export function lazyLoadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    fallback?: React.ReactNode;
    rootMargin?: string;
    threshold?: number;
  }
) {
  const LazyComponent = lazy(importFunc);

  return function LazyComponentWrapper(props: React.ComponentProps<T>) {
    const [isVisible, setIsVisible] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: options?.rootMargin || '50px',
          threshold: options?.threshold || 0.1,
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={ref}>
        {isVisible ? (
          <LazyWrapper fallback={options?.fallback}>
            <LazyComponent {...props} />
          </LazyWrapper>
        ) : (
          options?.fallback || <Skeleton className="h-32 w-full" />
        )}
      </div>
    );
  };
}

// Preload component
export function preloadComponent(importFunc: () => Promise<any>) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  // This is a simplified version - in real implementation you'd need to handle the module URL
  return importFunc;
}

// Bundle splitting utilities
export const lazyComponents = {
  // Lazy load heavy components
  Web3Wallet: lazyLoadComponent(() => import('@/components/web3/Web3Wallet')),
  VideoCall: lazyLoadComponent(() => import('@/components/calls/VideoCall')),

  // Lazy load pages
  FriendsPage: lazy(() => import('@/app/(dashboard)/friends/page')),
  AchievementsPage: lazy(() => import('@/app/(dashboard)/achievements/page')),
  PluginsPage: lazy(() => import('@/app/(dashboard)/plugins/page')),
  AnalyticsPage: lazy(() => import('@/app/(dashboard)/analytics/page')),
  Web3Page: lazy(() => import('@/app/(dashboard)/web3/page')),
};

// Dynamic imports for routes
export const dynamicRoutes = {
  friends: () => import('@/app/(dashboard)/friends/page'),
  achievements: () => import('@/app/(dashboard)/achievements/page'),
  plugins: () => import('@/app/(dashboard)/plugins/page'),
  analytics: () => import('@/app/(dashboard)/analytics/page'),
  web3: () => import('@/app/(dashboard)/web3/page'),
  calls: () => import('@/app/(dashboard)/calls/page'),
  vr: () => import('@/app/(dashboard)/vr/page'),
  favorites: () => import('@/app/(dashboard)/favorites/page'),
  settings: () => import('@/app/(dashboard)/settings/page'),
  integrations: () => import('@/app/(dashboard)/integrations/page'),
  profile: () => import('@/app/(dashboard)/profile/page'),
};