'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import VideoCall from '@/components/calls/VideoCall';
import { useAuth } from '@/hooks/useAuth';
import { Video, Phone, Users, Clock } from 'lucide-react';

interface CallHistory {
  id: string;
  participants: string[];
  type: 'audio' | 'video';
  duration: number;
  timestamp: Date;
  status: 'completed' | 'missed' | 'cancelled';
}

export default function CallsPage() {
  const { user } = useAuth();
  const [isInCall, setIsInCall] = useState(false);
  const [callParticipants, setCallParticipants] = useState<string[]>([]);
  const [callType, setCallType] = useState<'audio' | 'video'>('video');
  const [participantInput, setParticipantInput] = useState('');

  // Mock call history
  const callHistory: CallHistory[] = [
    {
      id: '1',
      participants: ['user1', 'user2'],
      type: 'video',
      duration: 1800, // 30 minutes
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      status: 'completed',
    },
    {
      id: '2',
      participants: ['user1', 'user3'],
      type: 'audio',
      duration: 900, // 15 minutes
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      status: 'completed',
    },
  ];

  const startCall = (participants: string[], type: 'audio' | 'video') => {
    setCallParticipants(participants);
    setCallType(type);
    setIsInCall(true);
  };

  const endCall = () => {
    setIsInCall(false);
    setCallParticipants([]);
  };

  const addParticipant = () => {
    if (participantInput.trim() && !callParticipants.includes(participantInput.trim())) {
      setCallParticipants([...callParticipants, participantInput.trim()]);
      setParticipantInput('');
    }
  };

  const removeParticipant = (participant: string) => {
    setCallParticipants(callParticipants.filter(p => p !== participant));
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дней назад`;
    return date.toLocaleDateString();
  };

  if (isInCall) {
    return <VideoCall participants={callParticipants} onEndCall={endCall} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Звонки</h2>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Начать видеозвонок
            </CardTitle>
            <CardDescription>
              Создайте видеоконференцию с участниками
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="participants">Участники</Label>
              <div className="flex gap-2">
                <Input
                  id="participants"
                  placeholder="Введите ID пользователя"
                  value={participantInput}
                  onChange={(e) => setParticipantInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                />
                <Button onClick={addParticipant} variant="outline">
                  Добавить
                </Button>
              </div>
            </div>

            {callParticipants.length > 0 && (
              <div className="space-y-2">
                <Label>Выбранные участники:</Label>
                <div className="flex flex-wrap gap-2">
                  {callParticipants.map((participant) => (
                    <Badge
                      key={participant}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeParticipant(participant)}
                    >
                      {participant} ×
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => startCall(callParticipants, 'video')}
              disabled={callParticipants.length === 0}
              className="w-full"
            >
              <Video className="w-4 h-4 mr-2" />
              Начать видеозвонок
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Аудиозвонок
            </CardTitle>
            <CardDescription>
              Быстрый голосовой звонок
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audio-participants">Участник</Label>
              <Input
                id="audio-participants"
                placeholder="Введите ID пользователя"
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
              />
            </div>

            <Button
              onClick={() => startCall([participantInput], 'audio')}
              disabled={!participantInput.trim()}
              variant="outline"
              className="w-full"
            >
              <Phone className="w-4 h-4 mr-2" />
              Позвонить
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            История звонков
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {callHistory.map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => startCall(call.participants, call.type)}
              >
                <div className="flex items-center gap-3">
                  {call.type === 'video' ? (
                    <Video className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Phone className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">
                      Звонок с {call.participants.filter(p => p !== user?.id).join(', ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatTimestamp(call.timestamp)} • {formatDuration(call.duration)}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    call.status === 'completed' ? 'default' :
                    call.status === 'missed' ? 'destructive' : 'secondary'
                  }
                >
                  {call.status === 'completed' ? 'Завершен' :
                   call.status === 'missed' ? 'Пропущен' : 'Отменен'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}