import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Analyze the sentiment of the following text. Return a JSON object with two fields:
- score: a number from -1 (very negative) to 1 (very positive), representing the overall sentiment
- magnitude: a number from 0 to 1, representing the intensity of emotion in the text

Text: "${text}"

Respond only with valid JSON, no additional text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a sentiment analysis assistant. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Парсим JSON из ответа
    const sentimentData = JSON.parse(response.trim());

    return NextResponse.json({
      score: Math.max(-1, Math.min(1, sentimentData.score || 0)),
      magnitude: Math.max(0, Math.min(1, sentimentData.magnitude || 0)),
    });

  } catch (error) {
    console.error('Sentiment analysis API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}