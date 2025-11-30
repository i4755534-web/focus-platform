'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from './useWeb3';
import { logger } from '@/lib/logger';

export interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  contractAddress?: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  type: 'send' | 'receive' | 'buy' | 'sell';
  status: 'pending' | 'confirmed' | 'failed';
}

export interface TokenPurchase {
  amount: string;
  price: string;
  currency: 'ETH' | 'USDC';
}

export const useTokens = () => {
  const { web3State, sendTransaction } = useWeb3();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // FOCUS token contract address (mock)
  const FOCUS_TOKEN_ADDRESS = '0x1234567890123456789012345678901234567890';

  // Load token balances
  const loadBalances = async () => {
    if (!web3State.isConnected || !web3State.address) return;

    setIsLoading(true);
    try {
      // Mock FOCUS token balance
      const focusBalance: TokenBalance = {
        symbol: 'FOCUS',
        balance: '1250.50',
        decimals: 18,
        contractAddress: FOCUS_TOKEN_ADDRESS,
      };

      // Mock USDC balance
      const usdcBalance: TokenBalance = {
        symbol: 'USDC',
        balance: '50.00',
        decimals: 6,
        contractAddress: '0xA0b86a33E6441e88C5F2712C3E9b74F5F0c8c6F8',
      };

      setBalances([focusBalance, usdcBalance]);
      logger.info('Token balances loaded', { address: web3State.address });
    } catch (error) {
      logger.error('Failed to load token balances', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load transaction history
  const loadTransactions = async () => {
    if (!web3State.isConnected || !web3State.address) return;

    setIsLoading(true);
    try {
      // Mock transaction history
      const mockTransactions: Transaction[] = [
        {
          hash: '0xabc123...',
          from: web3State.address!,
          to: '0xdef456...',
          value: '100.00',
          timestamp: Date.now() - 86400000, // 1 day ago
          type: 'send',
          status: 'confirmed',
        },
        {
          hash: '0xdef789...',
          from: '0xplatform...',
          to: web3State.address!,
          value: '50.00',
          timestamp: Date.now() - 172800000, // 2 days ago
          type: 'receive',
          status: 'confirmed',
        },
      ];

      setTransactions(mockTransactions);
      logger.info('Transaction history loaded', { address: web3State.address });
    } catch (error) {
      logger.error('Failed to load transaction history', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer tokens
  const transferTokens = async (
    to: string,
    amount: string,
    tokenAddress?: string
  ) => {
    if (!web3State.isConnected) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);

      // For native ETH transfers
      if (!tokenAddress) {
        const txHash = await sendTransaction(to, amount);
        logger.info('Token transfer initiated', { to, amount, txHash });
        return txHash;
      }

      // For ERC20 token transfers
      const contractData = `0xa9059cbb${to.slice(2).padStart(64, '0')}${(parseFloat(amount) * 10 ** 18).toString(16).padStart(64, '0')}`;
      const txHash = await sendTransaction(tokenAddress, '0', contractData);

      logger.info('ERC20 transfer initiated', { to, amount, tokenAddress, txHash });
      return txHash;
    } catch (error) {
      logger.error('Failed to transfer tokens', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Buy tokens
  const buyTokens = async (purchase: TokenPurchase) => {
    if (!web3State.isConnected) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);

      // Mock purchase logic - in real app, this would interact with DEX or payment processor
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      logger.info('Token purchase initiated', { purchase, txHash: mockTxHash });
      return mockTxHash;
    } catch (error) {
      logger.error('Failed to buy tokens', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Get token price (mock)
  const getTokenPrice = async (symbol: string) => {
    // Mock prices
    const prices: Record<string, string> = {
      FOCUS: '0.10',
      ETH: '2000.00',
      USDC: '1.00',
    };

    return prices[symbol] || '0.00';
  };

  // Refresh data
  const refresh = () => {
    loadBalances();
    loadTransactions();
  };

  // Load data on mount and when wallet connects
  useEffect(() => {
    if (web3State.isConnected) {
      loadBalances();
      loadTransactions();
    }
  }, [web3State.isConnected, web3State.address]);

  return {
    balances,
    transactions,
    isLoading,
    loadBalances,
    loadTransactions,
    transferTokens,
    buyTokens,
    getTokenPrice,
    refresh,
  };
};