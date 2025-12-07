'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  reactions?: Array<{ emoji: string; userId: string }>;
  replyTo?: { id: string; text: string; sender: string };
}

interface MessageListProps {
  messages?: Message[];
  chatId?: string;
  onPinMessage?: (messageId: string) => void;
  onReply?: (message: Message) => void;
}

const MessageList = memo(function MessageList({ messages = [], chatId, onPinMessage, onReply }: MessageListProps) {
  const { addReaction } = useMessages();
  const { user } = useAuth();
  const { addFavorite, isFavorite } = useFavorites();
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const handleReaction = useCallback((messageId: string, emoji: string) => {
    if (user && chatId) {
      addReaction(chatId, messageId, emoji, user.id);
    }
  }, [user, chatId, addReaction]);

  const handlePin = useCallback((messageId: string) => {
    if (onPinMessage) {
      onPinMessage(messageId);
    }
  }, [onPinMessage]);

  const handleDelete = useCallback((messageId: string) => {
    if (user?.role === 'admin' || user?.role === 'moderator') {
      console.log('Deleting message:', messageId);
    }
  }, [user?.role]);

  const handleReply = useCallback((msg: Message) => {
    if (onReply) {
      onReply(msg);
    }
  }, [onReply]);

  const handleFavorite = useCallback((msg: Message) => {
    if (chatId) {
      addFavorite({
        type: 'message',
        chatId,
        content: msg.text,
      });
    }
  }, [chatId, addFavorite]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`mb-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}
          onMouseEnter={() => setHoveredMessage(msg.id)}
          onMouseLeave={() => setHoveredMessage(null)}
        >
          <div className={`inline-block p-2 rounded max-w-xs relative group ${msg.sender === 'me' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>
            {msg.replyTo && (
              <div className="text-xs opacity-70 mb-1 border-l-2 pl-2">
                Reply to: {msg.replyTo.text}
              </div>
            )}
            {msg.text}
            {msg.text.match(/https?:\/\/[^\s]+/) && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <a href={msg.text.match(/https?:\/\/[^\s]+/)![0]} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  🔗 {msg.text.match(/https?:\/\/[^\s]+/)![0]}
                </a>
              </div>
            )}
            {hoveredMessage === msg.id && (
              <div className="absolute top-0 right-0 transform translate-x-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col">
                <div>
                  <button onClick={() => handleReaction(msg.id, '👍')} className="text-sm bg-white border rounded px-1">👍</button>
                  <button onClick={() => handleReaction(msg.id, '❤️')} className="text-sm bg-white border rounded px-1 ml-1">❤️</button>
                  <button onClick={() => handleReaction(msg.id, '😂')} className="text-sm bg-white border rounded px-1 ml-1">😂</button>
                </div>
                <button onClick={() => handlePin(msg.id)} className="text-sm bg-white border rounded px-1 mt-1">📌</button>
                <button onClick={() => handleReply(msg)} className="text-sm bg-white border rounded px-1 mt-1">↩️</button>
                <button onClick={() => handleFavorite(msg)} className="text-sm bg-white border rounded px-1 mt-1">⭐</button>
                {(user?.role === 'admin' || user?.role === 'moderator') && (
                  <button onClick={() => handleDelete(msg.id)} className="text-sm bg-white border rounded px-1 mt-1 text-red-600">🗑️</button>
                )}
              </div>
            )}
          </div>
          {msg.reactions && msg.reactions.length > 0 && (
            <div className="text-xs text-gray-500 mt-1">
              {msg.reactions.map((reaction, index) => (
                <span key={index} className="mr-1">{reaction.emoji}</span>
              ))}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
        </div>
      ))}
    </div>
  );
});

export default MessageList;