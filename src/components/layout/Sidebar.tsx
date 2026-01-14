'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

const groups = [
  {
    name: 'FOCUS Community',
    channels: [
      { name: 'general', href: '/chats/general', icon: '#' },
      { name: 'random', href: '/chats/random', icon: '#' },
      { name: 'help', href: '/chats/help', icon: '#' },
    ],
  },
  {
    name: 'Study Group',
    channels: [
      { name: 'math', href: '/chats/math', icon: '#' },
      { name: 'physics', href: '/chats/physics', icon: '#' },
    ],
  },
];

const navigation = [
  { name: 'Друзья', href: '/friends', icon: '👥' },
  { name: 'Поиск', href: '/search', icon: '🔍' },
  { name: 'Web3', href: '/web3', icon: '⛓️' },
  { name: 'Звонки', href: '/calls', icon: '📞' },
  { name: 'VR Комнаты', href: '/vr', icon: '🎮' },
  { name: 'Избранное', href: '/favorites', icon: '⭐' },
  { name: 'Достижения', href: '/achievements', icon: '🏆' },
  { name: 'Аналитика', href: '/analytics', icon: '📊' },
  { name: 'Интеграции', href: '/integrations', icon: '🔗' },
  { name: 'Профиль', href: '/profile', icon: '👤' },
  { name: 'Настройки', href: '/settings', icon: '⚙️' },
];

interface SidebarProps {
  mobile?: boolean;
}

export default function Sidebar({ mobile }: SidebarProps) {
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['FOCUS Community']));
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const toggleChannelFavorite = (groupName: string, channelName: string) => {
    const favId = `channel_${groupName}_${channelName}`;
    if (isFavorite(favId)) {
      removeFavorite(favId);
    } else {
      addFavorite({
        type: 'channel',
        groupName,
        channelName,
        content: `#${channelName} в ${groupName}`,
      });
    }
  };

  const getPreviewContent = (href: string) => {
    const previews: Record<string, { title: string; description: string; icon: string }> = {
      '/friends': { title: 'Друзья', description: 'Управляйте своими контактами', icon: '👥' },
      '/search': { title: 'Поиск', description: 'Найдите пользователей и контент', icon: '🔍' },
      '/web3': { title: 'Web3', description: 'Кошелек и NFT достижения', icon: '⛓️' },
      '/calls': { title: 'Звонки', description: 'Видео и голосовые звонки', icon: '📞' },
      '/vr': { title: 'VR Комнаты', description: 'Виртуальные комнаты для встреч', icon: '🎮' },
      '/favorites': { title: 'Избранное', description: 'Ваши сохраненные элементы', icon: '⭐' },
      '/achievements': { title: 'Достижения', description: 'Ваши награды и прогресс', icon: '🏆' },
      '/analytics': { title: 'Аналитика', description: 'Статистика использования', icon: '📊' },
      '/integrations': { title: 'Интеграции', description: 'Подключенные сервисы', icon: '🔗' },
      '/profile': { title: 'Профиль', description: 'Управление аккаунтом', icon: '👤' },
      '/settings': { title: 'Настройки', description: 'Настройки приложения', icon: '⚙️' },
    };

    return previews[href] || { title: 'Страница', description: 'Описание недоступно', icon: '📄' };
  };

  return (
    <div className={`w-64 bg-purple-950 p-4 flex flex-col border-r border-purple-400 ${mobile ? '' : 'hidden md:flex'}`}>
      <div className="flex items-center mb-8">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          user?.status === 'online' ? 'bg-green-500' :
          user?.status === 'away' ? 'bg-yellow-500' :
          'bg-gray-500'
        }`}></div>
        <span className="font-medium text-purple-300">{user?.nickname}</span>
      </div>
      <nav id="navigation" className="flex-1" role="navigation" aria-label="Основная навигация">
        <div className="mb-4">
          <h3 className="text-purple-300 font-semibold mb-2">Группы</h3>
          {groups.map((group) => (
            <div key={group.name} className="mb-2">
              <button
                onClick={() => toggleGroup(group.name)}
                className="flex items-center w-full text-left p-1 rounded hover:bg-purple-800 text-purple-200 hover:text-purple-100"
              >
                <span className="mr-2">{expandedGroups.has(group.name) ? '▼' : '▶'}</span>
                {group.name}
              </button>
              {expandedGroups.has(group.name) && (
                <ul className="ml-4 mt-1">
                  {group.channels.map((channel) => (
                    <li key={channel.name} className="mb-1 flex items-center">
                      <Link href={channel.href} className="flex items-center p-1 rounded hover:bg-purple-800 text-purple-300 hover:text-purple-100 text-sm flex-1">
                        <span className="mr-2">{channel.icon}</span>
                        {channel.name}
                      </Link>
                      <button
                        onClick={() => toggleChannelFavorite(group.name, channel.name)}
                        className={`text-sm ml-1 ${isFavorite(`channel_${group.name}_${channel.name}`) ? 'text-yellow-400' : 'text-purple-400 hover:text-yellow-400'}`}
                      >
                        ⭐
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        <ul className="relative">
          {navigation.map((item) => (
            <li key={item.name} className="mb-2 relative">
              <Link
                href={item.href}
                className="flex items-center p-2 rounded hover:bg-purple-800 text-purple-200 hover:text-purple-100 transition-colors"
                onMouseEnter={() => setHoveredItem(item.href)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <motion.span
                  className="mr-3 text-lg"
                  layoutId={`nav-icon-${item.href}`}
                  transition={{ duration: 0.3 }}
                >
                  {item.icon}
                </motion.span>
                {item.name}
              </Link>

              {/* Hover Preview */}
              {hoveredItem === item.href && !mobile && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full top-0 ml-4 w-64 bg-purple-900 border border-purple-400 rounded-lg p-4 shadow-lg z-50"
                >
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{getPreviewContent(item.href).icon}</span>
                    <h4 className="text-purple-100 font-semibold">{getPreviewContent(item.href).title}</h4>
                  </div>
                  <p className="text-purple-300 text-sm">{getPreviewContent(item.href).description}</p>
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8">
        <h4 className="text-sm font-semibold mb-2 text-blue-900">Пользователи</h4>
        <ul>
          <li className="flex items-center mb-1">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-purple-200">Пользователь 1</span>
          </li>
          <li className="flex items-center mb-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-sm text-purple-200">Пользователь 2</span>
          </li>
          <li className="flex items-center mb-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-sm text-purple-200">Пользователь 3</span>
          </li>
        </ul>
      </div>
    </div>
  );
}