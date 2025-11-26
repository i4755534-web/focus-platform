'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import {
  Palette,
  Download,
  Eye,
  Settings,
  Brush,
  Save,
  RotateCcw,
  Check,
  Star,
  Crown,
  Shield,
  Package,
  Edit,
  Plus,
  Trash2
} from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  type: 'system' | 'user' | 'premium' | 'enterprise';
  category: 'light' | 'dark' | 'colorful' | 'minimal' | 'professional' | 'fun';
  popularity: number;
  downloads: number;
  rating: number;
  price?: number;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
  tags: string[];
  screenshots: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdvancedThemingSystem() {
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [customThemes, setCustomThemes] = useState<Theme[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [themeEditor, setThemeEditor] = useState({
    name: '',
    description: '',
    category: 'light' as const,
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      accent: '#f59e0b',
      background: '#ffffff',
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockThemes: Theme[] = [
      {
        id: 'default-light',
        name: 'Default Light',
        description: 'Clean and professional light theme',
        author: { name: 'FOCUS Team', verified: true },
        type: 'system',
        category: 'light',
        popularity: 95,
        downloads: 1000000,
        rating: 4.8,
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b',
          textSecondary: '#64748b',
          border: '#e2e8f0',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
        },
        tags: ['professional', 'clean', 'light'],
        screenshots: ['/themes/light-1.jpg', '/themes/light-2.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'default-dark',
        name: 'Default Dark',
        description: 'Modern dark theme for comfortable viewing',
        author: { name: 'FOCUS Team', verified: true },
        type: 'system',
        category: 'dark',
        popularity: 88,
        downloads: 750000,
        rating: 4.7,
        colors: {
          primary: '#60a5fa',
          secondary: '#94a3b8',
          accent: '#fbbf24',
          background: '#0f172a',
          surface: '#1e293b',
          text: '#f8fafc',
          textSecondary: '#cbd5e1',
          border: '#334155',
          error: '#f87171',
          success: '#34d399',
          warning: '#fbbf24',
          info: '#60a5fa',
        },
        tags: ['modern', 'dark', 'comfortable'],
        screenshots: ['/themes/dark-1.jpg', '/themes/dark-2.jpg'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'ocean-blue',
        name: 'Ocean Blue',
        description: 'Refreshing blue theme inspired by the ocean',
        author: { name: 'Design Studio Pro', verified: true },
        type: 'premium',
        category: 'colorful',
        popularity: 76,
        downloads: 45000,
        rating: 4.9,
        price: 9.99,
        colors: {
          primary: '#0ea5e9',
          secondary: '#64748b',
          accent: '#06b6d4',
          background: '#f0f9ff',
          surface: '#e0f2fe',
          text: '#0c4a6e',
          textSecondary: '#475569',
          border: '#bae6fd',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          info: '#0ea5e9',
        },
        tags: ['blue', 'ocean', 'refreshing', 'premium'],
        screenshots: ['/themes/ocean-1.jpg', '/themes/ocean-2.jpg'],
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ];

    setAvailableThemes(mockThemes);
    setCurrentTheme(mockThemes[0]); // Default to light theme
  }, []);

  const applyTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    // In real implementation, this would apply the theme to the entire app
    console.log('Applying theme:', theme.name);
  };

  const createTheme = () => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: themeEditor.name || 'Custom Theme',
      description: themeEditor.description || 'Custom created theme',
      author: { name: 'You', verified: false },
      type: 'user',
      category: themeEditor.category,
      popularity: 0,
      downloads: 0,
      rating: 0,
      colors: {
        ...themeEditor.colors,
        surface: themeEditor.colors.background,
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        error: '#ef4444',
        success: '#10b981',
        warning: '#f59e0b',
        info: themeEditor.colors.primary,
      },
      tags: [],
      screenshots: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setCustomThemes(prev => [...prev, newTheme]);
    setAvailableThemes(prev => [...prev, newTheme]);
    setIsEditing(false);
  };

  const deleteTheme = (themeId: string) => {
    setAvailableThemes(prev => prev.filter(theme => theme.id !== themeId));
    setCustomThemes(prev => prev.filter(theme => theme.id !== themeId));
  };

  const exportTheme = (theme: Theme) => {
    const themeData = JSON.stringify(theme, null, 2);
    const blob = new Blob([themeData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    const defaultTheme = availableThemes.find(t => t.id === 'default-light');
    if (defaultTheme) {
      applyTheme(defaultTheme);
    }
  };

  const filteredThemes = availableThemes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         theme.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory;
    const matchesType = selectedType === 'all' || theme.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Settings className="w-4 h-4" />;
      case 'premium':
        return <Crown className="w-4 h-4" />;
      case 'enterprise':
        return <Shield className="w-4 h-4" />;
      case 'user':
        return <Package className="w-4 h-4" />;
      default:
        return <Palette className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'light':
        return 'bg-yellow-100 text-yellow-800';
      case 'dark':
        return 'bg-gray-100 text-gray-800';
      case 'colorful':
        return 'bg-purple-100 text-purple-800';
      case 'minimal':
        return 'bg-blue-100 text-blue-800';
      case 'professional':
        return 'bg-green-100 text-green-800';
      case 'fun':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6" />
              <div>
                <CardTitle>Advanced Theming System</CardTitle>
                <CardDescription>
                  Создавайте и управляйте кастомными темами для персонализации FOCUS
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={resetToDefault}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Сбросить
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Brush className="w-4 h-4 mr-2" />
                Создать тему
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Current Theme */}
      {currentTheme && (
        <Card>
          <CardHeader>
            <CardTitle>Текущая тема</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <div>
                <h3 className="font-semibold text-lg">{currentTheme.name}</h3>
                <p className="text-gray-600">{currentTheme.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getCategoryColor(currentTheme.category)}>
                    {currentTheme.category}
                  </Badge>
                  <Badge variant="outline">
                    {getTypeIcon(currentTheme.type)}
                    <span className="ml-1">
                      {currentTheme.type === 'system' ? 'Системная' :
                       currentTheme.type === 'premium' ? 'Премиум' :
                       currentTheme.type === 'enterprise' ? 'Enterprise' : 'Пользовательская'}
                    </span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Обзор тем</TabsTrigger>
          <TabsTrigger value="custom">Мои темы</TabsTrigger>
          <TabsTrigger value="editor">Редактор тем</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        {/* Browse Themes */}
        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Поиск тем..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    <SelectItem value="light">Светлые</SelectItem>
                    <SelectItem value="dark">Темные</SelectItem>
                    <SelectItem value="colorful">Яркие</SelectItem>
                    <SelectItem value="minimal">Минималистичные</SelectItem>
                    <SelectItem value="professional">Профессиональные</SelectItem>
                    <SelectItem value="fun">Забавные</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все типы</SelectItem>
                    <SelectItem value="system">Системные</SelectItem>
                    <SelectItem value="premium">Премиум</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="user">Пользовательские</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((theme) => (
              <Card key={theme.id} className={`hover:shadow-lg transition-shadow ${currentTheme?.id === theme.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Theme Preview */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: theme.colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: theme.colors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: theme.colors.accent }}
                          title="Accent"
                        />
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: theme.colors.background }}
                          title="Background"
                        />
                      </div>
                    </div>

                    {/* Theme Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{theme.name}</h3>
                        {theme.price && (
                          <Badge variant="outline">${theme.price}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{theme.description}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{theme.rating}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {theme.downloads.toLocaleString()} загрузок
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getCategoryColor(theme.category)}>
                          {theme.category}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeIcon(theme.type)}
                          <span className="ml-1">
                            {theme.type === 'system' ? 'Системная' :
                             theme.type === 'premium' ? 'Премиум' :
                             theme.type === 'enterprise' ? 'Enterprise' : 'Пользовательская'}
                          </span>
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => applyTheme(theme)}
                          disabled={currentTheme?.id === theme.id}
                          className="flex-1"
                        >
                          {currentTheme?.id === theme.id ? (
                            <>
                              <Check className="w-3 h-3 mr-1" />
                              Активна
                            </>
                          ) : (
                            <>
                              <Palette className="w-3 h-3 mr-1" />
                              Применить
                            </>
                          )}
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => setSelectedTheme(theme)}>
                          <Eye className="w-3 h-3" />
                        </Button>

                        <Button size="sm" variant="outline" onClick={() => exportTheme(theme)}>
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Custom Themes */}
        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Мои темы</CardTitle>
              <CardDescription>
                Управление созданными вами темами
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customThemes.length === 0 ? (
                <div className="text-center py-8">
                  <Palette className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium mb-2">Нет пользовательских тем</h3>
                  <p className="text-gray-600 mb-4">Создайте свою первую тему в редакторе тем</p>
                  <Button onClick={() => setIsEditing(true)}>
                    <Brush className="w-4 h-4 mr-2" />
                    Создать тему
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customThemes.map((theme) => (
                    <Card key={theme.id}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: theme.colors.primary }}
                            />
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: theme.colors.secondary }}
                            />
                            <div
                              className="w-6 h-6 rounded-full border"
                              style={{ backgroundColor: theme.colors.accent }}
                            />
                          </div>

                          <div>
                            <h3 className="font-semibold">{theme.name}</h3>
                            <p className="text-sm text-gray-600">{theme.description}</p>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => applyTheme(theme)} className="flex-1">
                              Применить
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteTheme(theme.id)}>
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Theme Editor */}
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Редактор тем</CardTitle>
              <CardDescription>
                Создавайте и редактируйте кастомные темы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="theme-name">Название темы</Label>
                      <Input
                        id="theme-name"
                        value={themeEditor.name}
                        onChange={(e) => setThemeEditor(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Моя тема"
                      />
                    </div>

                    <div>
                      <Label htmlFor="theme-description">Описание</Label>
                      <Input
                        id="theme-description"
                        value={themeEditor.description}
                        onChange={(e) => setThemeEditor(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Описание темы"
                      />
                    </div>

                    <div>
                      <Label>Категория</Label>
                      <Select
                        value={themeEditor.category}
                        onValueChange={(value: any) => setThemeEditor(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Светлая</SelectItem>
                          <SelectItem value="dark">Темная</SelectItem>
                          <SelectItem value="colorful">Яркая</SelectItem>
                          <SelectItem value="minimal">Минималистическая</SelectItem>
                          <SelectItem value="professional">Профессиональная</SelectItem>
                          <SelectItem value="fun">Забавная</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Color Picker */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Цвета</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primary-color">Основной цвет</Label>
                        <Input
                          id="primary-color"
                          type="color"
                          value={themeEditor.colors.primary}
                          onChange={(e) => setThemeEditor(prev => ({
                            ...prev,
                            colors: { ...prev.colors, primary: e.target.value }
                          }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="secondary-color">Вторичный цвет</Label>
                        <Input
                          id="secondary-color"
                          type="color"
                          value={themeEditor.colors.secondary}
                          onChange={(e) => setThemeEditor(prev => ({
                            ...prev,
                            colors: { ...prev.colors, secondary: e.target.value }
                          }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="accent-color">Акцентный цвет</Label>
                        <Input
                          id="accent-color"
                          type="color"
                          value={themeEditor.colors.accent}
                          onChange={(e) => setThemeEditor(prev => ({
                            ...prev,
                            colors: { ...prev.colors, accent: e.target.value }
                          }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="background-color">Фон</Label>
                        <Input
                          id="background-color"
                          type="color"
                          value={themeEditor.colors.background}
                          onChange={(e) => setThemeEditor(prev => ({
                            ...prev,
                            colors: { ...prev.colors, background: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={createTheme}>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить тему
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Предварительный просмотр
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Экспорт
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки тем</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-theme">Автоматическая смена темы</Label>
                  <p className="text-sm text-gray-600">Автоматически переключаться между светлой и темной темой</p>
                </div>
                <Switch id="auto-theme" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast">Высокий контраст</Label>
                  <p className="text-sm text-gray-600">Увеличить контрастность для лучшей доступности</p>
                </div>
                <Switch id="high-contrast" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="animations">Анимации</Label>
                  <p className="text-sm text-gray-600">Включить плавные переходы и анимации</p>
                </div>
                <Switch id="animations" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Theme Detail Modal */}
      {selectedTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(selectedTheme.type)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{selectedTheme.name}</CardTitle>
                    <CardDescription className="text-base">
                      by {selectedTheme.author.name}
                      {selectedTheme.author.verified && (
                        <Badge variant="outline" className="ml-2">
                          <Check className="w-3 h-3 mr-1" />
                          Проверено
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTheme(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h3 className="font-medium mb-2">Описание</h3>
                  <p className="text-gray-600 mb-4">{selectedTheme.description}</p>

                  <h3 className="font-medium mb-2">Цветовая палитра</h3>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {Object.entries(selectedTheme.colors).slice(0, 8).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div
                          className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-2"
                          style={{ backgroundColor: value }}
                        />
                        <p className="text-xs text-gray-600 capitalize">{key}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Рейтинг</h4>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= selectedTheme.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{selectedTheme.rating} из 5</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Цена</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {selectedTheme.price ? `$${selectedTheme.price}` : 'Бесплатно'}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Статистика</h4>
                    <div className="space-y-1 text-sm">
                      <div>Загрузок: {selectedTheme.downloads.toLocaleString()}</div>
                      <div>Популярность: {selectedTheme.popularity}%</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {currentTheme?.id === selectedTheme.id ? (
                      <Button className="w-full" disabled>
                        <Check className="w-4 h-4 mr-2" />
                        Текущая тема
                      </Button>
                    ) : (
                      <Button className="w-full" onClick={() => applyTheme(selectedTheme)}>
                        <Palette className="w-4 h-4 mr-2" />
                        Применить тему
                      </Button>
                    )}

                    <Button variant="outline" className="w-full" onClick={() => exportTheme(selectedTheme)}>
                      <Download className="w-4 h-4 mr-2" />
                      Скачать
                    </Button>
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