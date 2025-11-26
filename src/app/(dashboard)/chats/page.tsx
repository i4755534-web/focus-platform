'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

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
    <div>
      <h2 className="text-2xl mb-4">Чаты</h2>
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
          <li key={chat.id} className="p-4 border-b cursor-pointer hover:bg-gray-50">
            <Link href={`/dashboard/chats/${chat.id}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <span className="font-medium mr-2">{chat.name}</span>
                  {chat.type === 'group' && <span className="text-gray-400 text-sm">👥 {chat.participants.length}</span>}
                </div>
                {chat.unreadCount > 0 && <span className="bg-red-500 text-white rounded-full px-2 text-sm">{chat.unreadCount}</span>}
              </div>
              <p className="text-gray-500 text-sm">{chat.lastMessage}</p>
              {chat.type === 'group' && <p className="text-gray-400 text-xs">{chat.participants.join(', ')}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}