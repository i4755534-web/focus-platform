'use client';

import { useIntegrations } from '@/hooks/useIntegrations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function IntegrationsPage() {
  const { integrations, connectIntegration, disconnectIntegration } = useIntegrations();

  return (
    <div>
      <h2 className="text-2xl mb-4">Интеграции</h2>
      <p className="text-gray-600 mb-6">
        Подключайте внешние сервисы для расширения функциональности FOCUS
      </p>

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
              <Button
                onClick={() => integration.connected
                  ? disconnectIntegration(integration.id)
                  : connectIntegration(integration.id)
                }
                variant={integration.connected ? 'outline' : 'default'}
                className="w-full"
              >
                {integration.connected ? 'Отключить' : 'Подключить'}
              </Button>
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