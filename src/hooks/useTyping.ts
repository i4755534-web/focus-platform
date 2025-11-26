import { create } from 'zustand';

interface TypingState {
  typing: Record<string, string[]>; // chatId -> userIds
  setTyping: (chatId: string, userId: string, isTyping: boolean) => void;
}

export const useTyping = create<TypingState>((set, get) => ({
  typing: {},

  setTyping: (chatId, userId, isTyping) => {
    set((state) => {
      const chatTyping = state.typing[chatId] || [];
      if (isTyping && !chatTyping.includes(userId)) {
        return {
          typing: { ...state.typing, [chatId]: [...chatTyping, userId] },
        };
      } else if (!isTyping) {
        return {
          typing: { ...state.typing, [chatId]: chatTyping.filter(id => id !== userId) },
        };
      }
      return state;
    });
  },
}));