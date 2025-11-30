'use client';

import { useState, useEffect } from 'react';
import { useWeb3 } from './useWeb3';
import { logger } from '@/lib/logger';

export interface StakingPool {
  id: string;
  name: string;
  apy: number;
  duration: number; // in days
  minStake: string;
  totalStaked: string;
  rewardToken: string;
  isActive: boolean;
}

export interface UserStake {
  poolId: string;
  amount: string;
  startTime: number;
  endTime: number;
  rewards: string;
  status: 'active' | 'completed' | 'withdrawn';
}

export interface StakingReward {
  amount: string;
  timestamp: number;
  poolId: string;
  type: 'staking' | 'referral' | 'bonus';
}

export const useStaking = () => {
  const { web3State, sendTransaction } = useWeb3();
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [userStakes, setUserStakes] = useState<UserStake[]>([]);
  const [rewards, setRewards] = useState<StakingReward[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock staking contract address
  const STAKING_CONTRACT_ADDRESS = '0x9876543210987654321098765432109876543210';

  // Load staking pools
  const loadPools = async () => {
    setIsLoading(true);
    try {
      // Mock staking pools
      const mockPools: StakingPool[] = [
        {
          id: '1',
          name: 'FOCUS Staking - 30 дней',
          apy: 12.5,
          duration: 30,
          minStake: '100',
          totalStaked: '125000',
          rewardToken: 'FOCUS',
          isActive: true,
        },
        {
          id: '2',
          name: 'FOCUS Staking - 90 дней',
          apy: 18.0,
          duration: 90,
          minStake: '500',
          totalStaked: '89000',
          rewardToken: 'FOCUS',
          isActive: true,
        },
        {
          id: '3',
          name: 'FOCUS Staking - 180 дней',
          apy: 25.0,
          duration: 180,
          minStake: '1000',
          totalStaked: '45600',
          rewardToken: 'FOCUS',
          isActive: true,
        },
      ];

      setPools(mockPools);
      logger.info('Staking pools loaded');
    } catch (error) {
      logger.error('Failed to load staking pools', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user stakes
  const loadUserStakes = async () => {
    if (!web3State.isConnected || !web3State.address) return;

    setIsLoading(true);
    try {
      // Mock user stakes
      const mockStakes: UserStake[] = [
        {
          poolId: '1',
          amount: '500.00',
          startTime: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
          endTime: Date.now() + 15 * 24 * 60 * 60 * 1000, // 15 days from now
          rewards: '31.25',
          status: 'active',
        },
        {
          poolId: '2',
          amount: '1000.00',
          startTime: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
          endTime: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days from now
          rewards: '90.00',
          status: 'active',
        },
      ];

      setUserStakes(mockStakes);
      logger.info('User stakes loaded', { address: web3State.address });
    } catch (error) {
      logger.error('Failed to load user stakes', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load rewards history
  const loadRewards = async () => {
    if (!web3State.isConnected || !web3State.address) return;

    setIsLoading(true);
    try {
      // Mock rewards history
      const mockRewards: StakingReward[] = [
        {
          amount: '25.00',
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          poolId: '1',
          type: 'staking',
        },
        {
          amount: '50.00',
          timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
          poolId: '2',
          type: 'staking',
        },
      ];

      setRewards(mockRewards);
      logger.info('Rewards history loaded', { address: web3State.address });
    } catch (error) {
      logger.error('Failed to load rewards history', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stake tokens
  const stakeTokens = async (poolId: string, amount: string) => {
    if (!web3State.isConnected) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);

      // Mock staking transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      logger.info('Staking initiated', { poolId, amount, txHash: mockTxHash });

      // Refresh data after staking
      await loadUserStakes();
      await loadPools();

      return mockTxHash;
    } catch (error) {
      logger.error('Failed to stake tokens', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Unstake tokens
  const unstakeTokens = async (poolId: string, amount: string) => {
    if (!web3State.isConnected) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);

      // Mock unstaking transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      logger.info('Unstaking initiated', { poolId, amount, txHash: mockTxHash });

      // Refresh data after unstaking
      await loadUserStakes();
      await loadPools();

      return mockTxHash;
    } catch (error) {
      logger.error('Failed to unstake tokens', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Claim rewards
  const claimRewards = async (poolId?: string) => {
    if (!web3State.isConnected) throw new Error('Wallet not connected');

    try {
      setIsLoading(true);

      // Mock claim transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      logger.info('Rewards claim initiated', { poolId, txHash: mockTxHash });

      // Refresh data after claiming
      await loadUserStakes();
      await loadRewards();

      return mockTxHash;
    } catch (error) {
      logger.error('Failed to claim rewards', error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate potential rewards
  const calculateRewards = (amount: string, apy: number, duration: number) => {
    const principal = parseFloat(amount);
    const rate = apy / 100;
    const timeInYears = duration / 365;

    const rewards = principal * rate * timeInYears;
    return rewards.toFixed(2);
  };

  // Get total staked amount
  const getTotalStaked = () => {
    return userStakes
      .filter(stake => stake.status === 'active')
      .reduce((total, stake) => total + parseFloat(stake.amount), 0)
      .toFixed(2);
  };

  // Get total rewards earned
  const getTotalRewards = () => {
    return rewards
      .reduce((total, reward) => total + parseFloat(reward.amount), 0)
      .toFixed(2);
  };

  // Refresh all data
  const refresh = () => {
    loadPools();
    loadUserStakes();
    loadRewards();
  };

  // Load data on mount and when wallet connects
  useEffect(() => {
    loadPools();
    if (web3State.isConnected) {
      loadUserStakes();
      loadRewards();
    }
  }, [web3State.isConnected, web3State.address]);

  return {
    pools,
    userStakes,
    rewards,
    isLoading,
    loadPools,
    loadUserStakes,
    loadRewards,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    calculateRewards,
    getTotalStaked,
    getTotalRewards,
    refresh,
  };
};