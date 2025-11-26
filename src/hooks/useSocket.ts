import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotifications } from './useNotifications';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setIsConnected(false);
    setTimeout(() => {
      addNotification({
        title: 'Добро пожаловать!',
        message: 'FOCUS готов к работе',
        type: 'success',
      });
    }, 1000);
  }, [addNotification]);

  return { socket, isConnected };
};