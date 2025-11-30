'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTokens } from '@/hooks/useTokens';
import { useWeb3 } from '@/hooks/useWeb3';
import { Coins, Send, Download, Upload, RefreshCw, TrendingUp, History, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TokenDashboard() {
  const { balances, transactions, isLoading, transferTokens, buyTokens, getTokenPrice, refresh } = useTokens();
  const { web3State } = useWeb3();
  const [transferDialog, setTransferDialog] = useState(false);
  const [buyDialog, setBuyDialog] = useState(false);
  const [transferForm, setTransferForm] = useState({
    to: '',
    amount: '',
    token: 'FOCUS',
  });
  const [buyForm, setBuyForm] = useState({
    amount: '',
    currency: 'ETH' as 'ETH' | 'USDC',
    price: '',
  });

  const handleTransfer = async () => {
    try {
      const tokenBalance = balances.find(b => b.symbol === transferForm.token);
      if (!tokenBalance) throw new Error('Token not found');

      const tokenAddress = transferForm.token === 'FOCUS' ? tokenBalance.contractAddress : undefined;
      await transferTokens(transferForm.to, transferForm.amount, tokenAddress);

      toast.success('Транзакция отправлена!');
      setTransferDialog(false);
      setTransferForm({ to: '', amount: '', token: 'FOCUS' });
      refresh();
    } catch (error) {
      toast.error('Ошибка при переводе токенов');
      console.error(error);
    }
  };

  const handleBuy = async () => {
    try {
      const price = (parseFloat(buyForm.amount) * 0.10).toFixed(2);
      await buyTokens({
        amount: buyForm.amount,
        price,
        currency: buyForm.currency,
      });
      toast.success('Покупка токенов инициирована!');
      setBuyDialog(false);
      setBuyForm({ amount: '', currency: 'ETH', price: '' });
      refresh();
    } catch (error) {
      toast.error('Ошибка при покупке токенов');
      console.error(error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!web3State.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Токены
          </CardTitle>
          <CardDescription>
            Подключите кошелек для управления токенами
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Balances */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Баланс токенов
            </div>
            <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Обновить
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {balances.map((balance) => (
              <div key={balance.symbol} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{balance.symbol}</h3>
                  <Badge variant="secondary">{balance.symbol}</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {parseFloat(balance.balance).toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}
                </div>
                <div className="text-sm text-gray-600">
                  ≈ ${(parseFloat(balance.balance) * parseFloat('0.10')).toFixed(2)} USD
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Dialog open={transferDialog} onOpenChange={setTransferDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Перевести
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Перевод токенов</DialogTitle>
                  <DialogDescription>
                    Отправьте токены на другой адрес
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="token">Токен</Label>
                    <Select value={transferForm.token} onValueChange={(value) => setTransferForm(prev => ({ ...prev, token: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {balances.map((balance) => (
                          <SelectItem key={balance.symbol} value={balance.symbol}>
                            {balance.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="to">Адрес получателя</Label>
                    <Input
                      id="to"
                      placeholder="0x..."
                      value={transferForm.to}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Количество</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={transferForm.amount}
                      onChange={(e) => setTransferForm(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleTransfer} className="w-full">
                    Отправить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={buyDialog} onOpenChange={setBuyDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Купить токены
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Покупка токенов</DialogTitle>
                  <DialogDescription>
                    Купите FOCUS токены
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Валюта оплаты</Label>
                    <Select value={buyForm.currency} onValueChange={(value: 'ETH' | 'USDC') => setBuyForm(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ETH">ETH</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="buyAmount">Количество FOCUS</Label>
                    <Input
                      id="buyAmount"
                      type="number"
                      placeholder="100"
                      value={buyForm.amount}
                      onChange={(e) => setBuyForm(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Стоимость: ≈ ${(parseFloat(buyForm.amount || '0') * 0.10).toFixed(2)} {buyForm.currency}
                    </div>
                  </div>
                  <Button onClick={handleBuy} className="w-full" disabled={!buyForm.amount}>
                    Купить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            История транзакций
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Транзакций пока нет</p>
            ) : (
              transactions.map((tx) => (
                <div key={tx.hash} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-green-100' :
                      tx.type === 'send' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {tx.type === 'receive' ? <Download className="w-4 h-4 text-green-600" /> :
                       tx.type === 'send' ? <Upload className="w-4 h-4 text-red-600" /> :
                       <DollarSign className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {tx.type === 'receive' ? 'Получено' :
                         tx.type === 'send' ? 'Отправлено' :
                         tx.type === 'buy' ? 'Куплено' : 'Продано'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDate(tx.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      tx.type === 'receive' ? 'text-green-600' :
                      tx.type === 'send' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {tx.type === 'receive' ? '+' : '-'}{tx.value} FOCUS
                    </div>
                    <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                      {tx.status === 'confirmed' ? 'Подтверждена' :
                       tx.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                    </Badge>
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