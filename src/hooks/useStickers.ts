import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Sticker {
  id: string;
  url: string;
  name: string;
  category: string;
}

interface StickerPack {
  id: string;
  name: string;
  stickers: Sticker[];
  isCustom: boolean;
}

interface StickersState {
  stickerPacks: StickerPack[];
  recentStickers: Sticker[];
  loading: boolean;
  error: string | null;
  loadStickers: () => Promise<void>;
  searchStickers: (query: string) => Sticker[];
  sendSticker: (sticker: Sticker, chatId: string) => Promise<void>;
  addRecentSticker: (sticker: Sticker) => void;
}

export const useStickers = create<StickersState>()(
  persist(
    (set, get) => ({
      stickerPacks: [],
      recentStickers: [],
      loading: false,
      error: null,

      loadStickers: async () => {
        set({ loading: true, error: null });
        try {
          // Mock API call - in real app would fetch from server
          const mockPacks: StickerPack[] = [
            {
              id: 'default',
              name: 'Стандартные',
              isCustom: false,
              stickers: [
                { id: '1', url: '/stickers/like.png', name: 'Лайк', category: 'reactions' },
                { id: '2', url: '/stickers/love.png', name: 'Любовь', category: 'emotions' },
              ],
            },
            {
              id: 'custom1',
              name: 'Мои стикеры',
              isCustom: true,
              stickers: [
                { id: '3', url: '/stickers/custom1.png', name: 'Кастомный', category: 'custom' },
              ],
            },
          ];
          set({ stickerPacks: mockPacks, loading: false });
        } catch (error) {
          set({ error: 'Failed to load stickers', loading: false });
        }
      },

      searchStickers: (query: string) => {
        const allStickers = get().stickerPacks.flatMap(pack => pack.stickers);
        return allStickers.filter(sticker =>
          sticker.name.toLowerCase().includes(query.toLowerCase())
        );
      },

      sendSticker: async (sticker: Sticker, chatId: string) => {
        // Mock send - in real app would send via WebSocket or API
        console.log(`Sending sticker ${sticker.id} to chat ${chatId}`);
        get().addRecentSticker(sticker);
      },

      addRecentSticker: (sticker: Sticker) => {
        set(state => {
          const filtered = state.recentStickers.filter(s => s.id !== sticker.id);
          return {
            recentStickers: [sticker, ...filtered].slice(0, 10), // Keep last 10
          };
        });
      },
    }),
    {
      name: 'focus-stickers',
      partialize: (state) => ({
        recentStickers: state.recentStickers,
        stickerPacks: state.stickerPacks.filter(pack => pack.isCustom), // Only persist custom packs
      }),
    }
  )
);