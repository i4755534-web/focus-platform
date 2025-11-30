import { NextRequest, NextResponse } from 'next/server';

// Mock marketplace plugins data
const marketplacePlugins = [
  {
    id: 'chat-enhancer',
    name: 'Chat Enhancer Pro',
    description: 'Расширенные возможности чата с эмодзи, стикерами и эффектами',
    longDescription: 'Полный набор инструментов для улучшения чата: анимированные эмодзи, стикеры, эффекты сообщений, темы и многое другое.',
    version: '2.1.0',
    author: {
      name: 'ChatMasters',
      verified: true,
    },
    category: 'chat',
    tags: ['chat', 'emojis', 'stickers', 'effects'],
    rating: 4.8,
    reviewCount: 1250,
    downloads: 15420,
    price: 19.99,
    currency: 'USD',
    screenshots: ['/screenshots/chat-enhancer-1.jpg', '/screenshots/chat-enhancer-2.jpg'],
    features: [
      'Анимированные эмодзи',
      'Коллекции стикеров',
      'Эффекты сообщений',
      'Темы чата',
      'GIF поддержка'
    ],
    requirements: ['FOCUS Basic plan'],
    compatibility: ['FOCUS v2.0+'],
    status: 'available',
    lastUpdated: new Date('2024-01-15'),
    size: '15.2 MB',
    license: 'Commercial',
    supportEmail: 'support@chatmasters.com',
    website: 'https://chatmasters.com/focus',
    documentation: 'https://docs.chatmasters.com/focus-integration',
  },
  {
    id: 'moderation-suite',
    name: 'Advanced Moderation Suite',
    description: 'Комплексная система модерации с ИИ-фильтрами',
    longDescription: 'Профессиональная система модерации с искусственным интеллектом для автоматической фильтрации контента, обнаружения спама и управления сообществом.',
    version: '3.2.1',
    author: {
      name: 'SecurityFirst',
      verified: true,
    },
    category: 'moderation',
    tags: ['moderation', 'ai', 'filters', 'security'],
    rating: 4.7,
    reviewCount: 890,
    downloads: 8750,
    price: 49.99,
    currency: 'USD',
    screenshots: ['/screenshots/moderation-1.jpg', '/screenshots/moderation-2.jpg'],
    features: [
      'ИИ-фильтры контента',
      'Автоматическое обнаружение спама',
      'Система предупреждений',
      'Логи модерации',
      'Инструменты администратора'
    ],
    requirements: ['FOCUS Pro plan'],
    compatibility: ['FOCUS v3.0+'],
    status: 'available',
    lastUpdated: new Date('2024-01-20'),
    size: '89.4 MB',
    license: 'Enterprise',
    supportEmail: 'security@securityfirst.com',
    documentation: 'https://docs.securityfirst.com/focus',
  },
  {
    id: 'gamification-engine',
    name: 'Gamification Engine',
    description: 'Система геймификации с достижениями и наградами',
    longDescription: 'Преобразите взаимодействие пользователей с помощью системы достижений, уровней, наград и игровых механик.',
    version: '1.8.3',
    author: {
      name: 'GameDev Studios',
      verified: true,
    },
    category: 'gamification',
    tags: ['gamification', 'achievements', 'levels', 'rewards'],
    rating: 4.9,
    reviewCount: 654,
    downloads: 3200,
    price: 39.99,
    currency: 'USD',
    screenshots: ['/screenshots/gamification-1.jpg', '/screenshots/gamification-2.jpg'],
    features: [
      'Система достижений',
      'Уровни и опыт',
      'Награды и бейджи',
      'Лидерборды',
      'Игровые события'
    ],
    requirements: ['FOCUS Basic plan'],
    compatibility: ['FOCUS v2.5+'],
    status: 'available',
    lastUpdated: new Date('2024-01-10'),
    size: '156 MB',
    license: 'Commercial',
    supportEmail: 'games@gamedev.com',
    documentation: 'https://docs.gamedev.com/focus-gamification',
  },
];

// GET /api/plugins - Get all marketplace plugins
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'popular';

    let filteredPlugins = [...marketplacePlugins];

    // Filter by category
    if (category && category !== 'all') {
      filteredPlugins = filteredPlugins.filter(plugin => plugin.category === category);
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPlugins = filteredPlugins.filter(plugin =>
        plugin.name.toLowerCase().includes(searchLower) ||
        plugin.description.toLowerCase().includes(searchLower) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort plugins
    filteredPlugins.sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.downloads - a.downloads;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    return NextResponse.json({
      plugins: filteredPlugins,
      total: filteredPlugins.length,
      categories: ['chat', 'moderation', 'gamification', 'productivity', 'security', 'integration']
    });

  } catch (error) {
    console.error('Get plugins error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/plugins - Install a plugin
export async function POST(request: NextRequest) {
  try {
    const { pluginId } = await request.json();

    if (!pluginId) {
      return NextResponse.json({ error: 'Plugin ID required' }, { status: 400 });
    }

    const plugin = marketplacePlugins.find(p => p.id === pluginId);
    if (!plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    // Mock installation process
    // In real implementation, this would trigger actual installation

    return NextResponse.json({
      success: true,
      message: 'Plugin installation started',
      plugin: {
        ...plugin,
        status: 'installed',
        installedVersion: plugin.version
      }
    });

  } catch (error) {
    console.error('Install plugin error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}