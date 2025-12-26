import { create } from 'zustand';

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: string;
}

interface IntegrationConfig {
  botToken?: string;
  accessToken?: string;
  webhookUrl?: string;
  clientId?: string;
  clientSecret?: string;
}

interface IntegrationsState {
  integrations: Integration[];
  loading: boolean;
  error: string | null;
  fetchIntegrations: () => Promise<void>;
  connectIntegration: (id: string, config?: IntegrationConfig) => Promise<void>;
  disconnectIntegration: (id: string) => Promise<void>;
}

export const useIntegrations = create<IntegrationsState>((set, get) => ({
  integrations: [],
  loading: false,
  error: null,

  fetchIntegrations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/integrations');
      if (!response.ok) {
        throw new Error('Failed to fetch integrations');
      }
      const data = await response.json();
      set({ integrations: data.integrations, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      });
    }
  },

  connectIntegration: async (id, config) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationId: id,
          action: 'connect',
          config,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect integration');
      }

      const data = await response.json();

      // Update local state
      set((state) => ({
        integrations: state.integrations.map(i =>
          i.id === id ? { ...i, connected: true } : i
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      });
      throw error;
    }
  },

  disconnectIntegration: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          integrationId: id,
          action: 'disconnect',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect integration');
      }

      // Update local state
      set((state) => ({
        integrations: state.integrations.map(i =>
          i.id === id ? { ...i, connected: false } : i
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        loading: false
      });
      throw error;
    }
  },
}));