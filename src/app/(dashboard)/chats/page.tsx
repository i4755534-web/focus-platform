'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import ThreeBackground from '@/components/ThreeBackground';
import ParticleBackground from '@/components/ParticleBackground';
import { motion } from 'framer-motion';

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
    <div className="relative min-h-screen bg-background text-foreground">
      <ParticleBackground />
      <ThreeBackground />
      <div className="relative z-10 p-6">
        <motion.h2
          className="text-3xl mb-6 text-center font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Чаты
        </motion.h2>
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск чатов..."
            className="w-full message-liquid-depth"
          />
        </motion.div>
        <motion.ul
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {filteredChats.map((chat, index) => (
            <motion.li
              key={chat.id}
              className="message-liquid-depth cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href={`/dashboard/chats/${chat.id}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{chat.name}</span>
                    {chat.type === 'group' && <span className="text-muted-foreground text-sm">👥 {chat.participants.length}</span>}
                  </div>
                  {chat.unreadCount > 0 && <span className="bg-destructive text-destructive-foreground rounded-full px-2 text-sm">{chat.unreadCount}</span>}
                </div>
                <p className="text-muted-foreground text-sm">{chat.lastMessage}</p>
                {chat.type === 'group' && <p className="text-muted-foreground text-xs">{chat.participants.join(', ')}</p>}
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}