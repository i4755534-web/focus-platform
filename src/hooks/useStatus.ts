import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Status = 'online' | 'offline' | 'busy' | 'away';

interface StatusState {
  currentStatus: Status;
  lastSeen: Date | null;
  setStatus: (status: Status) => void;
  updateLastSeen: () => void;
}

export const useStatus = create<StatusState>()(
  persist(
    (set, get) => ({
      currentStatus: 'online',
      lastSeen: null,

      setStatus: (status: Status) => {
        set({ currentStatus: status });
        if (status === 'offline') {
          get().updateLastSeen();
        }
      },

      updateLastSeen: () => {
        set({ lastSeen: new Date() });
      },
    }),
    {
      name: 'focus-user-status',
    }
  )
);