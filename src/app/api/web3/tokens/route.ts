import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    // Mock token balances - in real app, fetch from blockchain
    const mockBalances = [
      {
        symbol: 'FOCUS',
        balance: '1250.50',
        decimals: 18,
        contractAddress: '0x1234567890123456789012345678901234567890',
        price: 0.10,
        value: 125.05,
      },
      {
        symbol: 'USDC',
        balance: '50.00',
        decimals: 6,
        contractAddress: '0xA0b86a33E6441e88C5F2712C3E9b74F5F0c8c6F8',
        price: 1.00,
        value: 50.00,
      },
    ];

    return NextResponse.json({
      address,
      balances: mockBalances,
      totalValue: mockBalances.reduce((sum, token) => sum + token.value, 0),
    });
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token balances' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, address, to, amount, tokenAddress } = body;

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
      case 'transfer':
        if (!to || !amount) {
          return NextResponse.json(
            { error: 'To address and amount are required for transfer' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'transfer',
          from: address,
          to,
          amount,
          tokenAddress,
          status: 'pending',
        };
        break;

      case 'buy':
        if (!amount) {
          return NextResponse.json(
            { error: 'Amount is required for purchase' },
            { status: 400 }
          );
        }
        result = {
          txHash: mockTxHash,
          type: 'buy',
          address,
          amount,
          price: (parseFloat(amount) * 0.10).toFixed(2),
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
    console.error('Error processing token transaction:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}