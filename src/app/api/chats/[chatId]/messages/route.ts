import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (use database in production)
let messagesStore: Record<string, Array<{
  id: string;
  text: string;
  sender: string;
  timestamp: string;
  reactions?: Array<{ emoji: string; userId: string }>;
}>> = {
  '1': [
    { id: '1', text: 'Привет!', sender: 'other', timestamp: '10:00' },
    { id: '2', text: 'Привет, как дела?', sender: 'me', timestamp: '10:01' },
  ],
  '2': [
    { id: '3', text: 'Как дела?', sender: 'other', timestamp: '11:00' },
  ],
  '3': [
    { id: '4', text: 'Встреча в 15:00', sender: 'other', timestamp: '12:00' },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const messages = messagesStore[chatId] || [];
  return NextResponse.json(messages);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const { chatId } = await params;
  const body = await request.json();
  const { text, sender } = body;

  if (!text || !sender) {
    return NextResponse.json({ error: 'Missing text or sender' }, { status: 400 });
  }

  const newMessage = {
    id: Date.now().toString(),
    text,
    sender,
    timestamp: new Date().toLocaleTimeString(),
  };

  if (!messagesStore[chatId]) {
    messagesStore[chatId] = [];
  }

  messagesStore[chatId].push(newMessage);

  return NextResponse.json(newMessage, { status: 201 });
}