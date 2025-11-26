'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Server,
  Database,
  Zap,
  Activity,
  RefreshCw,
  Play,
  Square,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Network,
  Cpu,
  HardDrive,
  BarChart3,
  Shield
} from 'lucide-react';

interface Microservice {
  id: string;
  name: string;
  type: 'api' | 'auth' | 'database' | 'cache' | 'queue' | 'storage' | 'ai' | 'realtime';
  status: 'running' | 'stopped' | 'error' | 'starting' | 'stopping';
  version: string;
  port: number;
  health: {
    cpu: number;
    memory: number;
    responseTime: number;
    uptime: number;
  };
  dependencies: string[];
  endpoints: string[];
  lastDeployed: Date;
  environment: 'development' | 'staging' | 'production';
}

interface ServiceManagerProps {
  environment?: 'development' | 'staging' | 'production';
}

export default function ServiceManager({ environment = 'development' }: ServiceManagerProps) {
  const [services, setServices] = useState<Microservice[]>([]);
  const [selectedService, setSelectedService] = useState<Microservice | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [metrics, setMetrics] = useState({
    totalServices: 0,
    runningServices: 0,
    avgResponseTime: 0,
    totalCpuUsage: 0,
    totalMemoryUsage: 0,
  });

  // Mock data
  useEffect(() => {
    const mockServices: Microservice[] = [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        type: 'api',
        status: 'running',
        version: '2.1.0',
        port: 3000,
        health: {
          cpu: 15,
          memory: 256,
          responseTime: 45,
          uptime: 99.9,
        },
        dependencies: ['auth-service', 'cache-service'],
        endpoints: ['/api/*', '/health', '/metrics'],
        lastDeployed: new Date('2024-01-15T10:00:00'),
        environment,
      },
      {
        id: 'auth-service',
        name: 'Authentication Service',
        type: 'auth',
        status: 'running',
        version: '1.8.2',
        port: 3001,
        health: {
          cpu: 8,
          memory: 128,
          responseTime: 25,
          uptime: 99.8,
        },
        dependencies: ['database-service'],
        endpoints: ['/auth/login', '/auth/verify', '/auth/refresh'],
        lastDeployed: new Date('2024-01-14T15:30:00'),
        environment,
      },
      {
        id: 'database-service',
        name: 'Database Service',
        type: 'database',
        status: 'running',
        version: '3.2.1',
        port: 5432,
        health: {
          cpu: 25,
          memory: 1024,
          responseTime: 12,
          uptime: 99.95,
        },
        dependencies: [],
        endpoints: ['postgresql://localhost:5432/focus'],
        lastDeployed: new Date('2024-01-13T09:00:00'),
        environment,
      },
      {
        id: 'cache-service',
        name: 'Cache Service',
        type: 'cache',
        status: 'running',
        version: '2.0.5',
        port: 6379,
        health: {
          cpu: 5,
          memory: 64,
          responseTime: 2,
          uptime: 99.99,
        },
        dependencies: [],
        endpoints: ['redis://localhost:6379'],
        lastDeployed: new Date('2024-01-12T20:00:00'),
        environment,
      },
      {
        id: 'realtime-service',
        name: 'Real-time Service',
        type: 'realtime',
        status: 'running',
        version: '1.5.0',
        port: 3002,
        health: {
          cpu: 12,
          memory: 192,
          responseTime: 35,
          uptime: 99.7,
        },
        dependencies: ['auth-service', 'cache-service'],
        endpoints: ['ws://localhost:3002', '/socket.io/*'],
        lastDeployed: new Date('2024-01-11T14:00:00'),
        environment,
      },
      {
        id: 'ai-service',
        name: 'AI Service',
        type: 'ai',
        status: 'error',
        version: '1.2.3',
        port: 3003,
        health: {
          cpu: 0,
          memory: 0,
          responseTime: 0,
          uptime: 0,
        },
        dependencies: ['cache-service'],
        endpoints: ['/ai/search', '/ai/recommend', '/ai/analyze'],
        lastDeployed: new Date('2024-01-10T11:00:00'),
        environment,
      },
    ];

    setServices(mockServices);

    // Calculate metrics
    const running = mockServices.filter(s => s.status === 'running').length;
    const avgResponseTime = mockServices.reduce((sum, s) => sum + s.health.responseTime, 0) / mockServices.length;
    const totalCpu = mockServices.reduce((sum, s) => sum + s.health.cpu, 0);
    const totalMemory = mockServices.reduce((sum, s) => sum + s.health.memory, 0);

    setMetrics({
      totalServices: mockServices.length,
      runningServices: running,
      avgResponseTime: Math.round(avgResponseTime),
      totalCpuUsage: totalCpu,
      totalMemoryUsage: totalMemory,
    });

    // Mock logs
    setLogs([
      '[2024-01-15 10:00:00] API Gateway started successfully',
      '[2024-01-15 09:58:00] Auth Service health check passed',
      '[2024-01-15 09:57:00] Database connection established',
      '[2024-01-15 09:56:00] Cache service initialized',
      '[2024-01-15 09:55:00] AI Service failed to start - GPU not available',
      '[2024-01-15 09:54:00] Real-time service WebSocket connections ready',
    ]);
  }, [environment]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'text-green-600 bg-green-100';
      case 'stopped':
        return 'text-gray-600 bg-gray-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'starting':
        return 'text-blue-600 bg-blue-100';
      case 'stopping':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4" />;
      case 'stopped':
        return <Square className="w-4 h-4" />;
      case 'error':
        return <XCircle className="w-4 h-4" />;
      case 'starting':
      case 'stopping':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Server className="w-5 h-5" />;
      case 'auth':
        return <Shield className="w-5 h-5" />;
      case 'database':
        return <Database className="w-5 h-5" />;
      case 'cache':
        return <Zap className="w-5 h-5" />;
      case 'realtime':
        return <Network className="w-5 h-5" />;
      case 'ai':
        return <Cpu className="w-5 h-5" />;
      default:
        return <Server className="w-5 h-5" />;
    }
  };

  const handleServiceAction = (serviceId: string, action: 'start' | 'stop' | 'restart') => {
    setServices(prev => prev.map(service =>
      service.id === serviceId
        ? {
            ...service,
            status: action === 'start' ? 'starting' :
                   action === 'stop' ? 'stopping' :
                   'starting'
          }
        : service
    ));

    // Simulate action completion
    setTimeout(() => {
      setServices(prev => prev.map(service =>
        service.id === serviceId
          ? {
              ...service,
              status: action === 'stop' ? 'stopped' :
                     action === 'restart' ? 'running' :
                     'running'
            }
          : service
      ));
    }, 2000);
  };

  const handleDeployService = (serviceId: string) => {
    console.log('Deploying service:', serviceId);
    // Implementation would trigger deployment
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server className="w-6 h-6" />
              <div>
                <CardTitle>Управление микросервисами</CardTitle>
                <CardDescription>
                  Мониторинг и управление микросервисной архитектурой ({environment})
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="capitalize">
              {environment}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" />
              <div className="text-2xl font-bold">{metrics.totalServices}</div>
            </div>
            <p className="text-xs text-muted-foreground">Всего сервисов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">{metrics.runningServices}</div>
            </div>
            <p className="text-xs text-muted-foreground">Запущено</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <div className="text-2xl font-bold">{metrics.avgResponseTime}ms</div>
            </div>
            <p className="text-xs text-muted-foreground">Среднее время ответа</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-500" />
              <div className="text-2xl font-bold">{metrics.totalCpuUsage}%</div>
            </div>
            <p className="text-xs text-muted-foreground">CPU использование</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">{metrics.totalMemoryUsage}MB</div>
            </div>
            <p className="text-xs text-muted-foreground">Память</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Alerts */}
      {services.some(s => s.status === 'error') && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Некоторые сервисы находятся в состоянии ошибки. Проверьте логи для получения дополнительной информации.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Сервисы</TabsTrigger>
          <TabsTrigger value="topology">Топология</TabsTrigger>
          <TabsTrigger value="logs">Логи</TabsTrigger>
          <TabsTrigger value="metrics">Метрики</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className={`cursor-pointer transition-all ${
                  selectedService?.id === service.id ? 'ring-2 ring-blue-500' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedService(service)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getServiceIcon(service.type)}
                      <div>
                        <CardTitle className="text-lg">{service.name}</CardTitle>
                        <CardDescription>v{service.version}</CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(service.status)}>
                      {getStatusIcon(service.status)}
                      <span className="ml-1 capitalize">{service.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Port:</span>
                      <span className="font-mono">{service.port}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>CPU:</span>
                        <span>{service.health.cpu}%</span>
                      </div>
                      <Progress value={service.health.cpu} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory:</span>
                        <span>{service.health.memory}MB</span>
                      </div>
                      <Progress value={(service.health.memory / 1024) * 100} className="h-2" />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Response:</span>
                      <span>{service.health.responseTime}ms</span>
                    </div>

                    <div className="flex gap-1 mt-4">
                      {service.status === 'running' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleServiceAction(service.id, 'restart');
                            }}
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleServiceAction(service.id, 'stop');
                            }}
                          >
                            <Square className="w-3 h-3" />
                          </Button>
                        </>
                      ) : service.status === 'stopped' ? (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleServiceAction(service.id, 'start');
                          }}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Запустить
                        </Button>
                      ) : (
                        <Button size="sm" disabled>
                          <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                          {service.status === 'starting' ? 'Запуск...' : 'Остановка...'}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeployService(service.id);
                        }}
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Topology Tab */}
        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Архитектура микросервисов</CardTitle>
              <CardDescription>
                Взаимосвязи и зависимости между сервисами
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getServiceIcon(service.type)}
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">Port: {service.port}</p>
                      </div>
                    </div>

                    {service.dependencies.length > 0 && (
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">Зависимости:</div>
                        <div className="flex gap-1 flex-wrap">
                          {service.dependencies.map((dep) => (
                            <Badge key={dep} variant="secondary" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-right">
                      <div className="text-sm font-medium">{service.endpoints.length} endpoints</div>
                      <div className="text-xs text-gray-600">Uptime: {service.health.uptime}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Системные логи</CardTitle>
              <CardDescription>
                Журнал событий и сообщений от микросервисов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Производительность
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Среднее время ответа</span>
                    <span>{metrics.avgResponseTime}ms</span>
                  </div>
                  <Progress value={Math.min(metrics.avgResponseTime / 100 * 100, 100)} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Загрузка CPU</span>
                    <span>{metrics.totalCpuUsage}%</span>
                  </div>
                  <Progress value={metrics.totalCpuUsage} />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Использование памяти</span>
                    <span>{(metrics.totalMemoryUsage / 1024).toFixed(1)}GB</span>
                  </div>
                  <Progress value={(metrics.totalMemoryUsage / 2048) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Состояние сервисов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['running', 'stopped', 'error', 'starting', 'stopping'].map((status) => {
                    const count = services.filter(s => s.status === status).length;
                    const percentage = (count / services.length) * 100;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(status)}
                          <span className="capitalize text-sm">{status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={percentage} className="w-16 h-2" />
                          <span className="text-sm w-6">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}