'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import PhotoUpload from './PhotoUpload';
import type { User } from '@/lib/database';

interface ProfileEditorProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onCancel?: () => void;
}

export default function ProfileEditor({ user, onSave, onCancel }: ProfileEditorProps) {
  const [formData, setFormData] = useState({
    displayName: user.displayName,
    age: user.age || '',
    gender: user.gender || '',
    bio: user.bio || '',
    interests: [...user.interests],
    hobbies: [...user.hobbies],
    games: [...user.games],
    photos: [...user.photos],
    location: user.location ? { ...user.location } : undefined,
  });

  const [newInterest, setNewInterest] = useState('');
  const [newHobby, setNewHobby] = useState('');
  const [newGame, setNewGame] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(!!formData.location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      displayName: formData.displayName,
      age: formData.age ? parseInt(formData.age.toString()) : undefined,
      gender: formData.gender as 'male' | 'female' | 'other' | undefined,
      bio: formData.bio,
      interests: formData.interests,
      hobbies: formData.hobbies,
      games: formData.games,
      photos: formData.photos,
      location: formData.location,
    });
  };

  const addItem = (type: 'interests' | 'hobbies' | 'games', value: string) => {
    if (value && !formData[type].includes(value)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], value]
      }));
    }
  };

  const removeItem = (type: 'interests' | 'hobbies' | 'games', value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item !== value)
    }));
  };

  const handleLocationToggle = async () => {
    if (!locationEnabled) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData(prev => ({
              ...prev,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              }
            }));
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
      setFormData(prev => ({
        ...prev,
        location: undefined
      }));
      setLocationEnabled(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PhotoUpload
        photos={formData.photos}
        onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
      />

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="displayName">Имя</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Возраст</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                min="18"
                max="99"
              />
            </div>

            <div>
              <Label htmlFor="gender">Пол</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Мужской</SelectItem>
                  <SelectItem value="female">Женский</SelectItem>
                  <SelectItem value="other">Другой</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="bio">О себе</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Расскажите о себе..."
              rows={3}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label>Геолокация</Label>
              <Button
                type="button"
                variant={locationEnabled ? "default" : "outline"}
                size="sm"
                onClick={handleLocationToggle}
              >
                <MapPin className="w-4 h-4 mr-1" />
                {locationEnabled ? 'Отключить' : 'Включить'}
              </Button>
            </div>
            {locationEnabled && formData.location && (
              <p className="text-sm text-muted-foreground">
                Координаты: {formData.location.lat.toFixed(4)}, {formData.location.lng.toFixed(4)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Интересы и хобби</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Интересы</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Добавить интерес"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('interests', newInterest);
                    setNewInterest('');
                  }
                }}
              />
              <Button type="button" onClick={() => { addItem('interests', newInterest); setNewInterest(''); }}>
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="cursor-pointer"
                  onClick={() => removeItem('interests', interest)}>
                  {interest} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Хобби</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Добавить хобби"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('hobbies', newHobby);
                    setNewHobby('');
                  }
                }}
              />
              <Button type="button" onClick={() => { addItem('hobbies', newHobby); setNewHobby(''); }}>
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.hobbies.map(hobby => (
                <Badge key={hobby} variant="outline" className="cursor-pointer"
                  onClick={() => removeItem('hobbies', hobby)}>
                  {hobby} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Игры</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Добавить игру"
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addItem('games', newGame);
                    setNewGame('');
                  }
                }}
              />
              <Button type="button" onClick={() => { addItem('games', newGame); setNewGame(''); }}>
                Добавить
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.games.map(game => (
                <Badge key={game} variant="outline" className="cursor-pointer"
                  onClick={() => removeItem('games', game)}>
                  {game} ×
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button type="submit">
          Сохранить
        </Button>
      </div>
    </form>
  );
}