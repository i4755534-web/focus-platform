'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ChatClient from '@/components/chat/ChatClient';
import UserSwitcher from '@/components/UserSwitcher';

interface Match {
  id: string;
  displayName: string;
  age?: number;
  gender?: string;
  interests: string[];
  hobbies: string[];
  games: string[];
}

export default function ChatRoulettePage() {
  const [currentUserId, setCurrentUserId] = useState('user-1');
  const [preferences, setPreferences] = useState({
    gender: 'any',
    ageRange: [18, 99],
    interests: [] as string[],
    hobbies: [] as string[],
    games: [] as string[],
  });
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const findMatch = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat-roulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, preferences }),
      });
      const data = await response.json();
      if (data.match) {
        setMatch(data.match);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to find match:', error);
      alert('Ошибка поиска');
    }
    setLoading(false);
  };

  const addInterest = (value: string) => {
    if (value && !preferences.interests.includes(value)) {
      setPreferences(prev => ({
        ...prev,
        interests: [...prev.interests, value]
      }));
    }
  };

  const removeInterest = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== value)
    }));
  };

  if (chatId && match) {
    return <ChatClient chatId={chatId} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Чат-рулетка</h1>
        <UserSwitcher currentUserId={currentUserId} onUserChange={setCurrentUserId} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Настройки поиска</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Пол</Label>
              <Select value={preferences.gender} onValueChange={(value) =>
                setPreferences(prev => ({ ...prev, gender: value }))
              }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любой</SelectItem>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Возраст от {preferences.ageRange[0]} до {preferences.ageRange[1]}</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  value={preferences.ageRange[0]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                  }))}
                  min="18"
                  max="99"
                />
                <Input
                  type="number"
                  value={preferences.ageRange[1]}
                  onChange={(e) => setPreferences(prev => ({
                    ...prev,
                    ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                  }))}
                  min="18"
                  max="99"
                />
              </div>
            </div>

            <div>
              <Label>Интересы</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Добавить интерес"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addInterest((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.interests.map(interest => (
                  <Badge key={interest} variant="secondary" className="cursor-pointer"
                    onClick={() => removeInterest(interest)}>
                    {interest} ×
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={findMatch} disabled={loading} className="w-full">
              {loading ? 'Поиск...' : 'Найти собеседника'}
            </Button>
          </CardContent>
        </Card>

        {match && (
          <Card>
            <CardHeader>
              <CardTitle>Найден собеседник!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Имя:</strong> {match.displayName}</p>
                {match.age && <p><strong>Возраст:</strong> {match.age}</p>}
                {match.gender && <p><strong>Пол:</strong> {match.gender}</p>}
                <p><strong>Интересы:</strong> {match.interests.join(', ')}</p>
                <p><strong>Хобби:</strong> {match.hobbies.join(', ')}</p>
                <p><strong>Игры:</strong> {match.games.join(', ')}</p>
              </div>
              <Button onClick={() => setChatId(`roulette-${match.id}`)} className="w-full mt-4">
                Начать чат
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}