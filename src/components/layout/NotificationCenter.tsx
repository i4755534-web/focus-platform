'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

export default function NotificationCenter() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'neon-pulse-2026' : ''}`} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse bg-red-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-4">
          <h4 className="font-semibold">Уведомления</h4>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearNotifications}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DropdownMenuSeparator />
        {permission !== 'granted' && (
          <div className="p-4">
            <Button onClick={requestPermission} className="w-full">
              Включить push-уведомления
            </Button>
          </div>
        )}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Нет уведомлений
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`p-4 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      notification.type === 'error' ? 'bg-red-100 text-red-800' :
                      notification.type === 'success' ? 'bg-green-100 text-green-800' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <span className="text-xs text-gray-400">
                    {notification.timestamp.toLocaleString()}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}