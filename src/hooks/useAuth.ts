import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  nickname: string;
  phone: string;
  email?: string;
  password: string;
  status: 'online' | 'offline' | 'away';
  avatar?: string;
  role: 'user' | 'moderator' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (identifier: string, password: string) => boolean;
  register: (username: string, nickname: string, phone: string, email: string | undefined, password: string) => boolean;
  setStatus: (status: 'online' | 'offline' | 'away') => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

const getUsersFromStorage = (): User[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('focus_users');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

const saveUsersToStorage = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('focus_users', JSON.stringify(users));
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: getUsersFromStorage(),
  login: (identifier, password) => {
    const users = get().users;
    const user = users.find(u => (u.username === identifier || u.email === identifier || u.phone === identifier) && u.password === password);
    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }
    return false;
  },
  register: (username, nickname, phone, email, password) => {
    const users = get().users;
    if (users.find(u => u.username === username || u.phone === phone || (email && u.email === email))) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      username,
      nickname,
      phone,
      email: email || undefined,
      password,
      status: 'online',
      role: 'user',
    };
    const updatedUsers = [...users, newUser];
    set({ users: updatedUsers });
    saveUsersToStorage(updatedUsers);
    set({ user: newUser, isAuthenticated: true });
    return true;
  },
  setStatus: (status) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, status };
        const updatedUsers = state.users.map(u => u.id === state.user!.id ? updatedUser : u);
        saveUsersToStorage(updatedUsers);
        return { user: updatedUser, users: updatedUsers };
      }
      return state;
    });
  },
  updateUser: (data) => {
    set((state) => {
      if (state.user) {
        const updatedUser = { ...state.user, ...data };
        const updatedUsers = state.users.map(u => u.id === state.user!.id ? updatedUser : u);
        saveUsersToStorage(updatedUsers);
        return { user: updatedUser, users: updatedUsers };
      }
      return state;
    });
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));