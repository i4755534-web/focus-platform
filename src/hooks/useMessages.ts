import { create } from 'zustand';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  reactions?: Array<{ emoji: string; userId: string }>;
}

interface MessagesState {
  messages: Record<string, Message[]>;
  pinnedMessages: Record<string, Message[]>;
  fetchMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, text: string, sender: string, replyTo?: { id: string; text: string; sender: string }) => Promise<void>;
  addReaction: (chatId: string, messageId: string, emoji: string, userId: string) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  unpinMessage: (chatId: string, messageId: string) => void;
}

export const useMessages = create<MessagesState>((set, get) => ({
  messages: {},
  pinnedMessages: {},

  fetchMessages: async (chatId: string) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      const messages = await response.json();
      set((state) => ({
        messages: { ...state.messages, [chatId]: messages },
      }));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  },

  sendMessage: async (chatId: string, text: string, sender: string, replyTo?: { id: string; text: string; sender: string }) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, sender, replyTo }),
      });
      const newMessage = await response.json();
      set((state) => ({
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage],
        },
      }));
      toast.success('Сообщение отправлено!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Ошибка отправки сообщения');
    }
  },

  addReaction: (chatId: string, messageId: string, emoji: string, userId: string) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const updatedMessages = chatMessages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: [...(msg.reactions || []), { emoji, userId }],
            }
          : msg
      );
      return {
        messages: { ...state.messages, [chatId]: updatedMessages },
      };
    });
  },

  pinMessage: (chatId: string, messageId: string) => {
    set((state) => {
      const chatMessages = state.messages[chatId] || [];
      const message = chatMessages.find((msg) => msg.id === messageId);
      if (message) {
        const pinned = state.pinnedMessages[chatId] || [];
        return {
          pinnedMessages: { ...state.pinnedMessages, [chatId]: [...pinned, message] },
        };
      }
      return state;
    });
  },

  unpinMessage: (chatId: string, messageId: string) => {
    set((state) => {
      const pinned = state.pinnedMessages[chatId] || [];
      return {
        pinnedMessages: { ...state.pinnedMessages, [chatId]: pinned.filter((msg) => msg.id !== messageId) },
      };
    });
  },
}));