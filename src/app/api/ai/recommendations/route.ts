import { NextRequest, NextResponse } from 'next/server';

// Simple recommendation engine based on user behavior
// In production, this would use ML models like collaborative filtering

interface UserActivity {
  userId: string;
  actions: string[];
  preferences: string[];
  coursesViewed: string[];
  timeSpent: number;
}

const mockRecommendations = {
  courses: [
    { id: '1', title: 'React Advanced Patterns', category: 'frontend', difficulty: 'advanced' },
    { id: '2', title: 'Node.js Microservices', category: 'backend', difficulty: 'intermediate' },
    { id: '3', title: 'AI in Education', category: 'ai', difficulty: 'beginner' },
  ],
  features: [
    { id: 'chat', name: 'Групповые чаты', reason: 'На основе вашей активности в чатах' },
    { id: 'calls', name: 'Видеозвонки', reason: 'Рекомендуем для онлайн обучения' },
    { id: 'ai-search', name: 'AI Поиск', reason: 'Улучшит поиск образовательного контента' },
  ],
  users: [
    { id: '1', name: 'Анна Петрова', expertise: 'React, TypeScript' },
    { id: '2', name: 'Михаил Иванов', expertise: 'Node.js, DevOps' },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const { userId, activity } = await request.json();

    // In production, fetch user activity from database
    // For now, return mock recommendations based on activity type

    let recommendations = {};

    if (activity?.includes('course')) {
      recommendations = {
        type: 'courses',
        items: mockRecommendations.courses.filter(course =>
          activity.includes(course.category) || activity.includes(course.difficulty)
        ),
        reason: 'На основе ваших интересов в курсах',
      };
    } else if (activity?.includes('chat') || activity?.includes('collaboration')) {
      recommendations = {
        type: 'features',
        items: mockRecommendations.features.filter(feature =>
          feature.id === 'chat' || feature.id === 'calls'
        ),
        reason: 'Для улучшения коммуникации',
      };
    } else if (activity?.includes('search') || activity?.includes('ai')) {
      recommendations = {
        type: 'features',
        items: mockRecommendations.features.filter(feature =>
          feature.id === 'ai-search'
        ),
        reason: 'Для интеллектуального поиска',
      };
    } else {
      // Default recommendations
      recommendations = {
        type: 'mixed',
        courses: mockRecommendations.courses.slice(0, 2),
        features: mockRecommendations.features.slice(0, 2),
        users: mockRecommendations.users.slice(0, 2),
        reason: 'Персонализированные рекомендации для вас',
      };
    }

    return NextResponse.json({
      recommendations,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Recommendations API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return general recommendations for homepage
  return NextResponse.json({
    recommendations: {
      type: 'general',
      featured: mockRecommendations.courses.slice(0, 3),
      popular: mockRecommendations.features.slice(0, 3),
      reason: 'Популярные рекомендации',
    },
    timestamp: new Date().toISOString(),
  });
}