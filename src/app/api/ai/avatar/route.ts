import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface AvatarRequest {
  userId: string;
  username: string;
  mood: string;
  style: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, username, mood, style }: AvatarRequest = await request.json();

    if (!userId || !username) {
      return NextResponse.json(
        { error: 'User ID and username are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Generate a unique 3D avatar description for user "${username}" with mood "${mood}" in ${style} style.

Return a JSON object with the following properties:
- avatarUrl: URL to a Ready Player Me avatar (use format: https://models.readyplayer.me/[avatar_id].glb)
- primaryColor: hex color for main background
- secondaryColor: hex color for secondary elements
- accentColor: hex color for highlights
- pattern: style pattern ("cyberpunk", "geometric", "organic", "minimal")
- shape: avatar shape ("circle", "hexagon", "square", "blob")
- effects: array of visual effects to apply
- moodExpression: facial expression matching the mood

Make it creative and fitting for a ${mood} mood. Use colors that evoke the right emotion.

Respond only with valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI avatar designer. Always respond with valid JSON describing avatar visual properties.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Парсим JSON из ответа
    const avatarDesign = JSON.parse(response.trim());

    // Генерируем дополнительные цвета если не указаны
    const defaultColors = {
      happy: { primary: '#FFD700', secondary: '#FF6B6B', accent: '#FF1493' },
      serious: { primary: '#2F4F4F', secondary: '#4682B4', accent: '#DC143C' },
      creative: { primary: '#9370DB', secondary: '#FF69B4', accent: '#00CED1' },
      energetic: { primary: '#FF4500', secondary: '#FF6347', accent: '#FFD700' },
      calm: { primary: '#20B2AA', secondary: '#87CEEB', accent: '#DDA0DD' }
    };

    const moodColors = defaultColors[mood as keyof typeof defaultColors] || defaultColors.creative;

    return NextResponse.json({
      userId,
      username,
      mood,
      style,
      avatarUrl: avatarDesign.avatarUrl || 'https://models.readyplayer.me/64d25c5c5c5c5c5c5c5c5c5c.glb', // Fallback URL
      primaryColor: avatarDesign.primaryColor || moodColors.primary,
      secondaryColor: avatarDesign.secondaryColor || moodColors.secondary,
      accentColor: avatarDesign.accentColor || moodColors.accent,
      pattern: avatarDesign.pattern || 'cyberpunk',
      shape: avatarDesign.shape || 'circle',
      effects: avatarDesign.effects || ['glow', 'particles'],
      moodExpression: avatarDesign.moodExpression || 'neutral',
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Avatar generation API error:', error);

    // Возвращаем fallback аватар
    return NextResponse.json({
      userId: 'unknown',
      username: 'Unknown User',
      mood: 'creative',
      style: 'cyberpunk-watercolor',
      avatarUrl: 'https://models.readyplayer.me/64d25c5c5c5c5c5c5c5c5c5c.glb',
      primaryColor: '#6c43ff',
      secondaryColor: '#00f3ff',
      accentColor: '#e8d7ff',
      pattern: 'cyberpunk',
      shape: 'circle',
      effects: ['glow'],
      moodExpression: 'neutral',
      isFallback: true
    });
  }
}