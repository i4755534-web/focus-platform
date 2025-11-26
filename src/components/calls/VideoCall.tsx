'use client';

import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWebRTC, CallParticipant } from '@/hooks/useWebRTC';
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, MonitorOff } from 'lucide-react';

interface VideoCallProps {
  participants: string[];
  onEndCall: () => void;
}

export default function VideoCall({ participants, onEndCall }: VideoCallProps) {
  const {
    callState,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    getScreenShare,
    stopScreenShare,
  } = useWebRTC();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize call
  useEffect(() => {
    if (!callState.isInCall && !callState.isConnecting) {
      startCall(participants, 'video');
    }
  }, [callState.isInCall, callState.isConnecting, startCall, participants]);

  // Set up local video
  useEffect(() => {
    if (localVideoRef.current && callState.localStream) {
      localVideoRef.current.srcObject = callState.localStream;
    }
  }, [callState.localStream]);

  // Set up screen share video
  useEffect(() => {
    if (screenVideoRef.current && callState.screenStream) {
      screenVideoRef.current.srcObject = callState.screenStream;
    }
  }, [callState.screenStream]);

  const handleEndCall = () => {
    endCall();
    onEndCall();
  };

  const handleScreenShare = async () => {
    if (callState.isScreenSharing) {
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
      <div className="flex-1 relative">
        {callState.isScreenSharing && callState.screenStream ? (
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Video className="w-16 h-16" />
              </div>
              <p className="text-xl">Видеозвонок</p>
              <p className="text-gray-400">
                {callState.participants.length} участник{callState.participants.length !== 1 ? 'ов' : ''}
              </p>
            </div>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        {callState.localStream && !callState.isVideoOff && (
          <div className="absolute top-4 right-4 w-48 h-36 bg-black rounded-lg overflow-hidden border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Participants grid */}
        <div className="absolute bottom-24 left-4 right-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {callState.participants.map((participant) => (
            <ParticipantVideo key={participant.id} participant={participant} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 flex justify-center items-center space-x-4">
        <Button
          variant={callState.isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleMute}
          className="rounded-full w-12 h-12 p-0"
        >
          {callState.isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </Button>

        <Button
          variant={callState.isVideoOff ? "destructive" : "secondary"}
          size="lg"
          onClick={toggleVideo}
          className="rounded-full w-12 h-12 p-0"
        >
          {callState.isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
        </Button>

        <Button
          variant={callState.isScreenSharing ? "default" : "secondary"}
          size="lg"
          onClick={handleScreenShare}
          className="rounded-full w-12 h-12 p-0"
        >
          {callState.isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
        </Button>

        <Button
          variant="destructive"
          size="lg"
          onClick={handleEndCall}
          className="rounded-full w-12 h-12 p-0"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
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
            {participant.isMuted && <MicOff className="w-4 h-4 text-red-500" />}
            {participant.isVideoOff && <VideoOff className="w-4 h-4 text-red-500" />}
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