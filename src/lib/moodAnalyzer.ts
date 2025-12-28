import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface MoodAnalysis {
  mood: 'positive' | 'negative' | 'neutral' | 'excited' | 'calm' | 'angry' | 'sad' | 'funny';
  intensity: number; // 0-1
  colors: string[]; // hex colors
  gradient: {
    from: string;
    to: string;
    via?: string;
  };
}

export async function analyzeChatMood(messages: string[]): Promise<MoodAnalysis> {
  if (!messages.length) {
    return {
      mood: 'neutral',
      intensity: 0.5,
      colors: ['#FF00FF', '#00FFFF'],
      gradient: { from: '#FF00FF', to: '#00FFFF' }
    };
  }

  const recentMessages = messages.slice(-10).join('\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Analyze the mood and tone of this chat conversation. Return a JSON object with:
          - mood: one of [positive, negative, neutral, excited, calm, angry, sad, funny]
          - intensity: number 0-1 indicating emotional intensity
          - colors: array of 2-3 hex colors that match the mood (neon/cyberpunk style)
          - gradient: object with from, to, and optional via hex colors for a gradient

          Use cyberpunk/neon color palette: fuchsia #FF00FF, electric blue #00FFFF, neon red #FF6B6B, neon green #00FF00, etc.`
        },
        {
          role: 'user',
          content: recentMessages
        }
      ],
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    return {
      mood: result.mood || 'neutral',
      intensity: Math.max(0, Math.min(1, result.intensity || 0.5)),
      colors: result.colors || ['#FF00FF', '#00FFFF'],
      gradient: result.gradient || { from: '#FF00FF', to: '#00FFFF' }
    };
  } catch (error) {
    console.error('Mood analysis failed:', error);
    return {
      mood: 'neutral',
      intensity: 0.5,
      colors: ['#FF00FF', '#00FFFF'],
      gradient: { from: '#FF00FF', to: '#00FFFF' }
    };
  }
}

export function getTimeBasedColors(): string[] {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    // Morning - warm sunrise tones
    return ['#FF6B6B', '#FFA500', '#FF00FF'];
  } else if (hour >= 12 && hour < 18) {
    // Afternoon - bright and energetic
    return ['#00FFFF', '#FF00FF', '#FFFF00'];
  } else if (hour >= 18 && hour < 22) {
    // Evening - deep cosmic blues
    return ['#0000FF', '#8A2BE2', '#FF00FF'];
  } else {
    // Night - dark with neon accents
    return ['#000000', '#FF00FF', '#00FFFF'];
  }
}

export function blendMoodWithTime(moodColors: string[], timeColors: string[]): string[] {
  // Blend mood colors with time-based colors
  const blended = [];
  for (let i = 0; i < Math.max(moodColors.length, timeColors.length); i++) {
    const moodColor = moodColors[i % moodColors.length];
    const timeColor = timeColors[i % timeColors.length];
    // Simple blend - in real implementation, use proper color blending
    blended.push(i % 2 === 0 ? moodColor : timeColor);
  }
  return blended;
}