'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import WalletClient from '@/components/WalletClient';
import PWAInstallPrompt from '@/components/pwa/PWAInstallPrompt';
import OfflineFallback from '@/components/OfflineFallback';
import { ResourceHints } from '@/components/performance/ImageOptimizer';
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
