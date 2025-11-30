'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, PhoneOff } from 'lucide-react';
import { useVoiceChannel, VoiceParticipant } from '@/hooks/useVoiceChannel';
import { VoiceControls } from './VoiceControls';
import { VoiceUsers } from './VoiceUsers';

interface VoiceChannelProps {
  channelId: string;
  channelName: string;
  participants: VoiceParticipant[];
  onLeaveChannel: () => void;
}

export default function VoiceChannel({
  channelId,
  channelName,
  participants,
  onLeaveChannel
}: VoiceChannelProps) {
  const {
    channelState,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleDeafen,
    setVolume,
    muteUser,
    kickUser,
  } = useVoiceChannel();

  // Auto-join channel when component mounts
  useEffect(() => {
    if (!channelState.isInChannel && !channelState.isConnecting) {
      joinChannel(channelId, channelName, participants);
    }
  }, [channelState.isInChannel, channelState.isConnecting, joinChannel, channelId, channelName, participants]);

  const handleLeaveChannel = () => {
    leaveChannel();
    onLeaveChannel();
  };

  if (channelState.isConnecting) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Подключение к голосовому каналу...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full max-h-96">
      {/* Channel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{channelName}</h3>
            <p className="text-sm text-gray-500">
              {channelState.participants.length + 1} участник{channelState.participants.length + 1 !== 1 ? 'ов' : ''}
            </p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLeaveChannel}
            className="flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" />
            Покинуть
          </Button>
        </div>
      </div>

      {/* Voice Controls */}
      <div className="p-4 border-b border-gray-200">
        <VoiceControls
          isMuted={channelState.isMuted}
          isDeafened={channelState.isDeafened}
          volume={channelState.volume}
          onToggleMute={toggleMute}
          onToggleDeafen={toggleDeafen}
          onVolumeChange={setVolume}
        />
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4">
        <VoiceUsers
          participants={channelState.participants}
          onMuteUser={muteUser}
          onKickUser={kickUser}
        />
      </div>

      {/* Connection Status */}
      {!channelState.isInChannel && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <Phone className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Не подключено к голосовому каналу</p>
          </div>
        </div>
      )}
    </Card>
  );
}