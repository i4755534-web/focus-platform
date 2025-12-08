import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { message, context = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Prepare messages for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an AI assistant for FOCUS, an educational communication platform. You help users with:
        - Navigation and features explanation
        - Technical support
        - Learning recommendations
        - Chat and collaboration features
        - Video calls and file sharing
        - Web3 and blockchain features
        - General educational platform questions

        Be helpful, friendly, and provide accurate information about the platform's capabilities.
        Keep responses concise but informative.`,
      },
    ];

    // Add context from previous messages (last 5)
    const recentContext = context.slice(-5);
    recentContext.forEach((msg: Message) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add current user message
    messages.push({
      role: 'user',
      content: message,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({
      response,
      usage: completion.usage,
    });

  } catch (error) {
    console.error('AI Chat API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}