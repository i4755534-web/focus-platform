'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Lock,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Server,
  Globe,
  Database,
  Zap,
  Settings,
  RefreshCw,
  Download,
  Upload
} from 'lucide-react';

interface SecurityRule {
  id: string;
  name: string;
  type: 'rate_limit' | 'ip_block' | 'auth_policy' | 'encryption' | 'audit';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  config: Record<string, any>;
  lastTriggered?: Date;
  violations: number;
}

interface SecurityIncident {
  id: string;
  type: 'brute_force' | 'suspicious_login' | 'data_breach' | 'unauthorized_access' | 'rate_limit_exceeded';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'false_positive';
  description: string;
  affectedUsers: number;
  timestamp: Date;
  source: {
    ip: string;
    userAgent: string;
    location?: string;
  };
  actions: string[];
}

interface SecurityMetrics {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  blockedIPs: number;
  failedLogins: number;
  rateLimitHits: number;
  encryptionStatus: 'enabled' | 'partial' | 'disabled';
  lastSecurityScan: Date;
  securityScore: number;
}

export default function SecurityManager() {
  const [rules, setRules] = useState<SecurityRule[]>([]);
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    blockedIPs: 0,
    failedLogins: 0,
    rateLimitHits: 0,
    encryptionStatus: 'enabled',
    lastSecurityScan: new Date(),
    securityScore: 95,
  });
  const [selectedRule, setSelectedRule] = useState<SecurityRule | null>(null);
  const [showCreateRule, setShowCreateRule] = useState(false);

  // Mock data
  useEffect(() => {
    const mockRules: SecurityRule[] = [
      {
        id: 'rate-limit-api',
        name: 'Rate Limiting - API',
        type: 'rate_limit',
        enabled: true,
        severity: 'medium',
        description: 'Ограничение количества запросов к API',
        config: {
          requestsPerMinute: 100,
          burstLimit: 20,
          blockDuration: 300,
        },
        violations: 45,
        lastTriggered: new Date('2024-01-15T10:30:00'),
      },
      {
        id: 'ip-block-suspicious',
        name: 'Блокировка подозрительных IP',
        type: 'ip_block',
        enabled: true,
        severity: 'high',
        description: 'Автоматическая блокировка IP с подозрительной активностью',
        config: {
          maxFailedAttempts: 5,
          blockDuration: 3600,
          whitelist: ['192.168.1.0/24'],
        },
        violations: 12,
        lastTriggered: new Date('2024-01-14T08:15:00'),
      },
      {
        id: 'auth-policy-mfa',
        name: 'Политика MFA',
        type: 'auth_policy',
        enabled: true,
        severity: 'high',
        description: 'Обязательная двухфакторная аутентификация',
        config: {
          requiredForAdmins: true,
          requiredForUsers: false,
          gracePeriod: 7,
        },
        violations: 0,
      },
      {
        id: 'encryption-at-rest',
        name: 'Шифрование данных',
        type: 'encryption',
        enabled: true,
        severity: 'critical',
        description: 'Шифрование данных в покое',
        config: {
          algorithm: 'AES-256-GCM',
          keyRotation: 90,
          backupEncryption: true,
        },
        violations: 0,
      },
      {
        id: 'audit-logging',
        name: 'Аудит действий',
        type: 'audit',
        enabled: true,
        severity: 'medium',
        description: 'Полное логирование всех действий пользователей',
        config: {
          retentionDays: 365,
          sensitiveActions: ['login', 'password_change', 'data_export'],
          realTimeAlerts: true,
        },
        violations: 0,
      },
    ];

    const mockIncidents: SecurityIncident[] = [
      {
        id: 'incident-1',
        type: 'brute_force',
        severity: 'high',
        status: 'investigating',
        description: 'Обнаружена попытка brute force атаки на учетную запись admin',
        affectedUsers: 1,
        timestamp: new Date('2024-01-15T09:45:00'),
        source: {
          ip: '203.0.113.195',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Unknown',
        },
        actions: ['IP заблокирован', 'Уведомление отправлено администратору'],
      },
      {
        id: 'incident-2',
        type: 'suspicious_login',
        severity: 'medium',
        status: 'resolved',
        description: 'Вход из необычного местоположения',
        affectedUsers: 1,
        timestamp: new Date('2024-01-14T16:20:00'),
        source: {
          ip: '198.51.100.15',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
          location: 'Moscow, Russia',
        },
        actions: ['MFA запрос отправлен', 'Пользователь подтвердил вход'],
      },
      {
        id: 'incident-3',
        type: 'rate_limit_exceeded',
        severity: 'low',
        status: 'resolved',
        description: 'Превышение лимита запросов API',
        affectedUsers: 1,
        timestamp: new Date('2024-01-13T11:30:00'),
        source: {
          ip: '192.0.2.1',
          userAgent: 'PostmanRuntime/7.32.2',
          location: 'Local Network',
        },
        actions: ['Временная блокировка снята', 'Лимиты скорректированы'],
      },
    ];

    setRules(mockRules);
    setIncidents(mockIncidents);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'investigating':
        return 'text-red-600 bg-red-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'false_positive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleRuleToggle = (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled } : rule
    ));
  };

  const handleIncidentStatusChange = (incidentId: string, status: SecurityIncident['status']) => {
    setIncidents(prev => prev.map(incident =>
      incident.id === incidentId ? { ...incident, status } : incident
    ));
  };

  const handleSecurityScan = () => {
    console.log('Running security scan...');
    // Implementation would trigger security scan
  };

  const handleExportAuditLog = () => {
    console.log('Exporting audit log...');
    // Implementation would export audit logs
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <div>
                <CardTitle>Безопасность</CardTitle>
                <CardDescription>
                  Advanced security features и мониторинг угроз
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{metrics.securityScore}%</div>
                <div className="text-sm text-gray-600">Security Score</div>
              </div>
              <Button onClick={handleSecurityScan}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Сканирование
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <div className="text-2xl font-bold">{metrics.activeIncidents}</div>
            </div>
            <p className="text-xs text-muted-foreground">Активных инцидентов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-orange-500" />
              <div className="text-2xl font-bold">{metrics.blockedIPs}</div>
            </div>
            <p className="text-xs text-muted-foreground">Заблокированных IP</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500" />
              <div className="text-2xl font-bold">{metrics.failedLogins}</div>
            </div>
            <p className="text-xs text-muted-foreground">Неудачных входов</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-500" />
              <div className="text-2xl font-bold">{metrics.rateLimitHits}</div>
            </div>
            <p className="text-xs text-muted-foreground">Rate limit нарушений</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle>Статус безопасности</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Шифрование данных</span>
            <Badge className={metrics.encryptionStatus === 'enabled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {metrics.encryptionStatus === 'enabled' ? 'Включено' : 'Отключено'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span>Последнее сканирование</span>
            <span className="text-sm text-gray-600">
              {metrics.lastSecurityScan.toLocaleString()}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Общий security score</span>
              <span>{metrics.securityScore}%</span>
            </div>
            <Progress value={metrics.securityScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Правила безопасности</TabsTrigger>
          <TabsTrigger value="incidents">Инциденты</TabsTrigger>
          <TabsTrigger value="audit">Аудит</TabsTrigger>
          <TabsTrigger value="encryption">Шифрование</TabsTrigger>
        </TabsList>

        {/* Security Rules */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Правила безопасности</CardTitle>
                  <CardDescription>
                    Управление правилами безопасности и политиками
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateRule(true)}>
                  <Settings className="w-4 h-4 mr-2" />
                  Новое правило
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {rule.enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={getSeverityColor(rule.severity)}>
                        {rule.severity}
                      </Badge>

                      <div className="text-sm text-gray-600">
                        <div>Нарушений: {rule.violations}</div>
                        {rule.lastTriggered && (
                          <div>Последнее: {rule.lastTriggered.toLocaleDateString()}</div>
                        )}
                      </div>

                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) => handleRuleToggle(rule.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Incidents */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Инциденты безопасности</CardTitle>
              <CardDescription>
                Мониторинг и управление инцидентами безопасности
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <Card key={incident.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSeverityColor(incident.severity)}>
                              {incident.severity}
                            </Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {incident.timestamp.toLocaleString()}
                            </span>
                          </div>

                          <h4 className="font-medium mb-2">{incident.description}</h4>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">IP:</span> {incident.source.ip}
                            </div>
                            <div>
                              <span className="font-medium">Пользователей:</span> {incident.affectedUsers}
                            </div>
                            <div>
                              <span className="font-medium">User Agent:</span> {incident.source.userAgent.substring(0, 50)}...
                            </div>
                            <div>
                              <span className="font-medium">Местоположение:</span> {incident.source.location || 'Unknown'}
                            </div>
                          </div>

                          {incident.actions.length > 0 && (
                            <div className="mt-3">
                              <div className="text-sm font-medium mb-1">Действия:</div>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {incident.actions.map((action, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <Select
                          value={incident.status}
                          onValueChange={(value: SecurityIncident['status']) =>
                            handleIncidentStatusChange(incident.id, value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Открыт</SelectItem>
                            <SelectItem value="investigating">Расследуется</SelectItem>
                            <SelectItem value="resolved">Решен</SelectItem>
                            <SelectItem value="false_positive">Ложное срабатывание</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Аудит логов</CardTitle>
                  <CardDescription>
                    Журнал всех действий пользователей и системных событий
                  </CardDescription>
                </div>
                <Button onClick={handleExportAuditLog}>
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                <div className="mb-2">[2024-01-15 10:00:00] User admin logged in from 192.168.1.100</div>
                <div className="mb-2">[2024-01-15 09:58:00] Security rule 'rate-limit-api' triggered for IP 203.0.113.195</div>
                <div className="mb-2">[2024-01-15 09:57:00] User john.doe password changed</div>
                <div className="mb-2">[2024-01-15 09:56:00] File 'confidential.docx' accessed by user jane.smith</div>
                <div className="mb-2">[2024-01-15 09:55:00] Failed login attempt for user admin from 203.0.113.195</div>
                <div className="mb-2">[2024-01-15 09:54:00] API key generated for application 'mobile-app'</div>
                <div className="mb-2">[2024-01-15 09:53:00] Database backup completed successfully</div>
                <div className="mb-2">[2024-01-15 09:52:00] Security scan completed - 0 vulnerabilities found</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Encryption Settings */}
        <TabsContent value="encryption" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки шифрования</CardTitle>
              <CardDescription>
                Управление шифрованием данных и ключей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Шифрование в покое</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Алгоритм</span>
                      <Badge>AES-256-GCM</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ключи</span>
                      <Badge variant="outline">Rotated every 90 days</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Бэкапы</span>
                      <Badge className="bg-green-100 text-green-800">Encrypted</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Шифрование в транзите</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">TLS версии</span>
                      <Badge>TLS 1.3</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Сертификаты</span>
                      <Badge className="bg-green-100 text-green-800">Valid</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">HSTS</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Все данные шифруются с использованием современных алгоритмов. Ключи шифрования автоматически ротируются и хранятся в защищенном HSM.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Key className="w-4 h-4 mr-2" />
                  Ротировать ключи
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт ключей
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}