'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { logger } from '@/lib/logger';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export interface Web3State {
  isConnected: boolean;
  address: string | undefined;
  balance: string;
  chainId: number | undefined;
  isConnecting: boolean;
  error: string | null;
}

export const useWeb3 = () => {
  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    address: undefined,
    balance: '0',
    chainId: undefined,
    isConnecting: false,
    error: null,
  });

  const { address, isConnected, connector, chainId } = useAccount();
  const { connect, connectors, error: connectError, isLoading: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balanceData } = useBalance({
    address,
  });

  // Update state when account changes
  useEffect(() => {
    setWeb3State(prev => ({
      ...prev,
      isConnected,
      address,
      chainId,
      isConnecting,
      balance: balanceData?.formatted || '0',
      error: connectError?.message || null,
    }));
  }, [isConnected, address, chainId, isConnecting, balanceData, connectError]);

  // Connect to wallet
  const connectWallet = async (connectorId?: string) => {
    try {
      const connector = connectors.find(c => c.id === connectorId) || connectors[0];
      if (connector) {
        connect({ connector });
        logger.info('Wallet connection initiated', { connector: connector.name });
      }
    } catch (error) {
      logger.error('Failed to connect wallet', error as Error);
      setWeb3State(prev => ({ ...prev, error: 'Failed to connect wallet' }));
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    try {
      disconnect();
      logger.info('Wallet disconnected');
    } catch (error) {
      logger.error('Failed to disconnect wallet', error as Error);
    }
  };

  // Switch network
  const switchNetwork = async (chainId: number) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        logger.info('Network switched', { chainId });
      }
    } catch (error) {
      logger.error('Failed to switch network', error as Error);
      // If network doesn't exist, try to add it
      try {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Ethereum Mainnet',
            nativeCurrency: {
              name: 'Ether',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.infura.io/v3/'],
            blockExplorerUrls: ['https://etherscan.io'],
          }],
        });
      } catch (addError) {
        logger.error('Failed to add network', addError as Error);
      }
    }
  };

  // Send transaction
  const sendTransaction = async (to: string, value: string, data?: string) => {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found');

      const transactionParameters = {
        to,
        from: address,
        value: `0x${parseInt(value).toString(16)}`,
        ...(data && { data }),
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      logger.info('Transaction sent', { txHash, to, value });
      return txHash;
    } catch (error) {
      logger.error('Failed to send transaction', error as Error);
      throw error;
    }
  };

  // Sign message
  const signMessage = async (message: string) => {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found');

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      logger.info('Message signed', { address });
      return signature;
    } catch (error) {
      logger.error('Failed to sign message', error as Error);
      throw error;
    }
  };

  // Get NFT balance
  const getNFTBalance = async (contractAddress: string, tokenId?: string) => {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found');

      // ERC721 balanceOf or ERC1155 balanceOf
      const balance = await window.ethereum.request({
        method: 'eth_call',
        params: [{
          to: contractAddress,
          data: tokenId
            ? `0x00fdd58e${tokenId.padStart(64, '0')}${address?.slice(2).padStart(64, '0')}` // ERC1155 balanceOf
            : `0x70a08231${address?.slice(2).padStart(64, '0')}`, // ERC721 balanceOf
        }],
      });

      return parseInt(balance, 16);
    } catch (error) {
      logger.error('Failed to get NFT balance', error as Error);
      return 0;
    }
  };

  // Mint NFT (mock implementation)
  const mintNFT = async (metadata: NFTMetadata) => {
    try {
      // In real implementation, this would interact with a smart contract
      logger.info('NFT mint initiated', { name: metadata.name });

      // Mock transaction
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Store metadata (in real app, this would be uploaded to IPFS)
      const tokenId = Math.floor(Math.random() * 1000000);

      return { tokenId, txHash: mockTxHash };
    } catch (error) {
      logger.error('Failed to mint NFT', error as Error);
      throw error;
    }
  };

  // Transfer NFT
  const transferNFT = async (contractAddress: string, to: string, tokenId: string) => {
    try {
      const txHash = await sendTransaction(
        contractAddress,
        '0',
        `0x42842e0e${to.slice(2).padStart(64, '0')}${tokenId.padStart(64, '0')}` // transfer function
      );

      logger.info('NFT transfer initiated', { contractAddress, to, tokenId, txHash });
      return txHash;
    } catch (error) {
      logger.error('Failed to transfer NFT', error as Error);
      throw error;
    }
  };

  return {
    web3State,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    sendTransaction,
    signMessage,
    getNFTBalance,
    mintNFT,
    transferNFT,
    connectors,
  };
};