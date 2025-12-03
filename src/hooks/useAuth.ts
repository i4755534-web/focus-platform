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
  register: (username: string, nickname: string, phone: string, password: string, email?: string) => boolean;
  setStatus: (status: 'online' | 'offline' | 'away') => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('focus_users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Ошибка загрузки пользователей из localStorage:', error);
    return [];
  }
};

const saveUsersToStorage = (users: User[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('focus_users', JSON.stringify(users));
  } catch (error) {
    console.error('Ошибка сохранения пользователей в localStorage:', error);
  }
};

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  users: getUsersFromStorage(),

  login: (identifier, password) => {
    if (!identifier || !password) {
      console.error('Логин и пароль обязательны');
      return false;
    }

    const users = get().users;
    const user = users.find(u =>
      (u.username === identifier || u.email === identifier || u.phone === identifier) &&
      u.password === password
    );

    if (user) {
      set({ user, isAuthenticated: true });
      return true;
    }

    console.error('Неверные учетные данные');
    return false;
  },
  register: (username, nickname, phone, password, email) => {
    if (!username || !nickname || !phone || !password) {
      console.error('Все обязательные поля должны быть заполнены');
      return false;
    }

    const users = get().users;

    if (users.find(u => u.username === username || u.phone === phone || (email && u.email === email))) {
      console.error('Пользователь с таким именем, телефоном или email уже существует');
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username,
      nickname,
      phone,
      password,
      email,
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