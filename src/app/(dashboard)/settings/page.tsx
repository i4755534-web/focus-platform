'use client';

import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ru', name: 'Русский' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
];

const messengers = [
  { name: 'Telegram', icon: '📱', connected: false },
  { name: 'WhatsApp', icon: '💬', connected: false },
  { name: 'Discord', icon: '🎮', connected: false },
  { name: 'Slack', icon: '💼', connected: false },
];

export default function SettingsPage() {
  const { language, setLanguage } = useSettings();
  const { theme, setTheme } = useTheme();
  const { user, setStatus } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl mb-4">Настройки</h2>

      <Card>
        <CardHeader>
          <CardTitle>Тема</CardTitle>
          <CardDescription>Выберите тему интерфейса</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={theme} onValueChange={(value) => { setTheme(value); toast.success('Тема изменена!'); }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите тему" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Светлая</SelectItem>
              <SelectItem value="dark">Темная</SelectItem>
              <SelectItem value="system">Системная</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Статус</CardTitle>
          <CardDescription>Установите ваш статус присутствия</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={user?.status} onValueChange={(value: 'online' | 'offline' | 'away') => { setStatus(value); toast.success('Статус изменен!'); }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="online">Онлайн</SelectItem>
              <SelectItem value="away">Отошел</SelectItem>
              <SelectItem value="offline">Оффлайн</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Язык системы</CardTitle>
          <CardDescription>Выберите предпочитаемый язык интерфейса</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите язык" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Интеграция с месенджерами</CardTitle>
          <CardDescription>Подключите свои аккаунты для синхронизации сообщений</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {messengers.map((messenger) => (
              <div key={messenger.name} className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{messenger.icon}</span>
                  <span className="font-medium">{messenger.name}</span>
                </div>
                <Button variant={messenger.connected ? "secondary" : "default"}>
                  {messenger.connected ? 'Отключить' : 'Подключить'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}