import { NextRequest, NextResponse } from 'next/server';

// Mock reviews data
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

const reviews: Record<string, Review[]> = {
  'chat-enhancer': [
    {
      id: '1',
      userId: 'user1',
      userName: 'Алексей Петров',
      userAvatar: '/avatars/user1.jpg',
      rating: 5,
      comment: 'Отличный плагин! Очень удобный интерфейс и много полезных функций.',
      date: new Date('2024-01-10'),
      helpful: 12,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Мария Иванова',
      userAvatar: '/avatars/user2.jpg',
      rating: 4,
      comment: 'Хорошо работает, но хотелось бы больше настроек для эмодзи.',
      date: new Date('2024-01-08'),
      helpful: 8,
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Дмитрий Сидоров',
      userAvatar: '/avatars/user3.jpg',
      rating: 5,
      comment: 'Идеально подходит для нашей команды. Рекомендую!',
      date: new Date('2024-01-05'),
      helpful: 15,
    },
  ],
  'moderation-suite': [
    {
      id: '4',
      userId: 'user4',
      userName: 'Елена Козлова',
      userAvatar: '/avatars/user4.jpg',
      rating: 5,
      comment: 'Профессиональная система модерации. Очень эффективная.',
      date: new Date('2024-01-12'),
      helpful: 20,
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'Андрей Николаев',
      userAvatar: '/avatars/user5.jpg',
      rating: 4,
      comment: 'Хороший инструмент, но требует некоторой настройки.',
      date: new Date('2024-01-09'),
      helpful: 6,
    },
  ],
};

// GET /api/plugins/[pluginId]/reviews - Get plugin reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { pluginId: string } }
) {
  try {
    const pluginReviews = reviews[params.pluginId] || [];

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'newest';

    // Sort reviews
    const sortedReviews = [...pluginReviews].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return b.date.getTime() - a.date.getTime();
        case 'oldest':
          return a.date.getTime() - b.date.getTime();
        case 'helpful':
          return b.helpful - a.helpful;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

    return NextResponse.json({
      reviews: paginatedReviews,
      total: pluginReviews.length,
      page,
      limit,
      totalPages: Math.ceil(pluginReviews.length / limit)
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/plugins/[pluginId]/reviews - Add a review
export async function POST(
  request: NextRequest,
  { params }: { params: { pluginId: string } }
) {
  try {
    const { userId, userName, rating, comment } = await request.json();

    if (!userId || !userName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const newReview = {
      id: Date.now().toString(),
      userId,
      userName,
      rating,
      comment,
      date: new Date(),
      helpful: 0,
    };

    if (!reviews[params.pluginId]) {
      reviews[params.pluginId] = [];
    }

    reviews[params.pluginId].push(newReview);

    return NextResponse.json({
      success: true,
      review: newReview
    });

  } catch (error) {
    console.error('Add review error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}