'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, MonitorOff, Users, MessageSquare, UserPlus } from 'lucide-react';
import { GroupCallState, ChatMessage } from '@/hooks/useGroupCall';
import { CallParticipant } from '@/hooks/useWebRTC';

interface CallControlsProps {
  callState: GroupCallState;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onEndCall: () => void;
  onSendChatMessage: (message: string) => void;
  onInviteParticipant: (userId: string) => void;
  participants: CallParticipant[];
}

export default function CallControls({
  callState,
  onToggleMute,
  onToggleVideo,
  onToggleScreenShare,
  onEndCall,
  onSendChatMessage,
  onInviteParticipant,
  participants,
}: CallControlsProps) {
  const [chatInput, setChatInput] = React.useState('');
  const [showParticipants, setShowParticipants] = React.useState(false);
  const [showChat, setShowChat] = React.useState(false);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      onSendChatMessage(chatInput.trim());
      setChatInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-gray-900 p-4 flex flex-col space-y-4">
      {/* Main controls */}
      <div className="flex justify-center items-center space-x-4">
        <Button
          variant={callState.isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleMute}
          className="rounded-full w-12 h-12 p-0"
        >
          {callState.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        <Button
          variant={callState.isVideoOff ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleVideo}
          className="rounded-full w-12 h-12 p-0"
        >
          {callState.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </Button>

        <Button
          variant={callState.isScreenSharing ? "default" : "secondary"}
          size="lg"
          onClick={onToggleScreenShare}
          className="rounded-full w-12 h-12 p-0"
        >
          {callState.isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setShowParticipants(!showParticipants)}
          className="rounded-full w-12 h-12 p-0"
        >
          <Users className="w-6 h-6" />
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={() => setShowChat(!showChat)}
          className="rounded-full w-12 h-12 p-0"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={onEndCall}
          className="rounded-full w-12 h-12 p-0"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>

      {/* Participants and Chat panels */}
      <div className="flex space-x-4">
        {/* Participants panel */}
        {showParticipants && (
          <Card className="flex-1 bg-gray-800 border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Участники ({participants.length})</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            <ScrollArea className="h-48">
              <div className="space-y-2">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {participant.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white text-sm">{participant.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      {participant.isMuted && <MicOff className="w-4 h-4 text-red-500" />}
                      {participant.isVideoOff && <VideoOff className="w-4 h-4 text-red-500" />}
                      {!participant.isConnected && <Badge variant="destructive" className="text-xs">Подключение...</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onInviteParticipant('')} // Would need user selection
                className="w-full"
                disabled={participants.length >= callState.maxParticipants}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Пригласить
              </Button>
            </div>
          </Card>
        )}

        {/* Chat panel */}
        {showChat && (
          <Card className="flex-1 bg-gray-800 border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Чат</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
            <ScrollArea className="h-48 mb-4">
              <div className="space-y-2">
                {callState.chatMessages.map((message) => (
                  <div key={message.id} className="p-2 bg-gray-700 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-blue-400 text-sm font-medium">{message.senderName}</span>
                      <span className="text-gray-400 text-xs">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-white text-sm">{message.message}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="flex space-x-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Введите сообщение..."
                className="flex-1 bg-gray-700 border-gray-600 text-white"
              />
              <Button onClick={handleSendMessage} disabled={!chatInput.trim()}>
                Отправить
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}