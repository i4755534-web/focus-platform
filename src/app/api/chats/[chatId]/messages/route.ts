import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

const sendMessageSchema = z.object({
  text: z.string().min(1, 'Message text is required').max(1000, 'Message too long'),
  sender: z.string().min(1, 'Sender is required'),
  replyTo: z.object({
    id: z.string(),
    text: z.string(),
    sender: z.string(),
  }).optional(),
});

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
  try {
    const { chatId } = await params;
    const body = await request.json();
    const validatedData = sendMessageSchema.parse(body);
    const { text, sender, replyTo } = validatedData;

    const newMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toLocaleTimeString(),
      ...(replyTo && { replyTo }),
    };

    if (!messagesStore[chatId]) {
      messagesStore[chatId] = [];
    }

    messagesStore[chatId].push(newMessage);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}