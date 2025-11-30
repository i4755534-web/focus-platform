'use client';

import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useGroupCall } from '@/hooks/useGroupCall';
import CallControls from './CallControls';
import { CallParticipant } from '@/hooks/useWebRTC';

interface GroupCallProps {
  participants: string[];
  onEndCall: () => void;
}

export default function GroupCall({ participants, onEndCall }: GroupCallProps) {
  const {
    groupCallState,
    startGroupCall,
    endGroupCall,
    toggleMute,
    toggleVideo,
    getScreenShare,
    stopScreenShare,
    sendChatMessage,
    inviteParticipant,
  } = useGroupCall();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize call
  useEffect(() => {
    if (!groupCallState.isInCall && !groupCallState.isConnecting) {
      startGroupCall(participants, 'video').catch(console.error);
    }
  }, [groupCallState.isInCall, groupCallState.isConnecting, startGroupCall, participants]);

  // Set up local video
  useEffect(() => {
    if (localVideoRef.current && groupCallState.localStream) {
      localVideoRef.current.srcObject = groupCallState.localStream;
    }
  }, [groupCallState.localStream]);

  // Set up screen share video
  useEffect(() => {
    if (screenVideoRef.current && groupCallState.screenStream) {
      screenVideoRef.current.srcObject = groupCallState.screenStream;
    }
  }, [groupCallState.screenStream]);

  const handleEndCall = () => {
    endGroupCall();
    onEndCall();
  };

  const handleScreenShare = async () => {
    if (groupCallState.isScreenSharing) {
      stopScreenShare();
    } else {
      try {
        await getScreenShare();
      } catch (error) {
        console.error('Failed to start screen sharing:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Main video area */}
      <div className="flex-1 relative p-4">
        {groupCallState.isScreenSharing && groupCallState.screenStream ? (
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full h-full object-contain rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-6xl">👥</span>
              </div>
              <p className="text-xl">Групповой звонок</p>
              <p className="text-gray-400">
                {groupCallState.participants.length} участник{groupCallState.participants.length !== 1 ? 'ов' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Participants grid */}
        <div className="absolute top-4 left-4 right-4 bottom-4 grid gap-2"
             style={{
               gridTemplateColumns: `repeat(${Math.min(Math.ceil(Math.sqrt(groupCallState.participants.length + 1)), 4)}, 1fr)`,
               gridTemplateRows: `repeat(${Math.ceil((groupCallState.participants.length + 1) / Math.min(Math.ceil(Math.sqrt(groupCallState.participants.length + 1)), 4))}, 1fr)`
             }}>
          {/* Local participant */}
          {groupCallState.localStream && !groupCallState.isVideoOff && (
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gray-700 relative">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-white text-sm font-medium">Вы</span>
                </div>
              </div>
            </Card>
          )}

          {/* Remote participants */}
          {groupCallState.participants.map((participant) => (
            <ParticipantVideo key={participant.id} participant={participant} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <CallControls
        callState={groupCallState}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={handleScreenShare}
        onEndCall={handleEndCall}
        onSendChatMessage={sendChatMessage}
        onInviteParticipant={inviteParticipant}
        participants={groupCallState.participants}
      />
    </div>
  );
}

interface ParticipantVideoProps {
  participant: CallParticipant;
}

function ParticipantVideo({ participant }: ParticipantVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <Card className="bg-gray-800 border-gray-700 overflow-hidden">
      <div className="aspect-video bg-gray-700 relative">
        {participant.stream ? (
          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* Participant info */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <span className="text-white text-sm font-medium truncate">
            {participant.name}
          </span>
          <div className="flex space-x-1">
            {participant.isMuted && <span className="text-red-500">🔇</span>}
            {participant.isVideoOff && <span className="text-red-500">📷</span>}
          </div>
        </div>

        {/* Connection status */}
        {!participant.isConnected && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-sm">Подключение...</div>
          </div>
        )}
      </div>
    </Card>
  );
}