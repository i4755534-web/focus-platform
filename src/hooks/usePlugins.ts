import { create } from 'zustand';

interface Plugin {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  version: string;
  author: string;
}

interface PluginsState {
  plugins: Plugin[];
  togglePlugin: (id: string) => void;
  installPlugin: (plugin: Plugin) => void;
  uninstallPlugin: (id: string) => void;
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

export const usePlugins = create<PluginsState>((set) => ({
  plugins: defaultPlugins,
  togglePlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.map((plugin) =>
        plugin.id === id ? { ...plugin, enabled: !plugin.enabled } : plugin
      ),
    })),
  installPlugin: (plugin) =>
    set((state) => ({
      plugins: [...state.plugins, plugin],
    })),
  uninstallPlugin: (id) =>
    set((state) => ({
      plugins: state.plugins.filter((plugin) => plugin.id !== id),
    })),
}));