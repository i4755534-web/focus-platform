import { lazy } from 'react';
import { LazyWrapper } from '@/components/performance/LazyWrapper';

const WalletClient = lazy(() => import('@/components/WalletClient'));

interface LazyWeb3WalletProps {
  children: React.ReactNode;
}

export default function LazyWeb3Wallet({ children }: LazyWeb3WalletProps) {
  return (
    <LazyWrapper
      fallback={
        <div className="flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Подключение Web3...</p>
          </div>
        </div>
      }
    >
      <WalletClient>{children}</WalletClient>
    </LazyWrapper>
  );
}