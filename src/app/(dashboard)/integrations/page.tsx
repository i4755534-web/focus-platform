'use client';

import { useEffect, useState } from 'react';
import { useIntegrations } from '@/hooks/useIntegrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function IntegrationsPage() {
  const { integrations, loading, error, fetchIntegrations, connectIntegration, disconnectIntegration } = useIntegrations();
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  const handleConnect = async (integrationId: string) => {
    try {
      await connectIntegration(integrationId, config);
      setIsDialogOpen(false);
      setConfig({});
      setSelectedIntegration(null);
    } catch (error) {
      console.error('Failed to connect integration:', error);
    }
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      await disconnectIntegration(integrationId);
    } catch (error) {
      console.error('Failed to disconnect integration:', error);
    }
  };

  const openConfigDialog = (integrationId: string) => {
    setSelectedIntegration(integrationId);
    setIsDialogOpen(true);
  };

  const getConfigFields = (integrationId: string) => {
    switch (integrationId) {
      case 'discord':
        return [
          { key: 'botToken', label: 'Bot Token', type: 'password', placeholder: 'Your Discord bot token' },
          { key: 'webhookUrl', label: 'Webhook URL (optional)', type: 'url', placeholder: 'https://discord.com/api/webhooks/...' },
        ];
      case 'slack':
        return [
          { key: 'accessToken', label: 'Access Token', type: 'password', placeholder: 'xoxb-your-slack-token' },
          { key: 'webhookUrl', label: 'Webhook URL (optional)', type: 'url', placeholder: 'https://hooks.slack.com/...' },
        ];
      case 'telegram':
        return [
          { key: 'botToken', label: 'Bot Token', type: 'password', placeholder: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11' },
          { key: 'webhookUrl', label: 'Webhook URL (optional)', type: 'url', placeholder: 'https://your-domain.com/webhook' },
        ];
      default:
        return [];
    }
  };

  if (loading && integrations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <motion.span
          className="text-3xl mr-3"
          layoutId="nav-icon-/integrations"
          transition={{ duration: 0.3 }}
        >
          🔗
        </motion.span>
        <h2 className="text-2xl">Интеграции</h2>
      </div>
      <p className="text-gray-600 mb-6">
        Подключайте внешние сервисы для расширения функциональности FOCUS
      </p>

      {error && (
        <Alert className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className={`transition-all ${integration.connected ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <Badge variant={integration.connected ? 'default' : 'secondary'}>
                  {integration.connected ? 'Подключено' : 'Не подключено'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {integration.connected ? (
                <Button
                  onClick={() => handleDisconnect(integration.id)}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Отключить
                </Button>
              ) : (
                <Dialog open={isDialogOpen && selectedIntegration === integration.id} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => openConfigDialog(integration.id)}
                      className="w-full"
                    >
                      Подключить
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Подключение {integration.name}</DialogTitle>
                      <DialogDescription>
                        Введите необходимые данные для подключения интеграции
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {getConfigFields(integration.id).map((field) => (
                        <div key={field.key}>
                          <Label htmlFor={field.key}>{field.label}</Label>
                          <Input
                            id={field.key}
                            type={field.type}
                            placeholder={field.placeholder}
                            value={config[field.key] || ''}
                            onChange={(e) => setConfig(prev => ({ ...prev, [field.key]: e.target.value }))}
                          />
                        </div>
                      ))}
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => handleConnect(integration.id)}
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Подключить
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsDialogOpen(false)}
                          className="flex-1"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Скоро появится</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Microsoft Teams</li>
          <li>• Zoom</li>
          <li>• Jira</li>
          <li>• Trello</li>
          <li>• Notion</li>
        </ul>
      </div>
    </div>
  );
}