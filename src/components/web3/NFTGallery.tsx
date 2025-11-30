'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWeb3 } from '@/hooks/useWeb3';
import { Trophy, Star, Award, Gift, Share2, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface NFTItem {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'achievement' | 'collectible' | 'reward';
  tokenId?: string;
  contractAddress?: string;
  acquiredAt: number;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export default function NFTGallery() {
  const { web3State, mintNFT, transferNFT } = useWeb3();
  const [nfts, setNfts] = useState<NFTItem[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<NFTItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock NFT data - in real app, this would come from blockchain
  const mockNFTs: NFTItem[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Welcome to FOCUS! You\'ve taken your first steps in our educational platform.',
      image: '/nft/first-steps.png',
      rarity: 'common',
      category: 'achievement',
      tokenId: '12345',
      contractAddress: '0xabc123...',
      acquiredAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      attributes: [
        { trait_type: 'Rarity', value: 'Common' },
        { trait_type: 'Platform', value: 'FOCUS' },
        { trait_type: 'Type', value: 'Achievement' },
      ],
    },
    {
      id: '2',
      name: 'Scholar',
      description: 'You\'ve completed 10 courses and earned the Scholar achievement!',
      image: '/nft/scholar.png',
      rarity: 'rare',
      category: 'achievement',
      tokenId: '12346',
      contractAddress: '0xabc123...',
      acquiredAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      attributes: [
        { trait_type: 'Rarity', value: 'Rare' },
        { trait_type: 'Platform', value: 'FOCUS' },
        { trait_type: 'Courses Completed', value: '10' },
      ],
    },
    {
      id: '3',
      name: 'Community Builder',
      description: 'Thank you for helping build our amazing community!',
      image: '/nft/community-builder.png',
      rarity: 'epic',
      category: 'achievement',
      tokenId: '12347',
      contractAddress: '0xabc123...',
      acquiredAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      attributes: [
        { trait_type: 'Rarity', value: 'Epic' },
        { trait_type: 'Platform', value: 'FOCUS' },
        { trait_type: 'Community Impact', value: 'High' },
      ],
    },
  ];

  // Load NFTs
  const loadNFTs = async () => {
    setIsLoading(true);
    try {
      // In real app, fetch from blockchain/smart contract
      setNfts(mockNFTs);
    } catch (error) {
      console.error('Failed to load NFTs', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mint achievement NFT
  const handleMintAchievement = async (achievement: Partial<NFTItem>) => {
    if (!web3State.isConnected) {
      toast.error('Подключите кошелек для создания NFT');
      return;
    }

    try {
      setIsLoading(true);

      const result = await mintNFT({
        name: `FOCUS Achievement: ${achievement.name}`,
        description: achievement.description || '',
        image: achievement.image || '',
        attributes: achievement.attributes || [],
      });

      toast.success(`NFT создан! Token ID: ${result.tokenId}`);

      // Add to local collection
      const newNFT: NFTItem = {
        id: result.tokenId.toString(),
        name: achievement.name || 'New Achievement',
        description: achievement.description || '',
        image: achievement.image || '',
        rarity: achievement.rarity || 'common',
        category: 'achievement',
        tokenId: result.tokenId.toString(),
        contractAddress: '0xabc123...',
        acquiredAt: Date.now(),
        attributes: achievement.attributes || [],
      };

      setNfts(prev => [newNFT, ...prev]);
    } catch (error) {
      toast.error('Ошибка при создании NFT');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transfer NFT
  const handleTransferNFT = async (nft: NFTItem, to: string) => {
    if (!web3State.isConnected) {
      toast.error('Подключите кошелек для перевода NFT');
      return;
    }

    try {
      setIsLoading(true);

      if (!nft.contractAddress || !nft.tokenId) {
        throw new Error('NFT data incomplete');
      }

      await transferNFT(nft.contractAddress, to, nft.tokenId);
      toast.success('NFT отправлен!');

      // Remove from local collection
      setNfts(prev => prev.filter(n => n.id !== nft.id));
    } catch (error) {
      toast.error('Ошибка при переводе NFT');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'collectible': return <Star className="w-4 h-4" />;
      case 'reward': return <Gift className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    loadNFTs();
  }, []);

  const filteredNFTs = (category?: string) => {
    if (!category) return nfts;
    return nfts.filter(nft => nft.category === category);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              NFT Галерея
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {nfts.length} NFT
              </Badge>
              <Button variant="outline" size="sm" onClick={loadNFTs} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Ваша коллекция NFT достижений и коллекционных предметов
          </CardDescription>
        </CardHeader>
      </Card>

      {/* NFT Grid */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="achievement">Достижения</TabsTrigger>
          <TabsTrigger value="collectible">Коллекционные</TabsTrigger>
          <TabsTrigger value="reward">Награды</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <NFTGrid nfts={filteredNFTs()} onSelect={setSelectedNFT} />
        </TabsContent>

        <TabsContent value="achievement" className="mt-6">
          <NFTGrid nfts={filteredNFTs('achievement')} onSelect={setSelectedNFT} />
        </TabsContent>

        <TabsContent value="collectible" className="mt-6">
          <NFTGrid nfts={filteredNFTs('collectible')} onSelect={setSelectedNFT} />
        </TabsContent>

        <TabsContent value="reward" className="mt-6">
          <NFTGrid nfts={filteredNFTs('reward')} onSelect={setSelectedNFT} />
        </TabsContent>
      </Tabs>

      {/* NFT Detail Modal */}
      <Dialog open={!!selectedNFT} onOpenChange={() => setSelectedNFT(null)}>
        <DialogContent className="max-w-2xl">
          {selectedNFT && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedNFT.category)}
                  {selectedNFT.name}
                </DialogTitle>
                <DialogDescription>{selectedNFT.description}</DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NFT Image */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                    <Trophy className="w-24 h-24 text-gray-400" />
                  </div>

                  <div className="flex gap-2">
                    <Badge className={getRarityColor(selectedNFT.rarity)}>
                      {selectedNFT.rarity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      {selectedNFT.category}
                    </Badge>
                  </div>
                </div>

                {/* NFT Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Атрибуты</h4>
                    <div className="space-y-2">
                      {selectedNFT.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">{attr.trait_type}</span>
                          <span className="text-sm font-medium">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedNFT.tokenId && (
                    <div>
                      <h4 className="font-medium mb-2">Блокчейн информация</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token ID:</span>
                          <span className="font-mono">{selectedNFT.tokenId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Контракт:</span>
                          <span className="font-mono text-xs">{selectedNFT.contractAddress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Получен:</span>
                          <span>{new Date(selectedNFT.acquiredAt).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Поделиться
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Просмотр
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// NFT Grid Component
function NFTGrid({ nfts, onSelect }: { nfts: NFTItem[], onSelect: (nft: NFTItem) => void }) {
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">NFT не найдены</h3>
        <p className="text-gray-500">У вас пока нет NFT в этой категории</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {nfts.map((nft) => (
        <Card key={nft.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelect(nft)}>
          <CardContent className="p-4">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
              <Trophy className="w-12 h-12 text-gray-400" />
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm truncate">{nft.name}</h3>

              <div className="flex items-center justify-between">
                <Badge className={`text-xs ${nft.rarity === 'common' ? 'bg-gray-100 text-gray-800' :
                  nft.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  nft.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  'bg-yellow-100 text-yellow-800'}`}>
                  {nft.rarity}
                </Badge>

                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500 capitalize">{nft.category}</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2">{nft.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}