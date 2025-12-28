import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ThemeRequest {
  userId: string;
  likes: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { userId, likes }: ThemeRequest = await request.json();

    const prompt = `Generate a personalized theme based on user's social media likes: ${likes.join(', ')}.

Return a JSON object with theme colors:
- primaryColor: hex color
- secondaryColor: hex color
- accentColor: hex color
- background: hex color
- textColor: hex color

Make it cyberpunk-inspired but personalized to the likes.

Respond only with valid JSON.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a theme designer. Respond with valid JSON theme colors.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 150,
    });

    const response = completion.choices[0]?.message?.content;
    const theme = JSON.parse(response || '{}');

    return NextResponse.json({
      primaryColor: theme.primaryColor || '#6c43ff',
      secondaryColor: theme.secondaryColor || '#00f3ff',
      accentColor: theme.accentColor || '#e8d7ff',
      background: theme.background || '#0f0a1a',
      textColor: theme.textColor || '#e8d7ff',
    });

  } catch (error) {
    console.error('Theme generation error:', error);
    return NextResponse.json({
      primaryColor: '#6c43ff',
      secondaryColor: '#00f3ff',
      accentColor: '#e8d7ff',
      background: '#0f0a1a',
      textColor: '#e8d7ff',
    });
  }
}