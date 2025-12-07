"use client";

import { useEffect, useState } from "react";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@/lib/api/client';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import type { Config } from 'wagmi';

interface WalletClientProps {
  children: React.ReactNode;
}

export default function WalletClient({ children }: WalletClientProps) {
  const [config, setConfig] = useState<Config | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Dynamically import web3 config only on client side
    import("@/lib/web3").then((mod) => {
      setConfig(mod.config);
    }).catch((err) => {
      console.error("Failed to load web3 config on client:", err);
    });
  }, []);

  // Don't render anything until we're on the client and config is loaded
  if (!isClient || !config) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
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
  );
}