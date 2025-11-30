'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Settings,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Package,
  Zap,
  Shield,
  MessageSquare,
  Award,
  TrendingUp,
  Download,
  Star,
  Clock
} from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  installedVersion: string;
  author: {
    name: string;
    verified: boolean;
  };
  category: 'chat' | 'moderation' | 'gamification' | 'productivity' | 'security' | 'integration';
  enabled: boolean;
  status: 'active' | 'inactive' | 'error' | 'updating';
  lastUsed?: Date;
  size: string;
  updateAvailable?: boolean;
  newVersion?: string;
  dependencies: string[];
  settings?: PluginSettings;
}

interface PluginSettings {
  autoUpdate: boolean;
  notifications: boolean;
  dataCollection: boolean;
  customConfig?: Record<string, unknown>;
}

interface PluginManagerProps {
  plugins: Plugin[];
  onTogglePlugin: (pluginId: string) => void;
  onUninstallPlugin: (pluginId: string) => void;
  onUpdatePlugin: (pluginId: string) => void;
  onConfigurePlugin: (pluginId: string) => void;
}

export default function PluginManager({
  plugins,
  onTogglePlugin,
  onUninstallPlugin,
  onUpdatePlugin,
  onConfigurePlugin
}: PluginManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(true);

  const filteredPlugins = plugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesStatus = showInactive || plugin.enabled;
    return matchesCategory && matchesStatus;
  });

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

  const getStatusBadge = (status: string, enabled: boolean) => {
    if (!enabled) {
      return <Badge variant="secondary">Отключен</Badge>;
    }

    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Активен</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Неактивен</Badge>;
      case 'error':
        return <Badge variant="destructive">Ошибка</Badge>;
      case 'updating':
        return <Badge className="bg-blue-100 text-blue-800">Обновляется</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Pause className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'updating':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const activePlugins = plugins.filter(p => p.enabled && p.status === 'active');
  const inactivePlugins = plugins.filter(p => !p.enabled);
  const errorPlugins = plugins.filter(p => p.status === 'error');
  const updateAvailablePlugins = plugins.filter(p => p.updateAvailable);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <div>
                <CardTitle>Управление плагинами</CardTitle>
                <CardDescription>
                  Управляйте установленными плагинами и их настройками
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">{activePlugins.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Активных плагинов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Pause className="w-4 h-4 text-gray-500" />
              <div className="text-2xl font-bold">{inactivePlugins.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Отключенных плагинов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div className="text-2xl font-bold">{errorPlugins.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">С ошибками</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-500" />
              <div className="text-2xl font-bold">{updateAvailablePlugins.length}</div>
            </div>
            <p className="text-xs text-muted-foreground">Доступны обновления</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {errorPlugins.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errorPlugins.length} плагин(ов) имеют ошибки. Проверьте их настройки.
          </AlertDescription>
        </Alert>
      )}

      {updateAvailablePlugins.length > 0 && (
        <Alert>
          <RefreshCw className="h-4 w-4" />
          <AlertDescription>
            Доступны обновления для {updateAvailablePlugins.length} плагин(ов).
            <Button variant="link" className="p-0 h-auto ml-2">
              Обновить все
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Все плагины</TabsTrigger>
            <TabsTrigger value="active">Активные</TabsTrigger>
            <TabsTrigger value="inactive">Отключенные</TabsTrigger>
            <TabsTrigger value="updates">Обновления</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Показывать отключенные</label>
              <Switch checked={showInactive} onCheckedChange={setShowInactive} />
            </div>
          </div>
        </div>

        {/* All Plugins */}
        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredPlugins.map((plugin) => (
              <Card key={plugin.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
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
                            {getStatusBadge(plugin.status, plugin.enabled)}
                            {plugin.updateAvailable && (
                              <Badge className="bg-blue-100 text-blue-800">
                                <RefreshCw className="w-3 h-3 mr-1" />
                                v{plugin.newVersion}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{plugin.description}</p>

                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-xs text-gray-600">
                            v{plugin.installedVersion} • {plugin.size}
                          </span>
                          {plugin.lastUsed && (
                            <span className="text-xs text-gray-600">
                              Последнее использование: {plugin.lastUsed.toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {plugin.category}
                          </Badge>
                          {plugin.dependencies.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {plugin.dependencies.length} зависимостей
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={plugin.enabled}
                        onCheckedChange={() => onTogglePlugin(plugin.id)}
                      />

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onConfigurePlugin(plugin.id)}
                        >
                          <Settings className="w-3 h-3" />
                        </Button>

                        {plugin.updateAvailable && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onUpdatePlugin(plugin.id)}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUninstallPlugin(plugin.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Plugins */}
        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {activePlugins.map((plugin) => (
              <Card key={plugin.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(plugin.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-sm text-gray-600">
                          v{plugin.installedVersion} • {plugin.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3 mr-1" />
                        Настройки
                      </Button>
                      <Button size="sm" variant="outline">
                        <Pause className="w-3 h-3 mr-1" />
                        Остановить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inactive Plugins */}
        <TabsContent value="inactive" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {inactivePlugins.map((plugin) => (
              <Card key={plugin.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getStatusIcon(plugin.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-sm text-gray-600">
                          v{plugin.installedVersion} • {plugin.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => onTogglePlugin(plugin.id)}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Включить
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Updates */}
        <TabsContent value="updates" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {updateAvailablePlugins.map((plugin) => (
              <Card key={plugin.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <RefreshCw className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium">{plugin.name}</h4>
                        <p className="text-sm text-gray-600">
                          {plugin.installedVersion} → {plugin.newVersion}
                        </p>
                      </div>
                    </div>

                    <Button onClick={() => onUpdatePlugin(plugin.id)}>
                      <Download className="w-3 h-3 mr-1" />
                      Обновить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}