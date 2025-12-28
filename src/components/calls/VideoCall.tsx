'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
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
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);

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
    <motion.div
      className="fixed inset-0 bg-black z-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Main video area */}
      <div className="flex-1 relative overflow-hidden">
        {callState.isScreenSharing && callState.screenStream ? (
          <motion.video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full h-full object-contain"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <motion.div
            className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            <motion.div
              className="text-white text-center z-10"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-2xl"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(168, 85, 247, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Video className="w-16 h-16" />
              </motion.div>
              <motion.p
                className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Видеозвонок
              </motion.p>
              <p className="text-gray-300">
                {callState.participants.length} участник{callState.participants.length !== 1 ? 'ов' : ''}
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Local video (picture-in-picture) */}
        {callState.localStream && !callState.isVideoOff && (
          <motion.div
            className="absolute top-4 right-4 w-48 h-36 bg-black/80 backdrop-blur-md rounded-lg overflow-hidden border-2 border-purple-400 shadow-2xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            whileHover={{ scale: 1.05 }}
            style={{
              boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
            }}
          >
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Participants grid */}
        <motion.div
          className="absolute bottom-24 left-4 right-4 grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {callState.participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ scale: 0, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              transition={{
                delay: 0.1 * index,
                type: "spring",
                stiffness: 200
              }}
            >
              <ParticipantVideo participant={participant} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Controls */}
      <motion.div
        className="bg-black/80 backdrop-blur-lg p-4 flex justify-center items-center space-x-4 border-t border-purple-500/20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
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
      </motion.div>
    </motion.div>
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