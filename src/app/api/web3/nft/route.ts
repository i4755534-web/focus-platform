import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const collection = searchParams.get('collection'); // 'achievements', 'collectibles', 'rewards'

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Mock NFT collections
    const mockNFTs = {
      achievements: [
        {
          id: '1',
          name: 'First Steps',
          description: 'Welcome to FOCUS! You\'ve taken your first steps in our educational platform.',
          image: '/nft/first-steps.png',
          rarity: 'common',
          category: 'achievement',
          tokenId: '12345',
          contractAddress: '0xabc123def456789012345678901234567890',
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
          contractAddress: '0xabc123def456789012345678901234567890',
          acquiredAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
          attributes: [
            { trait_type: 'Rarity', value: 'Rare' },
            { trait_type: 'Platform', value: 'FOCUS' },
            { trait_type: 'Courses Completed', value: '10' },
          ],
        },
      ],
      collectibles: [
        {
          id: '3',
          name: 'Golden Ticket',
          description: 'A rare collectible item that grants special access to premium features.',
          image: '/nft/golden-ticket.png',
          rarity: 'epic',
          category: 'collectible',
          tokenId: '12347',
          contractAddress: '0xdef456789012345678901234567890123456789',
          acquiredAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          attributes: [
            { trait_type: 'Rarity', value: 'Epic' },
            { trait_type: 'Type', value: 'Collectible' },
            { trait_type: 'Access Level', value: 'Premium' },
          ],
        },
      ],
      rewards: [
        {
          id: '4',
          name: 'Monthly Champion',
          description: 'Awarded for being the top performer of the month!',
          image: '/nft/monthly-champion.png',
          rarity: 'legendary',
          category: 'reward',
          tokenId: '12348',
          contractAddress: '0xabc123def456789012345678901234567890',
          acquiredAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
          attributes: [
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Period', value: 'Monthly' },
            { trait_type: 'Achievement', value: 'Champion' },
          ],
        },
      ],
    };

    let nfts = [];
    if (collection && mockNFTs[collection as keyof typeof mockNFTs]) {
      nfts = mockNFTs[collection as keyof typeof mockNFTs];
    } else {
      // Return all NFTs if no specific collection requested
      nfts = Object.values(mockNFTs).flat();
    }

    return NextResponse.json({
      address,
      collection: collection || 'all',
      nfts,
      totalCount: nfts.length,
      collections: {
        achievements: mockNFTs.achievements.length,
        collectibles: mockNFTs.collectibles.length,
        rewards: mockNFTs.rewards.length,
      },
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, address, name, description, image, attributes, to, tokenId, contractAddress } = body;

    if (!type || !address) {
      return NextResponse.json(
        { error: 'Type and address are required' },
        { status: 400 }
      );
    }

    // Mock transaction processing
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    let result;
    switch (type) {
      case 'mint':
        if (!name || !description) {
          return NextResponse.json(
            { error: 'Name and description are required for minting' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'mint',
          address,
          tokenId: Math.floor(Math.random() * 1000000),
          name,
          description,
          image,
          attributes,
          status: 'pending',
        };
        break;

      case 'transfer':
        if (!to || !tokenId || !contractAddress) {
          return NextResponse.json(
            { error: 'To address, token ID, and contract address are required for transfer' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'transfer',
          from: address,
          to,
          tokenId,
          contractAddress,
          status: 'pending',
        };
        break;

      case 'burn':
        if (!tokenId || !contractAddress) {
          return NextResponse.json(
            { error: 'Token ID and contract address are required for burning' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'burn',
          address,
          tokenId,
          contractAddress,
          status: 'pending',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid transaction type' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing NFT transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process NFT transaction' },
      { status: 500 }
    );
  }
}