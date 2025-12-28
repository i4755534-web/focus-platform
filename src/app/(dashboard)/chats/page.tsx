'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import ThreeBackground from '@/components/ThreeBackground';

interface Chat {
  id: string;
  name: string;
  type: 'personal' | 'group';
  participants: string[];
  lastMessage: string;
  unreadCount: number;
}

const mockChats: Chat[] = [
  { id: '1', name: 'Чат 1', type: 'personal', participants: ['Пользователь 1'], lastMessage: 'Привет!', unreadCount: 2 },
  { id: '2', name: 'Чат 2', type: 'personal', participants: ['Пользователь 2'], lastMessage: 'Как дела?', unreadCount: 0 },
  { id: '3', name: 'Групповой чат', type: 'group', participants: ['Пользователь 1', 'Пользователь 2', 'Пользователь 3'], lastMessage: 'Встреча в 15:00', unreadCount: 1 },
];

export default function ChatsPage() {
  const [search, setSearch] = useState('');

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen">
      <ThreeBackground />
      <div className="relative z-10 p-6">
        <h2 className="text-2xl mb-4 text-foreground">Чаты</h2>
        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full"
          />
        </div>
        <ul>
          {filteredChats.map((chat) => (
            <li key={chat.id} className="p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors">
              <Link href={`/dashboard/chats/${chat.id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="font-medium mr-2 text-foreground">{chat.name}</span>
                    {chat.type === 'group' && <span className="text-muted-foreground text-sm">👥 {chat.participants.length}</span>}
                  </div>
                  {chat.unreadCount > 0 && <span className="bg-destructive text-destructive-foreground rounded-full px-2 text-sm">{chat.unreadCount}</span>}
                </div>
                <p className="text-muted-foreground text-sm">{chat.lastMessage}</p>
                {chat.type === 'group' && <p className="text-muted-foreground text-xs">{chat.participants.join(', ')}</p>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}