import { create } from 'zustand';

interface Plugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version: string;
  author: string;
  category?: 'chat' | 'moderation' | 'gamification' | 'productivity' | 'security' | 'integration';
  rating?: number;
  reviewCount?: number;
  downloads?: number;
  price?: number;
  currency?: string;
  installedVersion?: string;
  status?: 'available' | 'installed' | 'updating' | 'error';
  updateAvailable?: boolean;
  newVersion?: string;
  dependencies?: string[];
  lastUsed?: Date;
  settings?: PluginSettings;
}

interface PluginSettings {
  autoUpdate: boolean;
  notifications: boolean;
  dataCollection: boolean;
  customConfig?: Record<string, unknown>;
}

interface PluginReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

interface MarketplacePlugin {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  version: string;
  author: {
    name: string;
    verified: boolean;
  };
  category: 'chat' | 'moderation' | 'gamification' | 'productivity' | 'security' | 'integration';
  tags: string[];
  rating: number;
  reviewCount: number;
  downloads: number;
  price: number;
  currency: string;
  screenshots?: string[];
  features?: string[];
  requirements?: string[];
  compatibility?: string[];
  status: 'available' | 'installed' | 'updating' | 'error';
  installedVersion?: string;
  lastUpdated: Date;
  size: string;
  license: string;
  supportEmail?: string;
  website?: string;
  documentation?: string;
  dependencies?: string[];
  reviews?: PluginReview[];
}

interface PluginsState {
  plugins: Plugin[];
  marketplacePlugins: MarketplacePlugin[];
  reviews: Record<string, PluginReview[]>;
  favorites: string[];
  togglePlugin: (id: string) => void;
  installPlugin: (plugin: Plugin) => void;
  uninstallPlugin: (id: string) => void;
  updatePlugin: (id: string) => void;
  addToFavorites: (pluginId: string) => void;
  removeFromFavorites: (pluginId: string) => void;
  addReview: (pluginId: string, review: Omit<PluginReview, 'id' | 'date'>) => void;
  updatePluginSettings: (pluginId: string, settings: Partial<PluginSettings>) => void;
  loadMarketplacePlugins: () => Promise<void>;
  purchasePlugin: (pluginId: string) => Promise<boolean>;
}

const defaultPlugins: Plugin[] = [
  {
    id: 'emoji-enhancer',
    name: 'Emoji Enhancer',
    description: 'Добавляет дополнительные эмодзи и анимации',
    enabled: true,
    version: '1.0.0',
    author: 'FOCUS Team',
  },
  {
    id: 'file-compressor',
    name: 'File Compressor',
    description: 'Сжимает файлы перед отправкой',
    enabled: false,
    version: '1.2.0',
    author: 'FOCUS Team',
  },
  {
    id: 'voice-transcriber',
    name: 'Voice Transcriber',
    description: 'Преобразует голосовые сообщения в текст',
    enabled: false,
    version: '0.8.0',
    author: 'FOCUS Team',
  },
];

export const usePlugins = create<PluginsState>((set, get) => ({
  plugins: defaultPlugins,
  marketplacePlugins: [],
  reviews: {},
  favorites: [],

  togglePlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === id ? { ...plugin, enabled: !plugin.enabled, lastUsed: new Date() } : plugin
      ),
    })),

  installPlugin: (plugin) =>
    set((state) => ({
      plugins: [...state.plugins, { ...plugin, status: 'installed', installedVersion: plugin.version }],
      marketplacePlugins: state.marketplacePlugins.map(mp =>
        mp.id === plugin.id ? { ...mp, status: 'installed', installedVersion: plugin.version } : mp
      ),
    })),

  uninstallPlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.filter((plugin) => plugin.id !== id),
      marketplacePlugins: state.marketplacePlugins.map(mp =>
        mp.id === id ? { ...mp, status: 'available', installedVersion: undefined } : mp
      ),
    })),

  updatePlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === id ? { ...plugin, version: plugin.newVersion || plugin.version, updateAvailable: false, newVersion: undefined } : plugin
      ),
    })),

  addToFavorites: (pluginId) =>
    set((state) => ({
      favorites: [...state.favorites, pluginId],
    })),

  removeFromFavorites: (pluginId) =>
    set((state) => ({
      favorites: state.favorites.filter(id => id !== pluginId),
    })),

  addReview: (pluginId, review) =>
    set((state) => {
      const newReview: PluginReview = {
        ...review,
        id: Date.now().toString(),
        date: new Date(),
      };

      const currentReviews = state.reviews[pluginId] || [];
      const updatedReviews = [...currentReviews, newReview];

      // Update plugin rating
      const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

      return {
        reviews: {
          ...state.reviews,
          [pluginId]: updatedReviews,
        },
        marketplacePlugins: state.marketplacePlugins.map(mp =>
          mp.id === pluginId ? { ...mp, rating: avgRating, reviewCount: updatedReviews.length } : mp
        ),
      };
    }),

  updatePluginSettings: (pluginId, settings) =>
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === pluginId ? {
          ...plugin,
          settings: plugin.settings ? { ...plugin.settings, ...settings } : settings as PluginSettings
        } : plugin
      ),
    })),

  loadMarketplacePlugins: async () => {
    // Mock API call - in real implementation, this would fetch from backend
    const mockMarketplacePlugins: MarketplacePlugin[] = [
      {
        id: 'chat-enhancer',
        name: 'Chat Enhancer Pro',
        description: 'Расширенные возможности чата',
        version: '2.1.0',
        author: { name: 'ChatMasters', verified: true },
        category: 'chat',
        tags: ['chat', 'emojis'],
        rating: 4.8,
        reviewCount: 1250,
        downloads: 15420,
        price: 19.99,
        currency: 'USD',
        status: 'available',
        lastUpdated: new Date('2024-01-15'),
        size: '15.2 MB',
        license: 'Commercial',
      },
      // Add more mock plugins...
    ];

    set({ marketplacePlugins: mockMarketplacePlugins });
  },

  purchasePlugin: async (pluginId) => {
    // Mock purchase logic
    return new Promise((resolve) => {
      setTimeout(() => {
        set((state) => ({
          marketplacePlugins: state.marketplacePlugins.map(mp =>
            mp.id === pluginId ? { ...mp, status: 'installed', installedVersion: mp.version } : mp
          ),
        }));
        resolve(true);
      }, 1000);
    });
  },
}));