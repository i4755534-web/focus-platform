import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const type = searchParams.get('type'); // 'pools', 'stakes', 'rewards'

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'pools':
        // Mock staking pools
        result = {
          pools: [
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
          ],
        };
        break;

      case 'stakes':
        // Mock user stakes
        result = {
          address,
          stakes: [
            {
              poolId: '1',
              amount: '500.00',
              startTime: Date.now() - 15 * 24 * 60 * 60 * 1000,
              endTime: Date.now() + 15 * 24 * 60 * 60 * 1000,
              rewards: '31.25',
              status: 'active',
            },
            {
              poolId: '2',
              amount: '1000.00',
              startTime: Date.now() - 60 * 24 * 60 * 60 * 1000,
              endTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
              rewards: '90.00',
              status: 'active',
            },
          ],
          totalStaked: '1500.00',
          totalRewards: '121.25',
        };
        break;

      case 'rewards':
        // Mock rewards history
        result = {
          address,
          rewards: [
            {
              amount: '25.00',
              timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
              poolId: '1',
              type: 'staking',
            },
            {
              amount: '50.00',
              timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
              poolId: '2',
              type: 'staking',
            },
          ],
          totalEarned: '75.00',
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type parameter. Use: pools, stakes, or rewards' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching staking data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staking data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, address, poolId, amount } = body;

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
      case 'stake':
        if (!poolId || !amount) {
          return NextResponse.json(
            { error: 'Pool ID and amount are required for staking' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'stake',
          address,
          poolId,
          amount,
          status: 'pending',
        };
        break;

      case 'unstake':
        if (!poolId || !amount) {
          return NextResponse.json(
            { error: 'Pool ID and amount are required for unstaking' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'unstake',
          address,
          poolId,
          amount,
          status: 'pending',
        };
        break;

      case 'claim':
        result = {
          txHash: mockTxHash,
          type: 'claim',
          address,
          poolId,
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
    console.error('Error processing staking transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process staking transaction' },
      { status: 500 }
    );
  }
}