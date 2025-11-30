'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ShoppingCart,
  Package,
  Settings,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Download,
  MessageSquare,
  Zap,
  Shield,
  Award,
  Plus,
  Search,
  Grid,
  List,
  CheckCircle,
  Trash2,
  Play,
  ExternalLink,
  FileText,
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PluginStore from './PluginStore';
import PluginManager from './PluginManager';
import PluginInstaller from './PluginInstaller';
import { usePlugins } from '@/hooks/usePlugins';

interface MarketplaceStats {
  totalPlugins: number;
  totalDownloads: number;
  totalRevenue: number;
  activeInstallations: number;
  topCategories: { name: string; count: number }[];
}

interface Plugin {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  version: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  category: 'communication' | 'productivity' | 'analytics' | 'security' | 'integration' | 'entertainment';
  tags: string[];
  rating: number;
  reviewCount: number;
  downloads: number;
  price: number;
  currency: string;
  screenshots: string[];
  features: string[];
  requirements: string[];
  compatibility: string[];
  status: 'available' | 'installed' | 'updating' | 'error';
  installedVersion?: string;
  lastUpdated: Date;
  size: string;
  license: string;
  supportEmail?: string;
  website?: string;
  documentation?: string;
}

interface PluginReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

interface MarketplaceStats {
  totalPlugins: number;
  totalDownloads: number;
  totalRevenue: number;
  activeInstallations: number;
  topCategories: { name: string; count: number }[];
}

export default function PluginMarketplace() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([]);
  const [installedPlugins, setInstalledPlugins] = useState<string[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [reviews, setReviews] = useState<PluginReview[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showInstalled, setShowInstalled] = useState(false);

  // Mock data
  useEffect(() => {
    const mockPlugins: Plugin[] = [
      {
        id: 'slack-integration',
        name: 'Slack Integration',
        description: 'Seamlessly integrate FOCUS with Slack workspaces',
        longDescription: 'Connect your FOCUS platform with Slack to receive notifications, sync messages, and manage cross-platform communication. Features include real-time message syncing, file sharing, and automated workflows.',
        version: '2.1.0',
        author: {
          name: 'Slack Technologies',
          verified: true,
        },
        category: 'integration',
        tags: ['slack', 'communication', 'workflow', 'automation'],
        rating: 4.8,
        reviewCount: 1250,
        downloads: 15420,
        price: 29.99,
        currency: 'USD',
        screenshots: ['/screenshots/slack-1.jpg', '/screenshots/slack-2.jpg'],
        features: [
          'Real-time message syncing',
          'File sharing integration',
          'Automated workflows',
          'Channel management',
          'User presence sync'
        ],
        requirements: ['FOCUS Pro plan', 'Slack workspace admin access'],
        compatibility: ['FOCUS v3.0+', 'Slack Enterprise'],
        status: 'available',
        lastUpdated: new Date('2024-01-15'),
        size: '15.2 MB',
        license: 'Commercial',
        supportEmail: 'support@slack.com',
        website: 'https://slack.com/integrations/focus',
        documentation: 'https://docs.slack.com/focus-integration',
      },
      {
        id: 'ai-assistant-pro',
        name: 'AI Assistant Pro',
        description: 'Advanced AI assistant with custom training and automation',
        longDescription: 'Enhance your FOCUS experience with our premium AI assistant. Features custom model training, advanced automation, natural language processing, and intelligent task management.',
        version: '1.8.3',
        author: {
          name: 'FOCUS AI Labs',
          verified: true,
        },
        category: 'productivity',
        tags: ['ai', 'automation', 'nlp', 'productivity'],
        rating: 4.9,
        reviewCount: 890,
        downloads: 8750,
        price: 49.99,
        currency: 'USD',
        screenshots: ['/screenshots/ai-1.jpg', '/screenshots/ai-2.jpg'],
        features: [
          'Custom AI model training',
          'Advanced automation',
          'Natural language processing',
          'Intelligent task management',
          'Voice commands',
          'Smart suggestions'
        ],
        requirements: ['FOCUS Enterprise plan'],
        compatibility: ['FOCUS v4.0+'],
        status: 'installed',
        installedVersion: '1.8.3',
        lastUpdated: new Date('2024-01-20'),
        size: '245 MB',
        license: 'Enterprise',
        supportEmail: 'ai-support@focus.com',
        documentation: 'https://docs.focus.com/ai-assistant',
      },
      {
        id: 'security-suite',
        name: 'Enterprise Security Suite',
        description: 'Comprehensive security features for enterprise environments',
        longDescription: 'Protect your organization with advanced security features including encryption, access controls, audit logging, threat detection, and compliance management.',
        version: '3.2.1',
        author: {
          name: 'CyberGuard Inc.',
          verified: true,
        },
        category: 'security',
        tags: ['security', 'encryption', 'compliance', 'audit'],
        rating: 4.7,
        reviewCount: 654,
        downloads: 3200,
        price: 99.99,
        currency: 'USD',
        screenshots: ['/screenshots/security-1.jpg', '/screenshots/security-2.jpg'],
        features: [
          'End-to-end encryption',
          'Advanced access controls',
          'Real-time threat detection',
          'Audit logging',
          'Compliance management',
          'Data loss prevention'
        ],
        requirements: ['FOCUS Enterprise plan'],
        compatibility: ['FOCUS v3.5+'],
        status: 'available',
        lastUpdated: new Date('2024-01-10'),
        size: '89.4 MB',
        license: 'Enterprise',
        supportEmail: 'security@cyberguard.com',
        website: 'https://cyberguard.com/focus-security',
        documentation: 'https://docs.cyberguard.com/focus-integration',
      },
      {
        id: 'analytics-dashboard',
        name: 'Advanced Analytics Dashboard',
        description: 'Powerful analytics and reporting tools for data-driven insights',
        longDescription: 'Transform your data into actionable insights with advanced analytics, custom reports, real-time dashboards, and predictive analytics capabilities.',
        version: '2.4.0',
        author: {
          name: 'DataViz Pro',
          verified: true,
        },
        category: 'analytics',
        tags: ['analytics', 'reporting', 'dashboard', 'insights'],
        rating: 4.6,
        reviewCount: 432,
        downloads: 2100,
        price: 79.99,
        currency: 'USD',
        screenshots: ['/screenshots/analytics-1.jpg', '/screenshots/analytics-2.jpg'],
        features: [
          'Real-time dashboards',
          'Custom report builder',
          'Predictive analytics',
          'Data visualization',
          'Export capabilities',
          'Scheduled reports'
        ],
        requirements: ['FOCUS Pro plan'],
        compatibility: ['FOCUS v3.0+'],
        status: 'available',
        lastUpdated: new Date('2024-01-05'),
        size: '156 MB',
        license: 'Commercial',
        supportEmail: 'support@dataviz.com',
        website: 'https://dataviz.com/focus-analytics',
        documentation: 'https://docs.dataviz.com/focus-integration',
      },
      {
        id: 'video-conferencing-pro',
        name: 'Video Conferencing Pro',
        description: 'Professional video conferencing with advanced features',
        longDescription: 'Elevate your video meetings with professional-grade features including HD video, screen sharing, recording, virtual backgrounds, and advanced participant management.',
        version: '1.9.2',
        author: {
          name: 'VidTech Solutions',
          verified: true,
        },
        category: 'communication',
        tags: ['video', 'conferencing', 'hd', 'recording'],
        rating: 4.5,
        reviewCount: 987,
        downloads: 15600,
        price: 39.99,
        currency: 'USD',
        screenshots: ['/screenshots/video-1.jpg', '/screenshots/video-2.jpg'],
        features: [
          'HD video quality',
          'Screen sharing',
          'Meeting recording',
          'Virtual backgrounds',
          'Participant management',
          'Breakout rooms'
        ],
        requirements: ['FOCUS Basic plan'],
        compatibility: ['FOCUS v2.5+'],
        status: 'installed',
        installedVersion: '1.9.2',
        lastUpdated: new Date('2024-01-12'),
        size: '78.3 MB',
        license: 'Commercial',
        supportEmail: 'video@vidtech.com',
        website: 'https://vidtech.com/focus-video',
        documentation: 'https://docs.vidtech.com/focus-integration',
      },
      {
        id: 'entertainment-pack',
        name: 'Entertainment Pack',
        description: 'Fun plugins for team building and entertainment',
        longDescription: 'Bring fun and engagement to your team with games, quizzes, virtual events, and entertainment features designed to boost morale and team spirit.',
        version: '1.2.0',
        author: {
          name: 'FunCorp Games',
          verified: false,
        },
        category: 'entertainment',
        tags: ['games', 'fun', 'team-building', 'entertainment'],
        rating: 4.2,
        reviewCount: 234,
        downloads: 890,
        price: 19.99,
        currency: 'USD',
        screenshots: ['/screenshots/entertainment-1.jpg', '/screenshots/entertainment-2.jpg'],
        features: [
          'Team games',
          'Virtual events',
          'Icebreaker activities',
          'Celebration features',
          'Custom emojis',
          'Fun integrations'
        ],
        requirements: ['FOCUS Basic plan'],
        compatibility: ['FOCUS v2.0+'],
        status: 'available',
        lastUpdated: new Date('2024-01-08'),
        size: '45.6 MB',
        license: 'Commercial',
        supportEmail: 'fun@funcorp.com',
        website: 'https://funcorp.com/focus-entertainment',
        documentation: 'https://docs.funcorp.com/focus-integration',
      },
    ];

    const mockStats: MarketplaceStats = {
      totalPlugins: 1247,
      totalDownloads: 892340,
      totalRevenue: 2456789,
      activeInstallations: 45623,
      topCategories: [
        { name: 'Integration', count: 324 },
        { name: 'Productivity', count: 287 },
        { name: 'Communication', count: 198 },
        { name: 'Analytics', count: 156 },
        { name: 'Security', count: 134 },
      ],
    };

    setPlugins(mockPlugins);
    setStats(mockStats);
    setInstalledPlugins(['ai-assistant-pro', 'video-conferencing-pro']);
  }, []);

  // Filter and sort plugins
  useEffect(() => {
    let filtered = plugins.filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;

      const matchesInstalled = !showInstalled || installedPlugins.includes(plugin.id);

      return matchesSearch && matchesCategory && matchesInstalled;
    });

    // Sort plugins
    filtered.sort((a, b) => {
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

    setFilteredPlugins(filtered);
  }, [plugins, searchQuery, selectedCategory, sortBy, showInstalled, installedPlugins]);

  const installPlugin = (pluginId: string) => {
    setInstalledPlugins(prev => [...prev, pluginId]);
    // In real implementation, this would trigger the installation process
  };

  const uninstallPlugin = (pluginId: string) => {
    setInstalledPlugins(prev => prev.filter(id => id !== pluginId));
    // In real implementation, this would trigger the uninstallation process
  };

  const updatePlugin = (pluginId: string) => {
    // In real implementation, this would trigger the update process
    console.log('Updating plugin:', pluginId);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return <MessageSquare className="w-4 h-4" />;
      case 'productivity':
        return <Zap className="w-4 h-4" />;
      case 'analytics':
        return <TrendingUp className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      case 'integration':
        return <Package className="w-4 h-4" />;
      case 'entertainment':
        return <Award className="w-4 h-4" />;
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

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              <div>
                <CardTitle>Marketplace плагинов</CardTitle>
                <CardDescription>
                  Расширьте возможности FOCUS с помощью сторонних плагинов и интеграций
                </CardDescription>
              </div>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Опубликовать плагин
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Marketplace Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              <div className="text-2xl font-bold">{stats.totalPlugins.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Всего плагинов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Загрузок</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-purple-500" />
              <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Выручка</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <div className="text-2xl font-bold">{stats.activeInstallations.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Активных установок</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <div className="text-2xl font-bold">{stats.topCategories[0].count}</div>
            </div>
            <p className="text-xs text-muted-foreground">{stats.topCategories[0].name}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Обзор</TabsTrigger>
          <TabsTrigger value="installed">Установленные</TabsTrigger>
          <TabsTrigger value="purchased">Купленные</TabsTrigger>
          <TabsTrigger value="developer">Разработчик</TabsTrigger>
        </TabsList>

        {/* Browse Plugins */}
        <TabsContent value="browse" className="space-y-4">
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
                    <SelectItem value="communication">Связь</SelectItem>
                    <SelectItem value="productivity">Продуктивность</SelectItem>
                    <SelectItem value="analytics">Аналитика</SelectItem>
                    <SelectItem value="security">Безопасность</SelectItem>
                    <SelectItem value="integration">Интеграции</SelectItem>
                    <SelectItem value="entertainment">Развлечения</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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

                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ${plugin.price}
                          </div>
                          <div className="text-xs text-gray-600">
                            v{plugin.version}
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
                            <>
                              <Button size="sm" variant="outline">
                                <Settings className="w-3 h-3 mr-1" />
                                Настроить
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => uninstallPlugin(plugin.id)}
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Удалить
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => installPlugin(plugin.id)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Установить
                            </Button>
                          )}
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedPlugin(plugin)}
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
        </TabsContent>

        {/* Installed Plugins */}
        <TabsContent value="installed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Установленные плагины</CardTitle>
              <CardDescription>
                Управление установленными плагинами и их настройками
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plugins.filter(p => installedPlugins.includes(p.id)).map((plugin) => (
                  <div key={plugin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(plugin.category)}
                      </div>
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-sm text-gray-600">
                          v{plugin.installedVersion} • {plugin.status === 'installed' ? 'Активен' : plugin.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Установлен
                      </Badge>

                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3 mr-1" />
                        Настройки
                      </Button>

                      <Button size="sm" variant="outline">
                        <Play className="w-3 h-3 mr-1" />
                        Запустить
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => uninstallPlugin(plugin.id)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchased Plugins */}
        <TabsContent value="purchased" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Купленные плагины</CardTitle>
              <CardDescription>
                История покупок и управление лицензиями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plugins.filter(p => p.price > 0).map((plugin) => (
                  <div key={plugin.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getCategoryIcon(plugin.category)}
                      </div>
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-sm text-gray-600">
                          Куплено {plugin.lastUpdated.toLocaleDateString()} • ${plugin.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {installedPlugins.includes(plugin.id) ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Установлен
                        </Badge>
                      ) : (
                        <Button size="sm" onClick={() => installPlugin(plugin.id)}>
                          <Download className="w-3 h-3 mr-1" />
                          Установить
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Поддержка
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Developer Tools */}
        <TabsContent value="developer" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Инструменты разработчика</CardTitle>
              <CardDescription>
                Создавайте и публикуйте свои плагины в marketplace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Быстрые действия</h4>
                  <div className="space-y-2">
                    <Button className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Создать новый плагин
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Управление плагинами
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Аналитика продаж
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ресурсы</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Документация API
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      SDK и инструменты
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Сообщество разработчиков
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plugin Detail Modal would go here */}
      {selectedPlugin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(selectedPlugin.category)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedPlugin.name}</CardTitle>
                    <CardDescription className="text-base">
                      by {selectedPlugin.author.name}
                      {selectedPlugin.author.verified && (
                        <Badge variant="outline" className="ml-2">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Проверено
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPlugin(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-medium mb-2">Описание</h3>
                  <p className="text-gray-600 mb-4">{selectedPlugin.longDescription}</p>

                  <h3 className="font-medium mb-2">Возможности</h3>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    {selectedPlugin.features.map((feature, index) => (
                      <li key={index} className="text-gray-600">{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Рейтинг</h4>
                    {renderStars(selectedPlugin.rating)}
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedPlugin.reviewCount} отзывов
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Цена</h4>
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedPlugin.price}
                    </div>
                    <p className="text-sm text-gray-600">{selectedPlugin.license}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Статистика</h4>
                    <div className="space-y-1 text-sm">
                      <div>Загрузок: {selectedPlugin.downloads.toLocaleString()}</div>
                      <div>Размер: {selectedPlugin.size}</div>
                      <div>Версия: {selectedPlugin.version}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {installedPlugins.includes(selectedPlugin.id) ? (
                      <>
                        <Button className="w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Настроить
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => uninstallPlugin(selectedPlugin.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Удалить
                        </Button>
                      </>
                    ) : (
                      <Button className="w-full" onClick={() => installPlugin(selectedPlugin.id)}>
                        <Download className="w-4 h-4 mr-2" />
                        Установить за ${selectedPlugin.price}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}