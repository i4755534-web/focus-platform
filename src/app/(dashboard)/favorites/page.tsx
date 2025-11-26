'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  const messages = favorites.filter(f => f.type === 'message');
  const channels = favorites.filter(f => f.type === 'channel');

  return (
    <div>
      <h2 className="text-2xl mb-4">Избранное</h2>
      <Tabs defaultValue="messages" className="w-full">
        <TabsList>
          <TabsTrigger value="messages">Сообщения ({messages.length})</TabsTrigger>
          <TabsTrigger value="channels">Каналы ({channels.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="messages">
          {messages.length === 0 ? (
            <p>Нет избранных сообщений</p>
          ) : (
            <div className="space-y-4">
              {messages.map((item) => (
                <div key={item.id} className="p-4 border rounded bg-purple-50 border-purple-200">
                  <p className="text-purple-900">{item.content}</p>
                  <p className="text-sm text-purple-600">Чат: {item.chatId}</p>
                  <p className="text-sm text-purple-500">Добавлено: {item.timestamp.toLocaleString()}</p>
                  <Button onClick={() => removeFavorite(item.id)} variant="destructive" size="sm" className="mt-2">
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="channels">
          {channels.length === 0 ? (
            <p>Нет избранных каналов</p>
          ) : (
            <div className="space-y-4">
              {channels.map((item) => (
                <div key={item.id} className="p-4 border rounded bg-purple-50 border-purple-200">
                  <p className="text-purple-900">{item.content}</p>
                  <p className="text-sm text-purple-600">Группа: {item.groupName}</p>
                  <p className="text-sm text-purple-500">Добавлено: {item.timestamp.toLocaleString()}</p>
                  <Button onClick={() => removeFavorite(item.id)} variant="destructive" size="sm" className="mt-2">
                    Удалить
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}