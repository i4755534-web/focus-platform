'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Star,
  Medal,
  Crown,
  Target,
  Zap,
  Flame,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Gift,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  BarChart3,
  Gamepad2,
  Sparkles
} from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'communication' | 'collaboration' | 'productivity' | 'engagement' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
  requirements: string[];
}

interface UserStats {
  level: number;
  experience: number;
  experienceToNext: number;
  totalPoints: number;
  streakDays: number;
  rank: number;
  totalAchievements: number;
  unlockedAchievements: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  points: number;
  rank: number;
  change: number; // position change from last period
}

interface Quest {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  rewards: {
    experience: number;
    points: number;
    achievements?: string[];
  };
  progress: number;
  maxProgress: number;
  completed: boolean;
  expiresAt?: Date;
}

export default function GamificationSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 15,
    experience: 2450,
    experienceToNext: 550,
    totalPoints: 12850,
    streakDays: 7,
    rank: 42,
    totalAchievements: 45,
    unlockedAchievements: 32,
  });

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockAchievements: Achievement[] = [
      {
        id: 'first-message',
        name: 'Первый шаг',
        description: 'Отправьте первое сообщение',
        icon: '💬',
        category: 'communication',
        rarity: 'common',
        points: 10,
        unlocked: true,
        progress: 1,
        maxProgress: 1,
        unlockedAt: new Date('2024-01-01'),
        requirements: ['Отправить сообщение'],
      },
      {
        id: 'chat-master',
        name: 'Мастер чатов',
        description: 'Отправьте 1000 сообщений',
        icon: '🎯',
        category: 'communication',
        rarity: 'epic',
        points: 500,
        unlocked: true,
        progress: 1000,
        maxProgress: 1000,
        unlockedAt: new Date('2024-01-15'),
        requirements: ['Отправить 1000 сообщений'],
      },
      {
        id: 'video-caller',
        name: 'Видео-звезда',
        description: 'Проведите 50 видеозвонков',
        icon: '📹',
        category: 'communication',
        rarity: 'rare',
        points: 250,
        unlocked: false,
        progress: 32,
        maxProgress: 50,
        requirements: ['Провести 50 видеозвонков'],
      },
      {
        id: 'collaborator',
        name: 'Командный игрок',
        description: 'Участвуйте в 25 совместных проектах',
        icon: '🤝',
        category: 'collaboration',
        rarity: 'rare',
        points: 300,
        unlocked: false,
        progress: 18,
        maxProgress: 25,
        requirements: ['Участвовать в 25 проектах'],
      },
      {
        id: 'productivity-champion',
        name: 'Чемпион продуктивности',
        description: 'Завершите 100 задач вовремя',
        icon: '⚡',
        category: 'productivity',
        rarity: 'epic',
        points: 750,
        unlocked: false,
        progress: 67,
        maxProgress: 100,
        requirements: ['Завершить 100 задач вовремя'],
      },
      {
        id: 'early-bird',
        name: 'Ранняя пташка',
        description: 'Войдите в систему до 8 утра 30 дней подряд',
        icon: '🌅',
        category: 'engagement',
        rarity: 'legendary',
        points: 1000,
        unlocked: false,
        progress: 12,
        maxProgress: 30,
        requirements: ['Войти до 8 утра 30 дней подряд'],
      },
      {
        id: 'social-butterfly',
        name: 'Социальная бабочка',
        description: 'Добавьте 50 друзей',
        icon: '🦋',
        category: 'engagement',
        rarity: 'rare',
        points: 200,
        unlocked: true,
        progress: 50,
        maxProgress: 50,
        unlockedAt: new Date('2024-01-10'),
        requirements: ['Добавить 50 друзей'],
      },
      {
        id: 'legend',
        name: 'Легенда',
        description: 'Достигните 50 уровня',
        icon: '👑',
        category: 'special',
        rarity: 'legendary',
        points: 5000,
        unlocked: false,
        progress: 15,
        maxProgress: 50,
        requirements: ['Достигнуть 50 уровня'],
      },
    ];

    const mockLeaderboard: LeaderboardEntry[] = [
      { id: '1', name: 'Алексей Петров', level: 28, points: 45200, rank: 1, change: 0 },
      { id: '2', name: 'Мария Иванова', level: 26, points: 38900, rank: 2, change: 1 },
      { id: '3', name: 'Дмитрий Сидоров', level: 25, points: 36750, rank: 3, change: -1 },
      { id: '4', name: 'Елена Козлова', level: 24, points: 34200, rank: 4, change: 2 },
      { id: '5', name: 'Игорь Новиков', level: 23, points: 31800, rank: 5, change: -1 },
      { id: 'user', name: 'Вы', level: 15, points: 12850, rank: 42, change: 3 },
    ];

    const mockQuests: Quest[] = [
      {
        id: 'daily-messages',
        name: 'Общительный день',
        description: 'Отправьте 10 сообщений сегодня',
        type: 'daily',
        rewards: { experience: 50, points: 25 },
        progress: 7,
        maxProgress: 10,
        completed: false,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      {
        id: 'weekly-calls',
        name: 'Видео-неделя',
        description: 'Проведите 5 видеозвонков на этой неделе',
        type: 'weekly',
        rewards: { experience: 200, points: 100 },
        progress: 3,
        maxProgress: 5,
        completed: false,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'monthly-projects',
        name: 'Проектный месяц',
        description: 'Завершите 3 проекта в этом месяце',
        type: 'monthly',
        rewards: { experience: 500, points: 250, achievements: ['project-master'] },
        progress: 1,
        maxProgress: 3,
        completed: false,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'special-welcome',
        name: 'Добро пожаловать!',
        description: 'Завершите процесс адаптации',
        type: 'special',
        rewards: { experience: 100, points: 50, achievements: ['welcome-aboard'] },
        progress: 1,
        maxProgress: 1,
        completed: true,
      },
    ];

    setAchievements(mockAchievements);
    setLeaderboard(mockLeaderboard);
    setQuests(mockQuests);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'text-gray-600 bg-gray-100';
      case 'rare':
        return 'text-blue-600 bg-blue-100';
      case 'epic':
        return 'text-purple-600 bg-purple-100';
      case 'legendary':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'communication':
        return '💬';
      case 'collaboration':
        return '🤝';
      case 'productivity':
        return '⚡';
      case 'engagement':
        return '🎯';
      case 'special':
        return '⭐';
      default:
        return '🏆';
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const experiencePercentage = (userStats.experience / (userStats.experience + userStats.experienceToNext)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Gamepad2 className="w-6 h-6" />
              <div>
                <CardTitle>Геймификация</CardTitle>
                <CardDescription>
                  Достижения, уровни и награды за активность в FOCUS
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">Уровень {userStats.level}</div>
              <div className="text-sm text-gray-600">Ранг #{userStats.rank}</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <div className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</div>
            </div>
            <p className="text-xs text-muted-foreground">Всего очков</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <div className="text-2xl font-bold">{userStats.streakDays}</div>
            </div>
            <p className="text-xs text-muted-foreground">Дней подряд</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-purple-500" />
              <div className="text-2xl font-bold">{userStats.unlockedAchievements}/{userStats.totalAchievements}</div>
            </div>
            <p className="text-xs text-muted-foreground">Достижений</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <div className="text-2xl font-bold">{Math.round(experiencePercentage)}%</div>
            </div>
            <p className="text-xs text-muted-foreground">До следующего уровня</p>
          </CardContent>
        </Card>
      </div>

      {/* Experience Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Опыт</span>
            <span className="text-sm text-gray-600">
              {userStats.experience.toLocaleString()} / {(userStats.experience + userStats.experienceToNext).toLocaleString()} XP
            </span>
          </div>
          <Progress value={experiencePercentage} className="h-3" />
          <div className="mt-2 text-xs text-gray-600">
            Осталось {userStats.experienceToNext.toLocaleString()} XP до уровня {userStats.level + 1}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="achievements">Достижения</TabsTrigger>
          <TabsTrigger value="quests">Квесты</TabsTrigger>
          <TabsTrigger value="leaderboard">Таблица лидеров</TabsTrigger>
          <TabsTrigger value="rewards">Награды</TabsTrigger>
        </TabsList>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Достижения</CardTitle>
                  <CardDescription>
                    Разблокируйте достижения выполняя различные задачи
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    Все
                  </Button>
                  <Button
                    variant={selectedCategory === 'communication' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('communication')}
                  >
                    💬 Связь
                  </Button>
                  <Button
                    variant={selectedCategory === 'collaboration' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('collaboration')}
                  >
                    🤝 Сотрудничество
                  </Button>
                  <Button
                    variant={selectedCategory === 'productivity' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('productivity')}
                  >
                    ⚡ Продуктивность
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAchievements.map((achievement) => (
                  <Card key={achievement.id} className={`relative ${achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{achievement.name}</h4>
                            {achievement.unlocked && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getRarityColor(achievement.rarity)}>
                              {achievement.rarity === 'common' ? 'Обычное' :
                               achievement.rarity === 'rare' ? 'Редкое' :
                               achievement.rarity === 'epic' ? 'Эпическое' : 'Легендарное'}
                            </Badge>
                            <span className="text-sm text-gray-600">+{achievement.points} очков</span>
                          </div>

                          {!achievement.unlocked && (
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Прогресс</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress
                                value={(achievement.progress / achievement.maxProgress) * 100}
                                className="h-2"
                              />
                            </div>
                          )}

                          {achievement.unlocked && achievement.unlockedAt && (
                            <div className="text-xs text-green-600 mt-2">
                              Разблокировано {achievement.unlockedAt.toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quests */}
        <TabsContent value="quests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Квесты</CardTitle>
              <CardDescription>
                Выполняйте ежедневные, еженедельные и специальные задания
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quests.map((quest) => (
                  <Card key={quest.id} className={quest.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{quest.name}</h4>
                            <Badge variant="outline">
                              {quest.type === 'daily' ? 'Ежедневно' :
                               quest.type === 'weekly' ? 'Еженедельно' :
                               quest.type === 'monthly' ? 'Ежемесячно' : 'Специальное'}
                            </Badge>
                            {quest.completed && <CheckCircle className="w-4 h-4 text-green-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{quest.description}</p>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Zap className="w-3 h-3 text-yellow-500" />
                              <span>+{quest.rewards.experience} XP</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-purple-500" />
                              <span>+{quest.rewards.points} очков</span>
                            </div>
                            {quest.expiresAt && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span>{Math.ceil((quest.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} дней</span>
                              </div>
                            )}
                          </div>

                          {!quest.completed && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Прогресс</span>
                                <span>{quest.progress}/{quest.maxProgress}</span>
                              </div>
                              <Progress
                                value={(quest.progress / quest.maxProgress) * 100}
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Таблица лидеров</CardTitle>
              <CardDescription>
                Топ пользователей по очкам и уровню
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      entry.id === 'user' ? 'bg-purple-50 border border-purple-200' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm font-bold">
                        {entry.rank <= 3 ? (
                          entry.rank === 1 ? '🥇' :
                          entry.rank === 2 ? '🥈' : '🥉'
                        ) : entry.rank}
                      </div>

                      <Avatar>
                        <AvatarImage src={entry.avatar} />
                        <AvatarFallback>
                          {entry.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h4 className="font-medium">{entry.name}</h4>
                        <p className="text-sm text-gray-600">Уровень {entry.level}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">{entry.points.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">очков</div>
                      </div>

                      {entry.change !== 0 && (
                        <div className={`flex items-center gap-1 text-sm ${
                          entry.change > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {entry.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(entry.change)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rewards */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Награды и бонусы</CardTitle>
              <CardDescription>
                Обменивайте очки на эксклюзивные награды
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="pt-6 text-center">
                    <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h4 className="font-medium mb-2">Premium тема</h4>
                    <p className="text-sm text-gray-600 mb-4">Эксклюзивная тема оформления</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">500 очков</span>
                      <Button size="sm" disabled={userStats.totalPoints < 500}>
                        {userStats.totalPoints >= 500 ? 'Обменять' : 'Недостаточно'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="pt-6 text-center">
                    <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                    <h4 className="font-medium mb-2">VIP статус</h4>
                    <p className="text-sm text-gray-600 mb-4">Специальный значок и приоритеты</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">1000 очков</span>
                      <Button size="sm" disabled={userStats.totalPoints < 1000}>
                        {userStats.totalPoints >= 1000 ? 'Обменять' : 'Недостаточно'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="pt-6 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                    <h4 className="font-medium mb-2">Экстра функции</h4>
                    <p className="text-sm text-gray-600 mb-4">Расширенные возможности на месяц</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">750 очков</span>
                      <Button size="sm" disabled={userStats.totalPoints < 750}>
                        {userStats.totalPoints >= 750 ? 'Обменять' : 'Недостаточно'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}