'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function FriendsPage() {
  const { users } = useAuth();
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState<string[]>([]);
  const router = useRouter();

  const filteredUsers = users.filter(u => u.nickname?.toLowerCase().includes(search.toLowerCase()));

  const addFriend = (userId: string) => {
    if (!friends.includes(userId)) {
      setFriends([...friends, userId]);
    }
  };

  const startPrivateChat = (friendId: string) => {
    // Mock private chat creation
    const chatId = `private_${friendId}`;
    router.push(`/dashboard/chats/${chatId}`);
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Друзья</h2>
      <div className="mb-4">
        <Label htmlFor="search">Поиск пользователей</Label>
        <Input id="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Введите имя..." />
      </div>
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <div key={user.id} className="flex justify-between items-center p-2 border rounded">
            <span>{user.nickname} ({user.phone})</span>
            <Button onClick={() => addFriend(user.id)} disabled={friends.includes(user.id)}>
              {friends.includes(user.id) ? 'Добавлен' : 'Добавить'}
            </Button>
          </div>
        ))}
      </div>
      <h3 className="text-xl mt-8 mb-4">Мои друзья</h3>
      <div className="space-y-2">
        {friends.map((friendId) => {
          const friend = users.find(u => u.id === friendId);
          return (
            <div key={friendId} className="flex justify-between items-center p-2 border rounded">
              <span>{friend?.nickname}</span>
              <Button onClick={() => startPrivateChat(friendId)} size="sm">
                💬 Начать чат
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}