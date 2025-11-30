'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Download,
  MessageSquare,
  Shield,
  Zap,
  Award,
  Package,
  CheckCircle,
  Heart,
  ShoppingCart
} from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: {
    name: string;
    verified: boolean;
  };
  category: 'chat' | 'moderation' | 'gamification' | 'productivity' | 'security' | 'integration';
  tags: string[];
  rating: number;
  reviewCount: number;
  downloads: number;
  price: number;
  currency: string;
  status: 'available' | 'installed' | 'updating' | 'error';
  installedVersion?: string;
  lastUpdated: Date;
  size: string;
  license: string;
}

interface PluginStoreProps {
  onPluginSelect: (plugin: Plugin) => void;
  onInstallPlugin: (pluginId: string) => void;
  installedPlugins: string[];
}

export default function PluginStore({ onPluginSelect, onInstallPlugin, installedPlugins }: PluginStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock data with updated categories
  const plugins: Plugin[] = [
    {
      id: 'chat-enhancer',
      name: 'Chat Enhancer Pro',
      description: 'Расширенные возможности чата с эмодзи, стикерами и эффектами',
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
      status: 'available',
      lastUpdated: new Date('2024-01-15'),
      size: '15.2 MB',
      license: 'Commercial',
    },
    {
      id: 'moderation-suite',
      name: 'Advanced Moderation Suite',
      description: 'Комплексная система модерации с ИИ-фильтрами и автоматическими действиями',
      version: '3.2.1',
      author: {
        name: 'SecurityFirst',
        verified: true,
      },
      category: 'moderation',
      tags: ['moderation', 'ai', 'filters', 'automation'],
      rating: 4.7,
      reviewCount: 890,
      downloads: 8750,
      price: 49.99,
      currency: 'USD',
      status: 'installed',
      installedVersion: '3.2.1',
      lastUpdated: new Date('2024-01-20'),
      size: '89.4 MB',
      license: 'Enterprise',
    },
    {
      id: 'gamification-engine',
      name: 'Gamification Engine',
      description: 'Система геймификации с достижениями, уровнями и наградами',
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
      status: 'available',
      lastUpdated: new Date('2024-01-10'),
      size: '156 MB',
      license: 'Commercial',
    },
    {
      id: 'productivity-booster',
      name: 'Productivity Booster',
      description: 'Инструменты повышения продуктивности с таймерами и аналитикой',
      version: '2.4.0',
      author: {
        name: 'ProductiveApps',
        verified: false,
      },
      category: 'productivity',
      tags: ['productivity', 'timers', 'analytics', 'focus'],
      rating: 4.6,
      reviewCount: 432,
      downloads: 2100,
      price: 29.99,
      currency: 'USD',
      status: 'available',
      lastUpdated: new Date('2024-01-05'),
      size: '78.3 MB',
      license: 'Commercial',
    },
  ];

  // Filter and sort plugins
  const filteredPlugins = React.useMemo(() => {
    const filtered = plugins.filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort plugins
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
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
  }, [plugins, searchQuery, selectedCategory, sortBy]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'chat':
        return <MessageSquare className="w-4 h-4" />;
      case 'moderation':
        return <Shield className="w-4 h-4" />;
      case 'gamification':
        return <Award className="w-4 h-4" />;
      case 'productivity':
        return <Zap className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'integration':
        return <Package className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const toggleFavorite = (pluginId: string) => {
    setFavorites(prev =>
      prev.includes(pluginId)
        ? prev.filter(id => id !== pluginId)
        : [...prev, pluginId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <CardTitle>Магазин плагинов</CardTitle>
                <CardDescription>
                  Откройте новые возможности с плагинами для FOCUS
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск плагинов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                <SelectItem value="chat">Чат</SelectItem>
                <SelectItem value="moderation">Модерация</SelectItem>
                <SelectItem value="gamification">Геймификация</SelectItem>
                <SelectItem value="productivity">Продуктивность</SelectItem>
                <SelectItem value="security">Безопасность</SelectItem>
                <SelectItem value="integration">Интеграции</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: 'popular' | 'rating' | 'newest' | 'price') => setSortBy(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">По популярности</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="newest">По новизне</SelectItem>
                <SelectItem value="price">По цене</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plugins Grid/List */}
      <div className={viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        : "space-y-4"
      }>
        {filteredPlugins.map((plugin) => (
          <Card key={plugin.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(plugin.category)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{plugin.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">by {plugin.author.name}</span>
                        {plugin.author.verified && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Проверено
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(plugin.id)}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(plugin.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${plugin.price}
                        </div>
                        <div className="text-xs text-gray-600">
                          v{plugin.version}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {plugin.description}
                  </p>

                  <div className="flex items-center gap-4 mb-3">
                    {renderStars(plugin.rating)}
                    <span className="text-xs text-gray-600">
                      {plugin.downloads.toLocaleString()} загрузок
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {plugin.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {installedPlugins.includes(plugin.id) ? (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Установлен
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => onInstallPlugin(plugin.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Установить
                        </Button>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onPluginSelect(plugin)}
                    >
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPlugins.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Плагины не найдены. Попробуйте изменить критерии поиска.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}