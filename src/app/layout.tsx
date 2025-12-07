'use client';

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/api/client';
import { config } from '@/lib/web3';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
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
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <WagmiProvider config={config}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster />
            </QueryClientProvider>
          </ThemeProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
