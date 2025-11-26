'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Database,
  Server,
  Shield,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  DollarSign,
  UserPlus,
  FileText,
  MessageSquare,
  Video,
  Globe,
  Building2,
  Crown,
  Zap,
  Eye,
  Edit,
  Trash2,
  Ban,
  Unlock,
  Mail,
  Phone,
  Calendar,
  Clock
} from 'lucide-react';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalTenants: number;
  activeTenants: number;
  totalRevenue: number;
  monthlyRevenue: number;
  systemUptime: number;
  apiRequests: number;
  storageUsed: number;
  securityIncidents: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: Date;
  tenantId?: string;
  avatar?: string;
  createdAt: Date;
}

interface Tenant {
  id: string;
  name: string;
  owner: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  users: number;
  revenue: number;
  createdAt: Date;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    totalTenants: 0,
    activeTenants: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    systemUptime: 0,
    apiRequests: 0,
    storageUsed: 0,
    securityIncidents: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  // Mock data
  useEffect(() => {
    const mockMetrics: SystemMetrics = {
      totalUsers: 15420,
      activeUsers: 12850,
      totalTenants: 245,
      activeTenants: 198,
      totalRevenue: 487500,
      monthlyRevenue: 45200,
      systemUptime: 99.9,
      apiRequests: 2847392,
      storageUsed: 75,
      securityIncidents: 3,
    };

    const mockUsers: User[] = [
      {
        id: 'user-1',
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        role: 'admin',
        status: 'active',
        lastLogin: new Date('2024-01-15T10:30:00'),
        tenantId: 'tenant-1',
        createdAt: new Date('2023-06-15'),
      },
      {
        id: 'user-2',
        name: 'Мария Иванова',
        email: 'maria.ivanova@example.com',
        role: 'user',
        status: 'active',
        lastLogin: new Date('2024-01-14T16:45:00'),
        tenantId: 'tenant-2',
        createdAt: new Date('2023-08-22'),
      },
      {
        id: 'user-3',
        name: 'Алексей Сидоров',
        email: 'alexey.sidorov@example.com',
        role: 'moderator',
        status: 'suspended',
        lastLogin: new Date('2024-01-10T09:15:00'),
        tenantId: 'tenant-1',
        createdAt: new Date('2023-09-10'),
      },
    ];

    const mockTenants: Tenant[] = [
      {
        id: 'tenant-1',
        name: 'Acme Corporation',
        owner: 'Иван Петров',
        plan: 'enterprise',
        status: 'active',
        users: 150,
        revenue: 15000,
        createdAt: new Date('2023-06-01'),
      },
      {
        id: 'tenant-2',
        name: 'StartupXYZ',
        owner: 'Мария Иванова',
        plan: 'premium',
        status: 'active',
        users: 45,
        revenue: 2250,
        createdAt: new Date('2023-09-15'),
      },
      {
        id: 'tenant-3',
        name: 'Personal User',
        owner: 'Алексей Сидоров',
        plan: 'free',
        status: 'inactive',
        users: 1,
        revenue: 0,
        createdAt: new Date('2024-01-01'),
      },
    ];

    const mockAlerts: SystemAlert[] = [
      {
        id: 'alert-1',
        type: 'error',
        title: 'High CPU Usage',
        message: 'API Gateway service is experiencing high CPU usage (95%)',
        timestamp: new Date('2024-01-15T11:00:00'),
        resolved: false,
      },
      {
        id: 'alert-2',
        type: 'warning',
        title: 'Storage Warning',
        message: 'Storage usage has exceeded 80% capacity',
        timestamp: new Date('2024-01-14T14:30:00'),
        resolved: false,
      },
      {
        id: 'alert-3',
        type: 'info',
        title: 'New User Registration',
        message: '100 new users registered in the last 24 hours',
        timestamp: new Date('2024-01-14T09:00:00'),
        resolved: true,
      },
    ];

    setMetrics(mockMetrics);
    setUsers(mockUsers);
    setTenants(mockTenants);
    setAlerts(mockAlerts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'suspended':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-100';
      case 'moderator':
        return 'text-blue-600 bg-blue-100';
      case 'user':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleUserAction = (userId: string, action: 'activate' | 'suspend' | 'delete') => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : user.status }
        : user
    ));

    if (action === 'delete') {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleTenantAction = (tenantId: string, action: 'activate' | 'suspend' | 'delete') => {
    setTenants(prev => prev.map(tenant =>
      tenant.id === tenantId
        ? { ...tenant, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : tenant.status }
        : tenant
    ));

    if (action === 'delete') {
      setTenants(prev => prev.filter(tenant => tenant.id !== tenantId));
    }
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6" />
              <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  Полный контроль над платформой FOCUS
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              <Activity className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Всего пользователей</p>
            <div className="mt-2 text-xs text-green-600">
              +12% за месяц
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-purple-500" />
              <div className="text-2xl font-bold">{metrics.totalTenants}</div>
            </div>
            <p className="text-xs text-muted-foreground">Активных тенантов</p>
            <div className="mt-2 text-xs text-green-600">
              +8 за неделю
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Месячная выручка</p>
            <div className="mt-2 text-xs text-green-600">
              +15% к прошлому месяцу
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-orange-500" />
              <div className="text-2xl font-bold">{metrics.systemUptime}%</div>
            </div>
            <p className="text-xs text-muted-foreground">Uptime системы</p>
            <div className="mt-2 text-xs text-green-600">
              99.9% SLA
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.apiRequests.toLocaleString()}</div>
            <p className="text-sm text-gray-600">За последний месяц</p>
            <Progress value={75} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Storage Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.storageUsed}%</div>
            <p className="text-sm text-gray-600">Из 1TB доступно</p>
            <Progress value={metrics.storageUsed} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.securityIncidents}</div>
            <p className="text-sm text-gray-600">Активных инцидентов</p>
            <div className="mt-2 text-xs text-red-600">
              Требует внимания
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Системные оповещения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.filter(alert => !alert.resolved).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge className={getAlertColor(alert.type)}>
                    {alert.type === 'error' ? 'Ошибка' : alert.type === 'warning' ? 'Предупреждение' : 'Инфо'}
                  </Badge>
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp.toLocaleString()}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleResolveAlert(alert.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Решено
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="tenants">Тенанты</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Управление пользователями</CardTitle>
                  <CardDescription>
                    Просмотр и управление всеми пользователями платформы
                  </CardDescription>
                </div>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Добавить пользователя
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role === 'admin' ? 'Админ' : user.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === 'active' ? 'Активен' : user.status === 'inactive' ? 'Неактивен' : 'Заблокирован'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-600">
                        <div>Последний вход</div>
                        <div>{user.lastLogin.toLocaleDateString()}</div>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                        >
                          {user.status === 'active' ? <Ban className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(user.id, 'delete')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tenants Management */}
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Управление тенантами</CardTitle>
                  <CardDescription>
                    Контроль над организациями и их подписками
                  </CardDescription>
                </div>
                <Button>
                  <Building2 className="w-4 h-4 mr-2" />
                  Создать тенант
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{tenant.name}</h4>
                        <p className="text-sm text-gray-600">Владелец: {tenant.owner}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{tenant.plan}</Badge>
                          <Badge className={getStatusColor(tenant.status)}>
                            {tenant.status === 'active' ? 'Активен' : tenant.status === 'inactive' ? 'Неактивен' : 'Заблокирован'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm text-gray-600">
                        <div>{tenant.users} пользователей</div>
                        <div>${tenant.revenue}/месяц</div>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTenantAction(tenant.id, tenant.status === 'active' ? 'suspend' : 'activate')}
                        >
                          {tenant.status === 'active' ? <Ban className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTenantAction(tenant.id, 'delete')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Рост пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>За неделю</span>
                    <span className="text-green-600">+234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>За месяц</span>
                    <span className="text-green-600">+1,890</span>
                  </div>
                  <div className="flex justify-between">
                    <span>За квартал</span>
                    <span className="text-green-600">+7,543</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Выручка</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Этот месяц</span>
                    <span className="font-bold">$45,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Прошлый месяц</span>
                    <span>$39,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Изменение</span>
                    <span className="text-green-600">+14.6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Популярные функции</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Чаты</span>
                  </div>
                  <span>89% пользователей</span>
                </div>
                <Progress value={89} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Видеозвонки</span>
                  </div>
                  <span>67% пользователей</span>
                </div>
                <Progress value={67} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Совместное редактирование</span>
                  </div>
                  <span>45% пользователей</span>
                </div>
                <Progress value={45} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Системные настройки</CardTitle>
              <CardDescription>
                Глобальные настройки платформы FOCUS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Регистрация пользователей</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Открытая регистрация</span>
                      <Badge className="bg-green-100 text-green-800">Включено</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email верификация</span>
                      <Badge className="bg-green-100 text-green-800">Обязательно</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Безопасность</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">MFA</span>
                      <Badge className="bg-green-100 text-green-800">Включено</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rate limiting</span>
                      <Badge className="bg-green-100 text-green-800">Активно</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Расширенные настройки
                </Button>
                <Button variant="outline">
                  <Database className="w-4 h-4 mr-2" />
                  Резервное копирование
                </Button>
                <Button variant="outline">
                  <Shield className="w-4 h-4 mr-2" />
                  Аудит логов
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}