'use client';

import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useTyping } from '@/hooks/useTyping';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import MessageInput from '@/components/chat/MessageInput';
import FileDropzone from '@/components/chat/FileDropzone';

const mockChats = [
  { id: '1', name: 'Чат 1', type: 'personal', participants: ['Пользователь 1'] },
  { id: '2', name: 'Чат 2', type: 'personal', participants: ['Пользователь 2'] },
  { id: '3', name: 'Групповой чат', type: 'group', participants: ['Пользователь 1', 'Пользователь 2', 'Пользователь 3'] },
];

interface ChatClientProps {
  chatId: string;
}

const ChatClient = memo(function ChatClient({ chatId }: ChatClientProps) {
  const { user } = useAuth();
  const { messages, fetchMessages, sendMessage, pinMessage, pinnedMessages } = useMessages();
  const { typing, setTyping } = useTyping();
  const [replyTo, setReplyTo] = useState<{ id: string; text: string; sender: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchMessages(chatId);
      } catch (err) {
        console.error('Ошибка загрузки сообщений:', err);
        setError('Не удалось загрузить сообщения');
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      loadMessages();
    }
  }, [chatId, fetchMessages]);

  const handleSendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    if (!user) {
      console.error('Пользователь не авторизован');
      return;
    }

    try {
      sendMessage(chatId, text.trim(), 'me', replyTo || undefined);
      setReplyTo(null);
      setTyping(chatId, user.id, false);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }
  }, [chatId, user, replyTo, sendMessage, setTyping]);

  const handlePinMessage = useCallback((messageId: string) => {
    if (!messageId) return;

    try {
      pinMessage(chatId, messageId);
    } catch (error) {
      console.error('Ошибка закрепления сообщения:', error);
    }
  }, [chatId, pinMessage]);

  const handleReply = useCallback((message: { id: string; text: string; sender: string }) => {
    if (!message.id) return;
    setReplyTo(message);
  }, []);

  const handleTyping = useCallback((isTyping: boolean) => {
    if (!user) return;

    try {
      setTyping(chatId, user.id, isTyping);
    } catch (error) {
      console.error('Ошибка установки статуса печати:', error);
    }
  }, [chatId, user, setTyping]);

  const chatMessages = useMemo(() => messages[chatId] || [], [messages, chatId]);
  const chatPinned = useMemo(() => pinnedMessages[chatId] || [], [pinnedMessages, chatId]);
  const typingUsers = useMemo(() => typing[chatId] || [], [typing, chatId]);

  if (!chatId) {
    return <div className="flex items-center justify-center h-full text-red-500">Ошибка: ID чата не указан</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Загрузка чата...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-center">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  const chat = mockChats.find(c => c.id === chatId);

  if (!chat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Чат не найден</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader name={chat.name} participants={chat.participants} typingUsers={typingUsers} />

      {chatPinned.length > 0 && (
        <div className="p-2 bg-yellow-100 border-b">
          <h4 className="text-sm font-semibold">📌 Закрепленные сообщения</h4>
          {chatPinned.map((msg) => (
            <div key={msg.id} className="text-sm text-gray-700">{msg.text}</div>
          ))}
        </div>
      )}

      <MessageList
        messages={chatMessages}
        chatId={chatId}
        onPinMessage={handlePinMessage}
        onReply={handleReply}
      />

      <FileDropzone />

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
});

export default ChatClient;