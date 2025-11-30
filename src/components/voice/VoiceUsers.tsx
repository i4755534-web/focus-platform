'use client';

import { Mic, MicOff, VolumeX, MoreVertical, UserMinus, Mic as MuteIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { VoiceParticipant } from '@/hooks/useVoiceChannel';
import { Role } from '@/lib/roles';

interface VoiceUsersProps {
  participants: VoiceParticipant[];
  onMuteUser: (userId: string) => void;
  onKickUser: (userId: string) => void;
}

export function VoiceUsers({ participants, onMuteUser, onKickUser }: VoiceUsersProps) {
  const getRoleColor = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'bg-red-500';
      case Role.MODERATOR:
        return 'bg-blue-500';
      case Role.MEMBER:
        return 'bg-green-500';
      case Role.GUEST:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleName = (role: Role) => {
    switch (role) {
      case Role.ADMIN:
        return 'Админ';
      case Role.MODERATOR:
        return 'Модератор';
      case Role.MEMBER:
        return 'Участник';
      case Role.GUEST:
        return 'Гость';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-gray-700">Участники ({participants.length})</h4>

      <div className="space-y-1">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>
                    {participant.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Speaking indicator */}
                {participant.isSpeaking && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                )}

                {/* Connection status */}
                {!participant.isConnected && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  </div>
                )}
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm truncate">
                    {participant.name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-xs px-1.5 py-0.5 ${getRoleColor(participant.role)} text-white`}
                  >
                    {getRoleName(participant.role)}
                  </Badge>
                </div>

                {/* Status indicators */}
                <div className="flex items-center space-x-2 mt-1">
                  {participant.isMuted && (
                    <div className="flex items-center space-x-1 text-red-500">
                      <MicOff className="w-3 h-3" />
                      <span className="text-xs">Заглушен</span>
                    </div>
                  )}
                  {participant.isDeafened && (
                    <div className="flex items-center space-x-1 text-orange-500">
                      <VolumeX className="w-3 h-3" />
                      <span className="text-xs">Оглушен</span>
                    </div>
                  )}
                  {!participant.isConnected && (
                    <span className="text-xs text-gray-500">Подключение...</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onMuteUser(participant.id)}>
                  <MuteIcon className="w-4 h-4 mr-2" />
                  {participant.isMuted ? 'Разглушить' : 'Заглушить'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onKickUser(participant.id)}
                  className="text-red-600"
                >
                  <UserMinus className="w-4 h-4 mr-2" />
                  Выгнать
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {participants.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-sm">В канале пока никого нет</div>
        </div>
      )}
    </div>
  );
}