'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStaking } from '@/hooks/useStaking';
import { useWeb3 } from '@/hooks/useWeb3';
import { TrendingUp, Clock, DollarSign, Award, RefreshCw, Plus, Minus } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function StakingInterface() {
  const {
    pools,
    userStakes,
    rewards,
    isLoading,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    calculateRewards,
    getTotalStaked,
    getTotalRewards,
    refresh,
  } = useStaking();
  const { web3State } = useWeb3();
  const [stakeDialog, setStakeDialog] = useState(false);
  const [unstakeDialog, setUnstakeDialog] = useState(false);
  const [selectedPool, setSelectedPool] = useState('');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const handleStake = async () => {
    try {
      await stakeTokens(selectedPool, stakeAmount);
      toast.success('Стейкинг инициирован!');
      setStakeDialog(false);
      setStakeAmount('');
      setSelectedPool('');
      refresh();
    } catch (error) {
      toast.error('Ошибка при стейкинге');
      console.error(error);
    }
  };

  const handleUnstake = async () => {
    try {
      const stake = userStakes.find(s => s.poolId === selectedPool);
      if (!stake) throw new Error('Стейк не найден');

      await unstakeTokens(selectedPool, unstakeAmount);
      toast.success('Вывод средств инициирован!');
      setUnstakeDialog(false);
      setUnstakeAmount('');
      setSelectedPool('');
      refresh();
    } catch (error) {
      toast.error('Ошибка при выводе средств');
      console.error(error);
    }
  };

  const handleClaimRewards = async (poolId?: string) => {
    try {
      await claimRewards(poolId);
      toast.success('Награды получены!');
      refresh();
    } catch (error) {
      toast.error('Ошибка при получении наград');
      console.error(error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Date.now();
    const remaining = endTime - now;

    if (remaining <= 0) return 'Завершен';

    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days}д ${hours}ч`;
  };

  if (!web3State.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Staking
          </CardTitle>
          <CardDescription>
            Подключите кошелек для участия в стейкинге
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Всего застейкано</p>
                <p className="text-2xl font-bold">{getTotalStaked()} FOCUS</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Общие награды</p>
                <p className="text-2xl font-bold">{getTotalRewards()} FOCUS</p>
              </div>
              <Award className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Активные стейки</p>
                <p className="text-2xl font-bold">{userStakes.filter(s => s.status === 'active').length}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staking Pools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Пули стейкинга
            </div>
            <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pools.map((pool) => (
              <Card key={pool.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{pool.name}</h3>
                    <Badge variant="secondary">{pool.apy}% APY</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Мин. стейк:</span>
                      <span>{pool.minStake} FOCUS</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Период:</span>
                      <span>{pool.duration} дней</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Всего стейка:</span>
                      <span>{parseFloat(pool.totalStaked).toLocaleString()} FOCUS</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog open={stakeDialog && selectedPool === pool.id} onOpenChange={(open) => {
                      setStakeDialog(open);
                      if (open) setSelectedPool(pool.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="flex-1">
                          <Plus className="w-4 h-4 mr-1" />
                          Стейк
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Стейкинг токенов</DialogTitle>
                          <DialogDescription>
                            Застейкайте FOCUS токены в пуле {pool.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="stakeAmount">Количество FOCUS</Label>
                            <Input
                              id="stakeAmount"
                              type="number"
                              placeholder={pool.minStake}
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                            />
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600">
                              Потенциальные награды: {calculateRewards(stakeAmount || '0', pool.apy, pool.duration)} FOCUS
                            </div>
                          </div>
                          <Button onClick={handleStake} className="w-full" disabled={!stakeAmount || parseFloat(stakeAmount) < parseFloat(pool.minStake)}>
                            Застейкать
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Stakes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Мои стейки
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStakes.length === 0 ? (
              <p className="text-gray-500 text-center py-4">У вас нет активных стейков</p>
            ) : (
              userStakes.map((stake) => {
                const pool = pools.find(p => p.id === stake.poolId);
                const progress = ((Date.now() - stake.startTime) / (stake.endTime - stake.startTime)) * 100;

                return (
                  <div key={`${stake.poolId}-${stake.startTime}`} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{pool?.name || `Пул ${stake.poolId}`}</h4>
                      <Badge variant={stake.status === 'active' ? 'default' : 'secondary'}>
                        {stake.status === 'active' ? 'Активен' :
                         stake.status === 'completed' ? 'Завершен' : 'Выведен'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Сумма</p>
                        <p className="font-medium">{stake.amount} FOCUS</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Награды</p>
                        <p className="font-medium text-green-600">{stake.rewards} FOCUS</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Начало</p>
                        <p className="font-medium">{formatDate(stake.startTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Осталось</p>
                        <p className="font-medium">{getTimeRemaining(stake.endTime)}</p>
                      </div>
                    </div>

                    {stake.status === 'active' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Прогресс</span>
                          <span>{Math.min(progress, 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} />
                      </div>
                    )}

                    <div className="flex gap-2">
                      {stake.status === 'active' && parseFloat(stake.rewards) > 0 && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleClaimRewards(stake.poolId)}
                        >
                          <Award className="w-4 h-4 mr-1" />
                          Получить награды
                        </Button>
                      )}

                      {stake.status === 'active' && (
                        <Dialog open={unstakeDialog && selectedPool === stake.poolId} onOpenChange={(open) => {
                          setUnstakeDialog(open);
                          if (open) setSelectedPool(stake.poolId);
                        }}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Minus className="w-4 h-4 mr-1" />
                              Вывести
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Вывод средств</DialogTitle>
                              <DialogDescription>
                                Вывести токены из стейкинга
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="unstakeAmount">Количество для вывода</Label>
                                <Input
                                  id="unstakeAmount"
                                  type="number"
                                  placeholder={stake.amount}
                                  max={stake.amount}
                                  value={unstakeAmount}
                                  onChange={(e) => setUnstakeAmount(e.target.value)}
                                />
                              </div>
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                  При раннем выводе вы можете потерять часть наград
                                </p>
                              </div>
                              <Button onClick={handleUnstake} className="w-full">
                                Вывести средства
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rewards History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            История наград
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rewards.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Наград пока нет</p>
            ) : (
              rewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {reward.type === 'staking' ? 'Стейкинг' :
                         reward.type === 'referral' ? 'Реферальные' : 'Бонус'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(reward.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">
                      +{reward.amount} FOCUS
                    </div>
                    <div className="text-sm text-gray-600">
                      Пул {reward.poolId}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}