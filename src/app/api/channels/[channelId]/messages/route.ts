import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channel = await db.getChannel(params.channelId);
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const messages = await db.getMessages(params.channelId);

    return NextResponse.json({ messages });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const channel = await db.getChannel(params.channelId);
    if (!channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
    }

    const { content, authorId } = await request.json();

    if (!content || !authorId) {
      return NextResponse.json({ error: 'Content and authorId required' }, { status: 400 });
    }

    const message = await db.createMessage({
      content,
      authorId,
      channelId: params.channelId,
    });

    return NextResponse.json({ message }, { status: 201 });

  } catch (error) {
    console.error('Create message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}