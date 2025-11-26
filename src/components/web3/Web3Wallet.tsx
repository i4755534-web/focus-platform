'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWeb3 } from '@/hooks/useWeb3';
import { Wallet, Coins, Trophy, Send, Download, Upload } from 'lucide-react';

export default function Web3Wallet() {
  const { web3State, connectWallet, disconnectWallet, connectors, mintNFT, transferNFT } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (connectorId: string) => {
    await connectWallet(connectorId);
    setIsOpen(false);
  };

  const handleMintAchievement = async () => {
    try {
      const achievement = {
        name: 'First Steps',
        description: 'Welcome to FOCUS! You\'ve taken your first steps in our educational platform.',
        rarity: 'common' as const,
        icon: '/achievement-first-steps.png',
      };

      const result = await mintNFT({
        name: `FOCUS Achievement: ${achievement.name}`,
        description: achievement.description,
        image: achievement.icon,
        attributes: [
          { trait_type: 'Rarity', value: achievement.rarity },
          { trait_type: 'Platform', value: 'FOCUS' },
        ],
      });

      alert(`NFT создан! Token ID: ${result.tokenId}`);
    } catch (error) {
      alert('Ошибка при создании NFT');
    }
  };

  if (!web3State.isConnected) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Подключить кошелек
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подключить Web3 кошелек</DialogTitle>
            <DialogDescription>
              Выберите кошелек для доступа к Web3 функциям FOCUS
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {connectors.map((connector) => (
              <Button
                key={connector.id}
                onClick={() => handleConnect(connector.id)}
                disabled={!connector.ready}
                className="w-full justify-start"
                variant="outline"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {connector.name}
                {!connector.ready && ' (не установлен)'}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Web3 Кошелек
        </CardTitle>
        <CardDescription>
          Ваш блокчейн кошелек подключен
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Адрес:</span>
            <Badge variant="secondary" className="font-mono text-xs">
              {web3State.address?.slice(0, 6)}...{web3State.address?.slice(-4)}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Баланс:</span>
            <Badge variant="outline" className="font-mono">
              {web3State.balance} ETH
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Сеть:</span>
            <Badge variant="outline">
              {web3State.chainId === 1 ? 'Ethereum' :
               web3State.chainId === 137 ? 'Polygon' :
               web3State.chainId === 10 ? 'Optimism' :
               `Chain ${web3State.chainId}`}
            </Badge>
          </div>
        </div>

        {/* NFT Section */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            NFT Achievements
          </h4>
          <div className="space-y-2">
            <Button
              onClick={handleMintAchievement}
              className="w-full"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Создать Achievement NFT
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled
            >
              <Upload className="w-4 h-4 mr-2" />
              Мои NFT (скоро)
            </Button>
          </div>
        </div>

        {/* Token Section */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Coins className="w-4 h-4" />
            FOCUS Tokens
          </h4>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled
            >
              <Send className="w-4 h-4 mr-2" />
              Купить токены (скоро)
            </Button>
            <Button
              variant="outline"
              className="w-full"
              size="sm"
              disabled
            >
              <Coins className="w-4 h-4 mr-2" />
              Staking (скоро)
            </Button>
          </div>
        </div>

        {/* Disconnect */}
        <div className="border-t pt-4">
          <Button
            onClick={disconnectWallet}
            variant="destructive"
            className="w-full"
            size="sm"
          >
            Отключить кошелек
          </Button>
        </div>

        {web3State.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{web3State.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}