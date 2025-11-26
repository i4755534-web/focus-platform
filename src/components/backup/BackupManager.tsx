'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Download,
  Upload,
  Database,
  HardDrive,
  Cloud,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Trash2
} from 'lucide-react';

interface Backup {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'pending' | 'running' | 'completed' | 'failed';
  size: number;
  createdAt: Date;
  location: 'local' | 'cloud' | 'external';
  checksum: string;
  retention: number; // days
  progress?: number;
}

interface RecoveryPoint {
  id: string;
  timestamp: Date;
  type: 'automatic' | 'manual';
  size: number;
  status: 'available' | 'corrupted' | 'expired';
  description: string;
}

interface DisasterRecoveryPlan {
  id: string;
  name: string;
  description: string;
  rto: number; // Recovery Time Objective in hours
  rpo: number; // Recovery Point Objective in hours
  steps: string[];
  lastTested: Date;
  status: 'active' | 'inactive' | 'testing';
}

export default function BackupManager() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [recoveryPoints, setRecoveryPoints] = useState<RecoveryPoint[]>([]);
  const [drPlans, setDrPlans] = useState<DisasterRecoveryPlan[]>([]);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [selectedBackupType, setSelectedBackupType] = useState<'full' | 'incremental' | 'differential'>('full');
  const [systemHealth, setSystemHealth] = useState({
    status: 'healthy' as 'healthy' | 'warning' | 'critical',
    lastBackup: new Date(),
    storageUsed: 75, // percentage
    uptime: 99.9, // percentage
  });

  // Mock data
  useEffect(() => {
    const mockBackups: Backup[] = [
      {
        id: 'backup-1',
        name: 'Daily Full Backup',
        type: 'full',
        status: 'completed',
        size: 2147483648, // 2GB
        createdAt: new Date('2024-01-15T02:00:00'),
        location: 'cloud',
        checksum: 'sha256:abc123...',
        retention: 30,
      },
      {
        id: 'backup-2',
        name: 'Incremental Backup',
        type: 'incremental',
        status: 'completed',
        size: 536870912, // 512MB
        createdAt: new Date('2024-01-14T02:00:00'),
        location: 'local',
        checksum: 'sha256:def456...',
        retention: 7,
      },
      {
        id: 'backup-3',
        name: 'Manual Backup',
        type: 'full',
        status: 'running',
        size: 0,
        createdAt: new Date(),
        location: 'cloud',
        checksum: '',
        retention: 90,
        progress: 65,
      },
    ];

    const mockRecoveryPoints: RecoveryPoint[] = [
      {
        id: 'rp-1',
        timestamp: new Date('2024-01-15T02:00:00'),
        type: 'automatic',
        size: 2147483648,
        status: 'available',
        description: 'Daily full backup',
      },
      {
        id: 'rp-2',
        timestamp: new Date('2024-01-14T14:30:00'),
        type: 'manual',
        size: 1073741824,
        status: 'available',
        description: 'Pre-deployment backup',
      },
    ];

    const mockDrPlans: DisasterRecoveryPlan[] = [
      {
        id: 'dr-1',
        name: 'Primary DR Plan',
        description: 'Complete disaster recovery for primary data center',
        rto: 4, // 4 hours
        rpo: 1, // 1 hour
        steps: [
          'Activate secondary data center',
          'Restore from latest backup',
          'Redirect traffic to secondary site',
          'Validate system functionality',
        ],
        lastTested: new Date('2024-01-10'),
        status: 'active',
      },
    ];

    setBackups(mockBackups);
    setRecoveryPoints(mockRecoveryPoints);
    setDrPlans(mockDrPlans);
  }, []);

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'available':
      case 'active':
        return 'text-green-600';
      case 'running':
      case 'testing':
        return 'text-blue-600';
      case 'failed':
      case 'corrupted':
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'available':
        return <CheckCircle className="w-4 h-4" />;
      case 'running':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'failed':
      case 'corrupted':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true);

    // Mock backup creation
    const newBackup: Backup = {
      id: `backup-${Date.now()}`,
      name: `${selectedBackupType.charAt(0).toUpperCase() + selectedBackupType.slice(1)} Backup`,
      type: selectedBackupType,
      status: 'running',
      size: 0,
      createdAt: new Date(),
      location: 'cloud',
      checksum: '',
      retention: selectedBackupType === 'full' ? 30 : 7,
      progress: 0,
    };

    setBackups(prev => [newBackup, ...prev]);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setBackups(prev => prev.map(b =>
          b.id === newBackup.id
            ? { ...b, status: 'completed', progress: 100, size: Math.floor(Math.random() * 1073741824) + 536870912 }
            : b
        ));
        setIsCreatingBackup(false);
      } else {
        setBackups(prev => prev.map(b =>
          b.id === newBackup.id ? { ...b, progress } : b
        ));
      }
    }, 500);
  };

  const handleRestore = (backupId: string) => {
    console.log('Restoring from backup:', backupId);
    // Implementation would trigger restore process
  };

  const handleDeleteBackup = (backupId: string) => {
    setBackups(prev => prev.filter(b => b.id !== backupId));
  };

  const handleTestDrPlan = (planId: string) => {
    console.log('Testing DR plan:', planId);
    // Implementation would run DR test
  };

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Состояние системы
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor(systemHealth.status)}`}>
                {systemHealth.status === 'healthy' ? '✓' : systemHealth.status === 'warning' ? '!' : '✗'}
              </div>
              <div className="text-sm text-gray-600">Статус</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{systemHealth.uptime}%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{systemHealth.storageUsed}%</div>
              <div className="text-sm text-gray-600">Хранилище</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sm">
                {systemHealth.lastBackup.toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Последний бэкап</div>
            </div>
          </div>

          {systemHealth.status !== 'healthy' && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {systemHealth.status === 'warning'
                  ? 'Рекомендуется проверить состояние резервных копий'
                  : 'Критическое состояние! Требуется немедленное вмешательство'
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Резервные копии</TabsTrigger>
          <TabsTrigger value="recovery">Восстановление</TabsTrigger>
          <TabsTrigger value="disaster-recovery">DR планы</TabsTrigger>
        </TabsList>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Резервные копии</CardTitle>
                  <CardDescription>
                    Управление резервными копиями системы
                  </CardDescription>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Создать бэкап
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать резервную копию</DialogTitle>
                      <DialogDescription>
                        Выберите тип резервной копии для создания
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Тип бэкапа</label>
                        <Select value={selectedBackupType} onValueChange={(value: any) => setSelectedBackupType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Полный бэкап</SelectItem>
                            <SelectItem value="incremental">Инкрементальный</SelectItem>
                            <SelectItem value="differential">Дифференциальный</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreatingBackup(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                          {isCreatingBackup ? 'Создание...' : 'Создать'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        <div>
                          <h4 className="font-medium">{backup.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Badge variant="outline">{backup.type}</Badge>
                            <span>{formatFileSize(backup.size)}</span>
                            <span>{backup.location}</span>
                            <span>{backup.createdAt.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {backup.progress !== undefined && backup.status === 'running' && (
                        <div className="w-24">
                          <Progress value={backup.progress} />
                        </div>
                      )}

                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(backup.id)}
                        disabled={backup.status !== 'completed'}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Восстановить
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Точки восстановления</CardTitle>
              <CardDescription>
                Доступные точки для восстановления системы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recoveryPoints.map((point) => (
                  <div key={point.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(point.status)}
                      <div>
                        <h4 className="font-medium">{point.description}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Badge variant="outline">{point.type}</Badge>
                          <span>{formatFileSize(point.size)}</span>
                          <span>{point.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(point.status)}>
                        {point.status}
                      </Badge>

                      <Button
                        size="sm"
                        variant="outline"
                        disabled={point.status !== 'available'}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Восстановить
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disaster Recovery Tab */}
        <TabsContent value="disaster-recovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Планы восстановления после катастроф</CardTitle>
              <CardDescription>
                Стратегии восстановления системы при катастрофических сбоях
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm font-medium">RTO (Recovery Time Objective)</div>
                          <div className="text-lg">{plan.rto} часов</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium">RPO (Recovery Point Objective)</div>
                          <div className="text-lg">{plan.rpo} часов</div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-sm font-medium mb-2">Шаги восстановления:</div>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          {plan.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Последнее тестирование: {plan.lastTested.toLocaleDateString()}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTestDrPlan(plan.id)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Протестировать
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}