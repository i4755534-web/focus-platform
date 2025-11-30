'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Shield,
  Bell,
  MessageSquare,
  Globe,
  Palette,
  Smartphone,
  Key,
  Camera,
  Save
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Аккаунт
    nickname: user?.nickname || '',
    username: user?.username || '',
    phone: user?.phone || '',
    email: user?.email || '',

    // Конфиденциальность
    lastSeen: 'contacts',
    profilePhoto: 'contacts',
    phoneNumber: 'contacts',
    groups: 'all',
    calls: 'contacts',

    // Уведомления
    messageNotifications: true,
    groupNotifications: true,
    callNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,

    // Чат
    enterToSend: false,
    showReadStatus: true,
    showTypingStatus: true,
    autoDeleteMessages: false,
    messageDeleteTime: 30,

    // Язык и регион
    language: 'ru',
    timezone: 'Europe/Moscow',

    // Тема
    theme: 'system',
    accentColor: 'blue',

    // Данные и хранилище
    autoDownloadMedia: 'wifi',
    storageLimit: 1000,
  });

  const handleSave = () => {
    // Сохранить настройки
    console.log('Saving settings:', settings);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Настройки</h1>
          <p className="text-gray-600">Управляйте своими настройками и конфиденциальностью</p>
        </div>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Сохранить
        </Button>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Аккаунт
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Конфиденциальность
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Уведомления
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Чат
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Язык
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Тема
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Устройства
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Данные
          </TabsTrigger>
        </TabsList>

        {/* Аккаунт */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Информация аккаунта</CardTitle>
              <CardDescription>Управляйте информацией своего профиля</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.nickname?.[0] || user?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Изменить фото
                  </Button>
                  <Button variant="ghost" className="text-red-600">
                    Удалить фото
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">Отображаемое имя</Label>
                <Input
                  id="nickname"
                  value={settings.nickname}
                  onChange={(e) => updateSetting('nickname', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  value={settings.username}
                  onChange={(e) => updateSetting('username', e.target.value)}
                  placeholder="@username"
                />
              </div>


              <div className="space-y-2">
                <Label htmlFor="phone">Номер телефона</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => updateSetting('phone', e.target.value)}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Конфиденциальность */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Конфиденциальность</CardTitle>
              <CardDescription>Кто может видеть вашу информацию</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Последняя активность</h4>
                    <p className="text-sm text-gray-600">Кто видит, когда вы были в сети</p>
                  </div>
                  <Select value={settings.lastSeen} onValueChange={(value) => updateSetting('lastSeen', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Все</SelectItem>
                      <SelectItem value="contacts">Контакты</SelectItem>
                      <SelectItem value="nobody">Никто</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Фото профиля</h4>
                    <p className="text-sm text-gray-600">Кто видит ваше фото профиля</p>
                  </div>
                  <Select value={settings.profilePhoto} onValueChange={(value) => updateSetting('profilePhoto', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Все</SelectItem>
                      <SelectItem value="contacts">Контакты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Номер телефона</h4>
                    <p className="text-sm text-gray-600">Кто видит ваш номер телефона</p>
                  </div>
                  <Select value={settings.phoneNumber} onValueChange={(value) => updateSetting('phoneNumber', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Все</SelectItem>
                      <SelectItem value="contacts">Контакты</SelectItem>
                      <SelectItem value="nobody">Никто</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Группы</h4>
                    <p className="text-sm text-gray-600">Кто может добавлять вас в группы</p>
                  </div>
                  <Select value={settings.groups} onValueChange={(value) => updateSetting('groups', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="contacts">Контакты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Звонки</h4>
                    <p className="text-sm text-gray-600">Кто может вам звонить</p>
                  </div>
                  <Select value={settings.calls} onValueChange={(value) => updateSetting('calls', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="everyone">Все</SelectItem>
                      <SelectItem value="contacts">Контакты</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Уведомления */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Уведомления</CardTitle>
              <CardDescription>Настройте уведомления для различных событий</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Сообщения</h4>
                    <p className="text-sm text-gray-600">Уведомления о новых сообщениях</p>
                  </div>
                  <Switch
                    checked={settings.messageNotifications}
                    onCheckedChange={(checked) => updateSetting('messageNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Групповые чаты</h4>
                    <p className="text-sm text-gray-600">Уведомления из групповых чатов</p>
                  </div>
                  <Switch
                    checked={settings.groupNotifications}
                    onCheckedChange={(checked) => updateSetting('groupNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Звонки</h4>
                    <p className="text-sm text-gray-600">Уведомления о входящих звонках</p>
                  </div>
                  <Switch
                    checked={settings.callNotifications}
                    onCheckedChange={(checked) => updateSetting('callNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Звук</h4>
                    <p className="text-sm text-gray-600">Звуковые уведомления</p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Вибрация</h4>
                    <p className="text-sm text-gray-600">Вибрация при уведомлениях</p>
                  </div>
                  <Switch
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(checked) => updateSetting('vibrationEnabled', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Чат */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки чата</CardTitle>
              <CardDescription>Настройте поведение чата</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Enter для отправки</h4>
                    <p className="text-sm text-gray-600">Отправлять сообщения по нажатию Enter</p>
                  </div>
                  <Switch
                    checked={settings.enterToSend}
                    onCheckedChange={(checked) => updateSetting('enterToSend', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Показывать статус прочтения</h4>
                    <p className="text-sm text-gray-600">Показывать, прочитано ли сообщение</p>
                  </div>
                  <Switch
                    checked={settings.showReadStatus}
                    onCheckedChange={(checked) => updateSetting('showReadStatus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Показывать статус "печатает"</h4>
                    <p className="text-sm text-gray-600">Показывать, когда собеседник печатает</p>
                  </div>
                  <Switch
                    checked={settings.showTypingStatus}
                    onCheckedChange={(checked) => updateSetting('showTypingStatus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Автоудаление сообщений</h4>
                    <p className="text-sm text-gray-600">Автоматически удалять старые сообщения</p>
                  </div>
                  <Switch
                    checked={settings.autoDeleteMessages}
                    onCheckedChange={(checked) => updateSetting('autoDeleteMessages', checked)}
                  />
                </div>

                {settings.autoDeleteMessages && (
                  <div className="space-y-2">
                    <Label>Время хранения сообщений (дни)</Label>
                    <Select value={settings.messageDeleteTime.toString()} onValueChange={(value) => updateSetting('messageDeleteTime', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 дней</SelectItem>
                        <SelectItem value="30">30 дней</SelectItem>
                        <SelectItem value="90">90 дней</SelectItem>
                        <SelectItem value="365">1 год</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Язык */}
        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Язык и регион</CardTitle>
              <CardDescription>Выберите язык интерфейса и региональные настройки</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Язык интерфейса</Label>
                  <Select value={settings.language} onValueChange={(value) => updateSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Часовой пояс</Label>
                  <Select value={settings.timezone} onValueChange={(value) => updateSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Moscow">Москва (UTC+3)</SelectItem>
                      <SelectItem value="Europe/London">Лондон (UTC+0)</SelectItem>
                      <SelectItem value="America/New_York">Нью-Йорк (UTC-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Токио (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Тема */}
        <TabsContent value="theme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Внешний вид</CardTitle>
              <CardDescription>Настройте внешний вид приложения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Тема</Label>
                  <Select value={settings.theme} onValueChange={(value) => updateSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Светлая</SelectItem>
                      <SelectItem value="dark">Темная</SelectItem>
                      <SelectItem value="system">Системная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Акцентный цвет</Label>
                  <Select value={settings.accentColor} onValueChange={(value) => updateSetting('accentColor', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Синий</SelectItem>
                      <SelectItem value="green">Зеленый</SelectItem>
                      <SelectItem value="purple">Фиолетовый</SelectItem>
                      <SelectItem value="red">Красный</SelectItem>
                      <SelectItem value="orange">Оранжевый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Устройства */}
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Активные сессии</CardTitle>
              <CardDescription>Управляйте устройствами, на которых вы вошли</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-8 h-8 text-green-500" />
                    <div>
                      <h4 className="font-medium">Текущее устройство</h4>
                      <p className="text-sm text-gray-600">Chrome на Windows • Активно сейчас</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Текущее</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-8 h-8 text-gray-500" />
                    <div>
                      <h4 className="font-medium">iPhone 13</h4>
                      <p className="text-sm text-gray-600">Safari • 2 часа назад</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Завершить сессию
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Данные и хранилище */}
        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Данные и хранилище</CardTitle>
              <CardDescription>Управляйте хранением данных и медиафайлов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Автозагрузка медиа</Label>
                  <Select value={settings.autoDownloadMedia} onValueChange={(value) => updateSetting('autoDownloadMedia', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Никогда</SelectItem>
                      <SelectItem value="wifi">Только Wi-Fi</SelectItem>
                      <SelectItem value="always">Всегда</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Лимит хранилища (МБ)</Label>
                  <Input
                    type="number"
                    value={settings.storageLimit}
                    onChange={(e) => updateSetting('storageLimit', parseInt(e.target.value))}
                    min="100"
                    max="10000"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Использование хранилища</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Сообщения</span>
                      <span>245 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Медиафайлы</span>
                      <span>180 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Кэш</span>
                      <span>15 MB</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>Всего</span>
                      <span>440 MB</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Очистить кэш
                  </Button>
                  <Button variant="outline" className="w-full text-red-600">
                    Экспортировать данные
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}