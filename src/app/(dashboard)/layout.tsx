'use client';

import { useAuth } from '@/hooks/useAuth';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { useCyberpunkMode } from '@/hooks/useCyberpunkMode';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNav from '@/components/layout/MobileNav';
import AIAssistant from '@/components/ai/AIAssistant';
import AIChatBot from '@/components/ai/AIChatBot';
import LocalAssistant from '@/components/features/ai/LocalAssistant';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import MoodBackground from '@/components/MoodBackground';
import { PageTransitionProvider } from '@/components/transitions/PageTransitionProvider';
import HolographicBackground from '@/components/HolographicBackground';
import QuantumRealityEngine from '@/components/QuantumRealityEngine';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { currentScheme } = useAdaptiveColors();
  const { handleLogoClick } = useCyberpunkMode();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Загрузка...</div>;
  }

  return (
    <MoodBackground>
      <HolographicBackground />
      <QuantumRealityEngine />
      {/* Skip Links for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        data-skip-link="1"
      >
        Пропустить к основному содержимому
      </a>
      <a
        href="#navigation"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:top-16 bg-blue-600 text-white px-4 py-2 rounded z-50"
        data-skip-link="2"
      >
        Пропустить к навигации
      </a>

      <div className="flex h-screen">
        <div className="cyberpunk-grid-2026"></div>
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar mobile />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex flex-col">
          <Topbar onMenuClick={() => setSidebarOpen(true)} onLogoClick={handleLogoClick} />
          <main id="main-content" className="flex-1 p-4 overflow-auto pb-16 md:pb-4" role="main" aria-label="Основное содержимое">
            <ErrorBoundary>
              <PageTransitionProvider>
                {children}
              </PageTransitionProvider>
            </ErrorBoundary>
          </main>
          <MobileNav />
          <AIAssistant />
          <AIChatBot />
          <LocalAssistant />
          <PWAInstallPrompt />
        </div>
      </div>
    </MoodBackground>
  );
}