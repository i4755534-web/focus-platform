'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Building2,
  Users,
  Database,
  Settings,
  Plus,
  Edit,
  Trash2,
  Shield,
  Globe,
  Lock,
  Unlock,
  Activity,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  createdAt: Date;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  limits: {
    users: number;
    storage: number; // GB
    bandwidth: number; // GB/month
  };
  usage: {
    users: number;
    storage: number; // GB
    bandwidth: number; // GB
  };
  features: string[];
  settings: {
    theme: string;
    language: string;
    timezone: string;
    customDomain?: string;
  };
}

interface TenantManagerProps {
  currentTenant?: Tenant;
  onTenantSwitch?: (tenant: Tenant) => void;
  isAdmin?: boolean;
}

export default function TenantManager({
  currentTenant,
  onTenantSwitch,
  isAdmin = false
}: TenantManagerProps) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showCreateTenant, setShowCreateTenant] = useState(false);
  const [newTenantData, setNewTenantData] = useState({
    name: '',
    domain: '',
    plan: 'free' as const,
    ownerEmail: '',
  });
  const [loading, setLoading] = useState(false);

  // Mock data
  useEffect(() => {
    const mockTenants: Tenant[] = [
      {
        id: 'tenant-1',
        name: 'Acme Corporation',
        domain: 'acme.focus.com',
        status: 'active',
        plan: 'enterprise',
        createdAt: new Date('2024-01-15'),
        owner: {
          id: 'user-1',
          name: 'John Smith',
          email: 'john@acme.com',
        },
        limits: {
          users: 1000,
          storage: 1000,
          bandwidth: 50000,
        },
        usage: {
          users: 245,
          storage: 234.5,
          bandwidth: 12500,
        },
        features: ['advanced-analytics', 'custom-integrations', 'priority-support', 'white-labeling'],
        settings: {
          theme: 'blue',
          language: 'en',
          timezone: 'America/New_York',
          customDomain: 'acme.focus.com',
        },
      },
      {
        id: 'tenant-2',
        name: 'StartupXYZ',
        domain: 'startupxyz.focus.com',
        status: 'active',
        plan: 'premium',
        createdAt: new Date('2024-02-01'),
        owner: {
          id: 'user-2',
          name: 'Jane Doe',
          email: 'jane@startupxyz.com',
        },
        limits: {
          users: 100,
          storage: 100,
          bandwidth: 5000,
        },
        usage: {
          users: 23,
          storage: 12.3,
          bandwidth: 234,
        },
        features: ['advanced-analytics', 'custom-integrations'],
        settings: {
          theme: 'green',
          language: 'en',
          timezone: 'Europe/London',
        },
      },
      {
        id: 'tenant-3',
        name: 'Personal User',
        domain: 'personal-user.focus.com',
        status: 'active',
        plan: 'free',
        createdAt: new Date('2024-03-10'),
        owner: {
          id: 'user-3',
          name: 'Bob Wilson',
          email: 'bob@example.com',
        },
        limits: {
          users: 1,
          storage: 5,
          bandwidth: 100,
        },
        usage: {
          users: 1,
          storage: 0.8,
          bandwidth: 12,
        },
        features: ['basic-features'],
        settings: {
          theme: 'default',
          language: 'en',
          timezone: 'UTC',
        },
      },
    ];

    setTenants(mockTenants);
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-100';
      case 'premium':
        return 'text-blue-600 bg-blue-100';
      case 'basic':
        return 'text-green-600 bg-green-100';
      case 'free':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleCreateTenant = async () => {
    if (!newTenantData.name || !newTenantData.domain || !newTenantData.ownerEmail) return;

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTenant: Tenant = {
        id: `tenant-${Date.now()}`,
        name: newTenantData.name,
        domain: newTenantData.domain,
        status: 'active',
        plan: newTenantData.plan,
        createdAt: new Date(),
        owner: {
          id: `user-${Date.now()}`,
          name: 'New Owner',
          email: newTenantData.ownerEmail,
        },
        limits: {
          users: newTenantData.plan === 'free' ? 1 : newTenantData.plan === 'basic' ? 10 : newTenantData.plan === 'premium' ? 100 : 1000,
          storage: newTenantData.plan === 'free' ? 5 : newTenantData.plan === 'basic' ? 50 : newTenantData.plan === 'premium' ? 500 : 5000,
          bandwidth: newTenantData.plan === 'free' ? 100 : newTenantData.plan === 'basic' ? 1000 : newTenantData.plan === 'premium' ? 10000 : 100000,
        },
        usage: {
          users: 0,
          storage: 0,
          bandwidth: 0,
        },
        features: newTenantData.plan === 'free' ? ['basic-features'] :
                 newTenantData.plan === 'basic' ? ['basic-features', 'analytics'] :
                 newTenantData.plan === 'premium' ? ['basic-features', 'analytics', 'integrations'] :
                 ['all-features'],
        settings: {
          theme: 'default',
          language: 'en',
          timezone: 'UTC',
        },
      };

      setTenants(prev => [...prev, newTenant]);
      setNewTenantData({ name: '', domain: '', plan: 'free', ownerEmail: '' });
      setShowCreateTenant(false);
    } catch (error) {
      console.error('Failed to create tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantAction = (tenant: Tenant, action: 'activate' | 'suspend' | 'delete') => {
    setTenants(prev => prev.map(t =>
      t.id === tenant.id
        ? { ...t, status: action === 'activate' ? 'active' : action === 'suspend' ? 'suspended' : t.status }
        : t
    ));

    if (action === 'delete') {
      setTenants(prev => prev.filter(t => t.id !== tenant.id));
    }
  };

  const handleSwitchTenant = (tenant: Tenant) => {
    onTenantSwitch?.(tenant);
    setSelectedTenant(tenant);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6" />
              <div>
                <CardTitle>Управление тенантами</CardTitle>
                <CardDescription>
                  Мульти-тенантная архитектура с изоляцией данных
                </CardDescription>
              </div>
            </div>

            {isAdmin && (
              <Dialog open={showCreateTenant} onOpenChange={setShowCreateTenant}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать тенант
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создать нового тенанта</DialogTitle>
                    <DialogDescription>
                      Настройте параметры для нового тенанта
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Название организации</Label>
                      <Input
                        id="name"
                        value={newTenantData.name}
                        onChange={(e) => setNewTenantData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Acme Corporation"
                      />
                    </div>
                    <div>
                      <Label htmlFor="domain">Домен</Label>
                      <Input
                        id="domain"
                        value={newTenantData.domain}
                        onChange={(e) => setNewTenantData(prev => ({ ...prev, domain: e.target.value }))}
                        placeholder="acme.focus.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="plan">Тарифный план</Label>
                      <Select value={newTenantData.plan} onValueChange={(value: any) => setNewTenantData(prev => ({ ...prev, plan: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Бесплатный</SelectItem>
                          <SelectItem value="basic">Базовый</SelectItem>
                          <SelectItem value="premium">Премиум</SelectItem>
                          <SelectItem value="enterprise">Корпоративный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="owner">Email владельца</Label>
                      <Input
                        id="owner"
                        type="email"
                        value={newTenantData.ownerEmail}
                        onChange={(e) => setNewTenantData(prev => ({ ...prev, ownerEmail: e.target.value }))}
                        placeholder="owner@company.com"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateTenant(false)}>
                        Отмена
                      </Button>
                      <Button onClick={handleCreateTenant} disabled={loading}>
                        {loading ? 'Создание...' : 'Создать'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Current Tenant Info */}
      {currentTenant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Текущий тенант: {currentTenant.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentTenant.usage.users}</div>
                <div className="text-sm text-gray-600">Пользователей</div>
                <Progress value={(currentTenant.usage.users / currentTenant.limits.users) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentTenant.usage.storage.toFixed(1)} GB</div>
                <div className="text-sm text-gray-600">Хранилище</div>
                <Progress value={(currentTenant.usage.storage / currentTenant.limits.storage) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentTenant.usage.bandwidth} GB</div>
                <div className="text-sm text-gray-600">Трафик</div>
                <Progress value={(currentTenant.usage.bandwidth / currentTenant.limits.bandwidth) * 100} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tenants List */}
      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Тенанты</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id} className={`cursor-pointer transition-all ${
                selectedTenant?.id === tenant.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
              }`} onClick={() => handleSwitchTenant(tenant)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${tenant.name}`} />
                        <AvatarFallback>
                          {tenant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{tenant.name}</CardTitle>
                        <CardDescription>{tenant.domain}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Badge className={getStatusColor(tenant.status)}>
                        {tenant.status === 'active' ? 'Активен' : tenant.status === 'inactive' ? 'Неактивен' : 'Заблокирован'}
                      </Badge>
                      <Badge className={getPlanColor(tenant.plan)}>
                        {tenant.plan === 'free' ? 'Бесплатный' :
                         tenant.plan === 'basic' ? 'Базовый' :
                         tenant.plan === 'premium' ? 'Премиум' : 'Корпоративный'}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Пользователи
                      </span>
                      <span>{tenant.usage.users}/{tenant.limits.users}</span>
                    </div>
                    <Progress value={(tenant.usage.users / tenant.limits.users) * 100} />

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        Хранилище
                      </span>
                      <span>{tenant.usage.storage.toFixed(1)}/{tenant.limits.storage} GB</span>
                    </div>
                    <Progress value={(tenant.usage.storage / tenant.limits.storage) * 100} />

                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSwitchTenant(tenant);
                        }}
                        className="flex-1"
                      >
                        Переключиться
                      </Button>

                      {isAdmin && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTenantAction(tenant, tenant.status === 'active' ? 'suspend' : 'activate');
                            }}
                          >
                            {tenant.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTenantAction(tenant, 'delete');
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Всего тенантов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tenants.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 за последний месяц
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Активных пользователей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tenants.reduce((sum, t) => sum + t.usage.users, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Общий счетчик
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Используемое хранилище</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tenants.reduce((sum, t) => sum + t.usage.storage, 0).toFixed(1)} GB
                </div>
                <p className="text-xs text-muted-foreground">
                  Общий объем
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Средний тариф</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${tenants.reduce((sum, t) => {
                    const prices = { free: 0, basic: 10, premium: 50, enterprise: 200 };
                    return sum + prices[t.plan];
                  }, 0) / tenants.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  В месяц
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Распределение по тарифам</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['free', 'basic', 'premium', 'enterprise'].map(plan => {
                  const count = tenants.filter(t => t.plan === plan).length;
                  const percentage = (count / tenants.length) * 100;
                  return (
                    <div key={plan} className="flex items-center justify-between">
                      <span className="capitalize">{plan}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={percentage} className="w-24" />
                        <span className="text-sm w-8">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Глобальные настройки мульти-тенантности</CardTitle>
              <CardDescription>
                Настройки, применяемые ко всем тенантам
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Изоляция данных</Label>
                  <p className="text-sm text-gray-600">Полная изоляция баз данных между тенантами</p>
                </div>
                <Badge variant="secondary">
                  <Shield className="w-3 h-3 mr-1" />
                  Включено
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Автоматическое масштабирование</Label>
                  <p className="text-sm text-gray-600">Автоматическое распределение ресурсов</p>
                </div>
                <Badge variant="secondary">
                  <Activity className="w-3 h-3 mr-1" />
                  Включено
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Мониторинг использования</Label>
                  <p className="text-sm text-gray-600">Отслеживание лимитов и использование ресурсов</p>
                </div>
                <Badge variant="secondary">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Включено
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Резервное копирование</Label>
                  <p className="text-sm text-gray-600">Автоматическое резервное копирование данных</p>
                </div>
                <Badge variant="secondary">
                  <Database className="w-3 h-3 mr-1" />
                  Включено
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}