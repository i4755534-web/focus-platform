'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Preferences {
  gender: string;
  ageRange: [number, number];
  interests: string[];
  hobbies: string[];
  games: string[];
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
}

interface AdvancedFiltersProps {
  preferences: Preferences;
  onPreferencesChange: (preferences: Preferences) => void;
}

export default function AdvancedFilters({ preferences, onPreferencesChange }: AdvancedFiltersProps) {
  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newGame, setNewGame] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(!!preferences.location);

  const addItem = (type: 'interests' | 'hobbies' | 'games', value: string) => {
    if (value && !preferences[type].includes(value)) {
      onPreferencesChange({
        ...preferences,
        [type]: [...preferences[type], value]
      });
    }
  };

  const removeItem = (type: 'interests' | 'hobbies' | 'games', value: string) => {
    onPreferencesChange({
      ...preferences,
      [type]: preferences[type].filter(item => item !== value)
    });
  };

  const handleLocationToggle = async () => {
    if (!locationEnabled) {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            onPreferencesChange({
              ...preferences,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                radius: 50 // default 50km
              }
            });
            setLocationEnabled(true);
          },
          (error) => {
            console.error('Error getting location:', error);
            alert('Не удалось получить геолокацию');
          }
        );
      } else {
        alert('Геолокация не поддерживается');
      }
    } else {
      onPreferencesChange({
        ...preferences,
        location: undefined
      });
      setLocationEnabled(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Расширенные фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gender */}
        <div>
          <Label>Пол</Label>
          <Select
            value={preferences.gender}
            onValueChange={(value) =>
              onPreferencesChange({ ...preferences, gender: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Любой</SelectItem>
              <SelectItem value="male">Мужской</SelectItem>
              <SelectItem value="female">Женский</SelectItem>
              <SelectItem value="other">Другой</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Range */}
        <div>
          <Label>Возраст от {preferences.ageRange[0]} до {preferences.ageRange[1]}</Label>
          <div className="flex gap-2 mt-2">
            <Input
              type="number"
              value={preferences.ageRange[0]}
              onChange={(e) => onPreferencesChange({
                ...preferences,
                ageRange: [parseInt(e.target.value), preferences.ageRange[1]]
              })}
              min="18"
              max="99"
              className="w-20"
            />
            <Input
              type="number"
              value={preferences.ageRange[1]}
              onChange={(e) => onPreferencesChange({
                ...preferences,
                ageRange: [preferences.ageRange[0], parseInt(e.target.value)]
              })}
              min="18"
              max="99"
              className="w-20"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2">
            <Label>Геолокация</Label>
            <Button
              variant={locationEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleLocationToggle}
            >
              <MapPin className="w-4 h-4 mr-1" />
              {locationEnabled ? 'Отключить' : 'Включить'}
            </Button>
          </div>
          {locationEnabled && preferences.location && (
            <div className="mt-2">
              <Label>Радиус поиска (км)</Label>
              <Input
                type="number"
                value={preferences.location.radius}
                onChange={(e) => onPreferencesChange({
                  ...preferences,
                  location: {
                    ...preferences.location!,
                    radius: parseInt(e.target.value)
                  }
                })}
                min="1"
                max="500"
                className="w-24 mt-1"
              />
            </div>
          )}
        </div>

        {/* Interests */}
        <div>
          <Label>Интересы</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Добавить интерес"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addItem('interests', newInterest);
                  setNewInterest('');
                }
              }}
            />
            <Button onClick={() => { addItem('interests', newInterest); setNewInterest(''); }}>
              Добавить
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.interests.map(interest => (
              <Badge key={interest} variant="secondary" className="cursor-pointer"
                onClick={() => removeItem('interests', interest)}>
                {interest} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* Hobbies */}
        <div>
          <Label>Хобби</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Добавить хобби"
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addItem('hobbies', newHobby);
                  setNewHobby('');
                }
              }}
            />
            <Button onClick={() => { addItem('hobbies', newHobby); setNewHobby(''); }}>
              Добавить
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.hobbies.map(hobby => (
              <Badge key={hobby} variant="secondary" className="cursor-pointer"
                onClick={() => removeItem('hobbies', hobby)}>
                {hobby} ×
              </Badge>
            ))}
          </div>
        </div>

        {/* Games */}
        <div>
          <Label>Игры</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Добавить игру"
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addItem('games', newGame);
                  setNewGame('');
                }
              }}
            />
            <Button onClick={() => { addItem('games', newGame); setNewGame(''); }}>
              Добавить
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {preferences.games.map(game => (
              <Badge key={game} variant="secondary" className="cursor-pointer"
                onClick={() => removeItem('games', game)}>
                {game} ×
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}