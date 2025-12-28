import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export interface AvatarOptions {
  style: 'cyberpunk' | 'watercolor' | 'mixed';
  mood?: string;
  colors?: string[];
  userName?: string;
}

export async function generateAvatar(options: AvatarOptions): Promise<string> {
  const { style, mood, colors, userName } = options;

  let prompt = `Create a unique avatar in ${style} style. `;

  if (style === 'cyberpunk') {
    prompt += 'Neon colors, futuristic elements, glowing effects, cyberpunk aesthetic. ';
  } else if (style === 'watercolor') {
    prompt += 'Soft watercolor painting style, artistic, fluid colors. ';
  } else {
    prompt += 'Mix of cyberpunk neon elements with watercolor artistic style. ';
  }

  if (mood) {
    prompt += `The avatar should convey a ${mood} mood. `;
  }

  if (colors && colors.length > 0) {
    prompt += `Use these colors: ${colors.join(', ')}. `;
  }

  if (userName) {
    prompt += `Incorporate initials or elements representing "${userName}". `;
  }

  prompt += 'Square format, high quality, detailed, unique character design.';

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    });

    return response.data[0]?.url || '';
  } catch (error) {
    console.error('Avatar generation failed:', error);
    return '';
  }
}

export async function generateAnimatedAvatar(baseImage: string, animationType: 'pulse' | 'glow' | 'float'): Promise<string> {
  // For now, return base image. In real implementation, could use additional processing
  // or generate animated versions
  return baseImage;
}

export function getAvatarStyles(style: string) {
  const baseStyles = {
    cyberpunk: {
      filter: 'drop-shadow(0 0 10px #FF00FF) brightness(1.1)',
      border: '2px solid #00FFFF',
    },
    watercolor: {
      filter: 'blur(0.5px) saturate(1.2)',
      border: '2px solid #FF6B6B',
    },
    mixed: {
      filter: 'drop-shadow(0 0 8px #FF00FF) hue-rotate(45deg)',
      border: '2px solid #FFFF00',
    }
  };

  return baseStyles[style as keyof typeof baseStyles] || baseStyles.cyberpunk;
}