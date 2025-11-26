'use client';

import { useEffect, useState } from 'react';
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

export default function ChatClient({ chatId }: ChatClientProps) {
  const { user } = useAuth();
  const { messages, fetchMessages, sendMessage, pinMessage, pinnedMessages } = useMessages();
  const { typing, setTyping } = useTyping();
  const [replyTo, setReplyTo] = useState<{ id: string; text: string; sender: string } | null>(null);
  const chat = mockChats.find(c => c.id === chatId);

  useEffect(() => {
    fetchMessages(chatId);
  }, [chatId, fetchMessages]);

  const handleSendMessage = (text: string) => {
    if (user) {
      sendMessage(chatId, text, 'me', replyTo || undefined);
      setReplyTo(null);
      setTyping(chatId, user.id, false);
    }
  };

  const handlePinMessage = (messageId: string) => {
    pinMessage(chatId, messageId);
  };

  const handleReply = (message: { id: string; text: string; sender: string }) => {
    setReplyTo(message);
  };

  const handleTyping = (isTyping: boolean) => {
    if (user) {
      setTyping(chatId, user.id, isTyping);
    }
  };

  if (!chat) return <div>Чат не найден</div>;

  const chatMessages = messages[chatId] || [];
  const chatPinned = pinnedMessages[chatId] || [];
  const typingUsers = typing[chatId] || [];

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
      <MessageList messages={chatMessages} chatId={chatId} onPinMessage={handlePinMessage} onReply={handleReply} />
      <FileDropzone />
      <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
    </div>
  );
}