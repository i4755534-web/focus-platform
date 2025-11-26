import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoriteItem {
  id: string;
  type: 'message' | 'chat' | 'channel' | 'group';
  chatId?: string;
  groupName?: string;
  channelName?: string;
  content: string;
  timestamp: Date;
}

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'timestamp'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (item) => {
        const newItem: FavoriteItem = {
          ...item,
          id: `${item.type}_${item.chatId || item.groupName || item.channelName}_${Date.now()}`,
          timestamp: new Date(),
        };
        set((state) => ({
          favorites: [...state.favorites, newItem],
        }));
      },
      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.id !== id),
        }));
      },
      isFavorite: (id) => {
        return get().favorites.some((f) => f.id === id);
      },
    }),
    {
      name: 'focus-favorites',
    }
  )
);