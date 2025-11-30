'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Heart } from 'lucide-react';
import CompatibilityScore from '@/components/profile/CompatibilityScore';

interface User {
  id: string;
  displayName: string;
  age?: number;
  gender?: string;
  interests: string[];
  hobbies: string[];
  games: string[];
  photos: string[];
  location?: {
    lat: number;
    lng: number;
  };
  bio?: string;
}

interface ProfilePreviewProps {
  user: User;
  compatibilityScore?: number;
  currentUserLocation?: {
    lat: number;
    lng: number;
  };
}

export default function ProfilePreview({ user, compatibilityScore, currentUserLocation }: ProfilePreviewProps) {
  const getGenderText = (gender?: string) => {
    switch (gender) {
      case 'male': return 'Мужской';
      case 'female': return 'Женский';
      case 'other': return 'Другой';
      default: return 'Не указан';
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  const distance = user.location && currentUserLocation
    ? calculateDistance(currentUserLocation.lat, currentUserLocation.lng, user.location.lat, user.location.lng)
    : null;

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.photos[0]} alt={user.displayName} />
            <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{user.displayName}</CardTitle>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          {user.age && <span>{user.age} лет</span>}
          <span>{getGenderText(user.gender)}</span>
          {distance !== null && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{distance} км</span>
            </div>
          )}
        </div>
        {compatibilityScore !== undefined && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <Heart className="w-4 h-4 text-red-500" />
            <CompatibilityScore score={compatibilityScore} />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio && (
          <div>
            <h4 className="font-semibold mb-2">О себе</h4>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
          </div>
        )}

        {user.interests.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Интересы</h4>
            <div className="flex flex-wrap gap-1">
              {user.interests.map(interest => (
                <Badge key={interest} variant="secondary" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.hobbies.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Хобби</h4>
            <div className="flex flex-wrap gap-1">
              {user.hobbies.map(hobby => (
                <Badge key={hobby} variant="outline" className="text-xs">
                  {hobby}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.games.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Игры</h4>
            <div className="flex flex-wrap gap-1">
              {user.games.map(game => (
                <Badge key={game} variant="outline" className="text-xs">
                  {game}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.photos.length > 1 && (
          <div>
            <h4 className="font-semibold mb-2">Фото ({user.photos.length})</h4>
            <div className="grid grid-cols-3 gap-2">
              {user.photos.slice(1, 4).map((photo, index) => (
                <Avatar key={index} className="w-16 h-16">
                  <AvatarImage src={photo} alt={`${user.displayName} ${index + 2}`} />
                  <AvatarFallback>{index + 2}</AvatarFallback>
                </Avatar>
              ))}
              {user.photos.length > 4 && (
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
                  +{user.photos.length - 4}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}