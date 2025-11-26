import { create } from 'zustand';

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

interface IntegrationsState {
  integrations: Integration[];
  connectIntegration: (id: string) => Promise<void>;
  disconnectIntegration: (id: string) => void;
}

const integrations: Integration[] = [
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Синхронизация файлов и документов',
    connected: false,
    icon: '📁',
    connect: async () => {
      // Mock Google OAuth
      console.log('Connecting to Google Drive...');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Google Drive подключен!');
    },
    disconnect: () => {
      console.log('Disconnecting from Google Drive...');
      alert('Google Drive отключен!');
    },
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Интеграция с рабочими пространствами Slack',
    connected: false,
    icon: '💬',
    connect: async () => {
      console.log('Connecting to Slack...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Slack подключен!');
    },
    disconnect: () => {
      console.log('Disconnecting from Slack...');
      alert('Slack отключен!');
    },
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Интеграция с репозиториями и проектами',
    connected: false,
    icon: '🐙',
    connect: async () => {
      console.log('Connecting to GitHub...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('GitHub подключен!');
    },
    disconnect: () => {
      console.log('Disconnecting from GitHub...');
      alert('GitHub отключен!');
    },
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Интеграция с Discord серверами',
    connected: false,
    icon: '🎮',
    connect: async () => {
      console.log('Connecting to Discord...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Discord подключен!');
    },
    disconnect: () => {
      console.log('Disconnecting from Discord...');
      alert('Discord отключен!');
    },
  },
];

export const useIntegrations = create<IntegrationsState>((set, get) => ({
  integrations,
  connectIntegration: async (id) => {
    const integration = get().integrations.find(i => i.id === id);
    if (integration) {
      await integration.connect();
      set((state) => ({
        integrations: state.integrations.map(i =>
          i.id === id ? { ...i, connected: true } : i
        ),
      }));
    }
  },
  disconnectIntegration: (id) => {
    const integration = get().integrations.find(i => i.id === id);
    if (integration) {
      integration.disconnect();
      set((state) => ({
        integrations: state.integrations.map(i =>
          i.id === id ? { ...i, connected: false } : i
        ),
      }));
    }
  },
}));