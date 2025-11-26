'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Video,
  FileText,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  Target,
  Zap,
  Brain,
  PieChart,
  LineChart,
  AreaChart,
  AlertTriangle
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    bounceRate: number;
    conversionRate: number;
  };
  userEngagement: {
    dailyActiveUsers: number[];
    weeklyActiveUsers: number[];
    monthlyActiveUsers: number[];
    retentionRate: number;
    churnRate: number;
  };
  featureUsage: {
    chats: number;
    videoCalls: number;
    fileUploads: number;
    aiInteractions: number;
    searchQueries: number;
  };
  performance: {
    pageLoadTime: number;
    apiResponseTime: number;
    errorRate: number;
    uptime: number;
  };
  revenue: {
    totalRevenue: number;
    monthlyRecurringRevenue: number;
    averageRevenuePerUser: number;
    churnRevenue: number;
  };
  customMetrics: {
    name: string;
    value: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }[];
}

interface ReportConfig {
  name: string;
  type: 'user-behavior' | 'performance' | 'revenue' | 'custom';
  dateRange: '7d' | '30d' | '90d' | '1y';
  metrics: string[];
  filters: Record<string, any>;
  schedule?: 'daily' | 'weekly' | 'monthly';
}

export default function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);

  // Mock data
  useEffect(() => {
    const mockData: AnalyticsData = {
      overview: {
        totalUsers: 15420,
        activeUsers: 12850,
        totalSessions: 45230,
        avgSessionDuration: 24.5, // minutes
        bounceRate: 12.3,
        conversionRate: 8.7,
      },
      userEngagement: {
        dailyActiveUsers: [1200, 1350, 1180, 1420, 1380, 1520, 1450],
        weeklyActiveUsers: [8500, 9200, 8800, 9600],
        monthlyActiveUsers: [32000, 35800, 34200, 38100, 36500, 39200],
        retentionRate: 78.5,
        churnRate: 21.5,
      },
      featureUsage: {
        chats: 125430,
        videoCalls: 8750,
        fileUploads: 23450,
        aiInteractions: 45670,
        searchQueries: 89230,
      },
      performance: {
        pageLoadTime: 1.2, // seconds
        apiResponseTime: 145, // ms
        errorRate: 0.8,
        uptime: 99.9,
      },
      revenue: {
        totalRevenue: 487500,
        monthlyRecurringRevenue: 45200,
        averageRevenuePerUser: 31.6,
        churnRevenue: 12500,
      },
      customMetrics: [
        { name: 'AI Response Accuracy', value: 94.2, change: 2.1, trend: 'up' },
        { name: 'User Satisfaction Score', value: 4.6, change: -0.1, trend: 'down' },
        { name: 'Feature Adoption Rate', value: 67.8, change: 5.3, trend: 'up' },
        { name: 'Support Ticket Resolution', value: 89.4, change: 1.8, trend: 'up' },
      ],
    };

    const mockReports: ReportConfig[] = [
      {
        name: 'User Engagement Report',
        type: 'user-behavior',
        dateRange: '30d',
        metrics: ['activeUsers', 'retentionRate', 'sessionDuration'],
        filters: { platform: 'all', region: 'all' },
        schedule: 'weekly',
      },
      {
        name: 'Performance Dashboard',
        type: 'performance',
        dateRange: '7d',
        metrics: ['pageLoadTime', 'apiResponseTime', 'errorRate', 'uptime'],
        filters: { service: 'all' },
        schedule: 'daily',
      },
      {
        name: 'Revenue Analytics',
        type: 'revenue',
        dateRange: '90d',
        metrics: ['totalRevenue', 'monthlyRecurringRevenue', 'churnRevenue'],
        filters: { plan: 'all' },
        schedule: 'monthly',
      },
    ];

    setTimeout(() => {
      setData(mockData);
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportReport = (format: 'pdf' | 'csv' | 'json') => {
    console.log(`Exporting report as ${format}`);
    // Implementation would generate and download the report
  };

  const createCustomReport = () => {
    console.log('Creating custom report');
    // Implementation would open report builder
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
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

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Комплексный анализ данных и бизнес-метрики платформы FOCUS
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 дней</SelectItem>
                  <SelectItem value="30d">30 дней</SelectItem>
                  <SelectItem value="90d">90 дней</SelectItem>
                  <SelectItem value="1y">1 год</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div className="text-2xl font-bold">{formatNumber(data.overview.totalUsers)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Всего пользователей</p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">{formatNumber(data.overview.activeUsers)}</div>
            </div>
            <p className="text-xs text-muted-foreground">Активных пользователей</p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+8.3%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <div className="text-2xl font-bold">{data.overview.avgSessionDuration}m</div>
            </div>
            <p className="text-xs text-muted-foreground">Средняя сессия</p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-600">+5.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              <div className="text-2xl font-bold">{data.overview.conversionRate}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Конверсия</p>
            <div className="mt-2 flex items-center gap-1">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-600">-2.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Финансовые метрики</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.revenue.totalRevenue)}
              </div>
              <p className="text-sm text-gray-600">Общая выручка</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.revenue.monthlyRecurringRevenue)}
              </div>
              <p className="text-sm text-gray-600">MRR</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(data.revenue.averageRevenuePerUser)}
              </div>
              <p className="text-sm text-gray-600">ARPU</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(data.revenue.churnRevenue)}
              </div>
              <p className="text-sm text-gray-600">Churn Revenue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList>
          <TabsTrigger value="engagement">Вовлеченность</TabsTrigger>
          <TabsTrigger value="features">Функции</TabsTrigger>
          <TabsTrigger value="performance">Производительность</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>

        {/* User Engagement */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Активность пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ежедневная активность</span>
                      <span>{formatNumber(data.userEngagement.dailyActiveUsers.slice(-1)[0])}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Еженедельная активность</span>
                      <span>{formatNumber(data.userEngagement.weeklyActiveUsers.slice(-1)[0])}</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Ежемесячная активность</span>
                      <span>{formatNumber(data.userEngagement.monthlyActiveUsers.slice(-1)[0])}</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retention & Churn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Retention Rate</span>
                      <span className="text-green-600">{data.userEngagement.retentionRate}%</span>
                    </div>
                    <Progress value={data.userEngagement.retentionRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Churn Rate</span>
                      <span className="text-red-600">{data.userEngagement.churnRate}%</span>
                    </div>
                    <Progress value={data.userEngagement.churnRate} className="h-2" />
                  </div>
                  <div className="pt-4">
                    <div className="text-sm text-gray-600">
                      <div>Цель retention: {'>'}80%</div>
                      <div>Цель churn: {'<'}15%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Feature Usage */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Использование функций</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{formatNumber(data.featureUsage.chats)}</div>
                  <p className="text-sm text-gray-600">Чатов</p>
                </div>
                <div className="text-center">
                  <Video className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{formatNumber(data.featureUsage.videoCalls)}</div>
                  <p className="text-sm text-gray-600">Видеозвонков</p>
                </div>
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{formatNumber(data.featureUsage.fileUploads)}</div>
                  <p className="text-sm text-gray-600">Загрузок файлов</p>
                </div>
                <div className="text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{formatNumber(data.featureUsage.aiInteractions)}</div>
                  <p className="text-sm text-gray-600">AI взаимодействий</p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <div className="text-2xl font-bold">{formatNumber(data.featureUsage.searchQueries)}</div>
                  <p className="text-sm text-gray-600">Поисковых запросов</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Пользовательские метрики</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.customMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <div className="text-2xl font-bold">{metric.value}{metric.name.includes('Score') ? '/5' : '%'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}{metric.name.includes('Score') ? '' : '%'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Metrics */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <div className="text-2xl font-bold">{data.performance.pageLoadTime}s</div>
                </div>
                <p className="text-xs text-muted-foreground">Время загрузки страницы</p>
                <div className="mt-2 text-xs text-green-600">
                  Цель: {'<'}1.5s
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <div className="text-2xl font-bold">{data.performance.apiResponseTime}ms</div>
                </div>
                <p className="text-xs text-muted-foreground">API response time</p>
                <div className="mt-2 text-xs text-green-600">
                  Цель: {'<'}200ms
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <div className="text-2xl font-bold">{data.performance.errorRate}%</div>
                </div>
                <p className="text-xs text-muted-foreground">Error rate</p>
                <div className="mt-2 text-xs text-green-600">
                  Цель: {'<'}1%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <div className="text-2xl font-bold">{data.performance.uptime}%</div>
                </div>
                <p className="text-xs text-muted-foreground">Uptime</p>
                <div className="mt-2 text-xs text-green-600">
                  SLA: 99.9%
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports */}
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Отчеты и дашборды</CardTitle>
                  <CardDescription>
                    Создание и управление аналитическими отчетами
                  </CardDescription>
                </div>
                <Button onClick={createCustomReport}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Создать отчет
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {report.type === 'user-behavior' && <Users className="w-5 h-5 text-blue-600" />}
                        {report.type === 'performance' && <Activity className="w-5 h-5 text-green-600" />}
                        {report.type === 'revenue' && <TrendingUp className="w-5 h-5 text-purple-600" />}
                        {report.type === 'custom' && <BarChart3 className="w-5 h-5 text-orange-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-gray-600">
                          {report.dateRange} • {report.metrics.length} метрик
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge variant="outline">
                        {report.schedule || 'Вручную'}
                      </Badge>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Экспорт данных</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => exportReport('pdf')}>
                  <Download className="w-4 h-4 mr-2" />
                  PDF Report
                </Button>
                <Button variant="outline" onClick={() => exportReport('csv')}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV Data
                </Button>
                <Button variant="outline" onClick={() => exportReport('json')}>
                  <Download className="w-4 h-4 mr-2" />
                  JSON Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}