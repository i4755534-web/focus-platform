import { create } from 'zustand';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface AchievementsState {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'first_message',
    title: 'Первый шаг',
    description: 'Отправьте первое сообщение',
    icon: '💬',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'chat_master',
    title: 'Мастер чата',
    description: 'Отправьте 100 сообщений',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
  },
  {
    id: 'friend_maker',
    title: 'Дружелюбный',
    description: 'Добавьте 5 друзей',
    icon: '👥',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'file_sharer',
    title: 'Делитель файлов',
    description: 'Поделитесь 10 файлами',
    icon: '📁',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
];

export const useAchievements = create<AchievementsState>((set) => ({
  achievements: initialAchievements,
  unlockAchievement: (id) =>
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id ? { ...achievement, unlocked: true, progress: achievement.maxProgress } : achievement
      ),
    })),
  updateProgress: (id, progress) =>
    set((state) => ({
      achievements: state.achievements.map((achievement) =>
        achievement.id === id
          ? {
              ...achievement,
              progress: Math.min(progress, achievement.maxProgress),
              unlocked: progress >= achievement.maxProgress,
            }
          : achievement
      ),
    })),
}));