'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useTranslation } from '@/hooks/useTranslation';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import NotificationCenter from './NotificationCenter';
import AccessibilityPanel from '@/components/accessibility/AccessibilityPanel';

interface TopbarProps {
  onMenuClick?: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const { setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement search logic
    console.log('Search:', query);
  };

  return (
    <div className="h-16 bg-purple-900 text-white flex items-center justify-between px-4 shadow-md">
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.nickname} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.nickname?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.nickname}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {user?.email}
                </p>
                <p className="text-xs text-purple-400 capitalize">
                  {user?.role === 'admin' ? 'Администратор' : user?.role === 'moderator' ? 'Модератор' : 'Пользователь'}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Профиль</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Настройки</Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Тема</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>Светлая</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>Темная</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>Системная</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>🌐 {language === 'ru' ? 'Русский' : 'English'}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setLanguage('ru')}>
                  🇷🇺 Русский
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <h1 className="text-xl font-semibold hidden sm:block">FOCUS</h1>
      </div>
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <Input
          placeholder="Поиск по чатам..."
          className="bg-purple-800 border-purple-600 text-white placeholder:text-purple-300"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <NotificationCenter />
      <AccessibilityPanel />
      <div className="md:hidden">
        {/* Hamburger menu for mobile */}
        <Button variant="ghost" size="sm" onClick={onMenuClick}>
          ☰
        </Button>
      </div>
    </div>
  );
}