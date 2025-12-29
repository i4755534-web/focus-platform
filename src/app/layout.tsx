'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect, useState } from 'react';
import WalletClient from '@/components/WalletClient';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import OfflineFallback from '@/components/OfflineFallback';
import { ResourceHints } from '@/components/performance/ImageOptimizer';
import toast from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { connectSocket } = useNotifications();
  const [isRetroMode, setIsRetroMode] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }

    // Connect to notification socket
    connectSocket();

    // Пасхалка: ретро-режим при нажатии Ctrl+Shift+R
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        setIsRetroMode(!isRetroMode);
      }
    };

    // Konami-код для режима выживания перед экзаменом
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;

    const handleKonami = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          document.documentElement.classList.add('exam-survival-mode');
          localStorage.setItem('examMode', 'true');

          // Воспроизводим звук 8-bit
          const audio = new Audio('/sounds/8bit-achievement.mp3');
          audio.volume = 0.3;
          audio.play().catch(e => console.log('Audio error:', e));

          // Показываем секретное сообщение
          toast.success('🚀 РЕЖИМ ВЫЖИВАНИЯ АКТИВИРОВАН\nВсе формулы теперь объясняются через мемы и примеры из игр. Удачи на экзамене!', {
            duration: 5000,
            style: {
              background: '#ff00ff',
              color: '#fff',
            },
          });
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKonami);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleKonami);
    };
  }, [connectSocket]);

  return (
    <html lang="ru" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FOCUS" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${isRetroMode ? 'windows95-mode' : ''}`}
        suppressHydrationWarning={true}
      >
        <ResourceHints />
        <OfflineFallback>
          <WalletClient>
            {children}
            <PWAInstallPrompt />
          </WalletClient>
        </OfflineFallback>
      </body>
    </html>
  );
}
