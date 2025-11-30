'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { useRoles } from './useRoles';
import { logger } from '@/lib/logger';
import { Role } from '@/lib/roles';

export interface VoiceParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: Role;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  isConnected: boolean;
  volume: number; // 0-1
  stream?: MediaStream;
}

export interface VoiceChannelState {
  isInChannel: boolean;
  isConnecting: boolean;
  participants: VoiceParticipant[];
  localStream: MediaStream | null;
  channelId: string | null;
  channelName: string;
  isMuted: boolean;
  isDeafened: boolean;
  isSpeaking: boolean;
  volume: number;
  noiseSuppression: boolean;
  echoCancellation: boolean;
}

export const useVoiceChannel = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { canMuteSpecificUser, canKickSpecificUser } = useRoles();
  const [channelState, setChannelState] = useState<VoiceChannelState>({
    isInChannel: false,
    isConnecting: false,
    participants: [],
    localStream: null,
    channelId: null,
    channelName: '',
    isMuted: false,
    isDeafened: false,
    isSpeaking: false,
    volume: 1.0,
    noiseSuppression: true,
    echoCancellation: true,
  });

  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get user media (audio only)
  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints) => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      // Set up audio analysis for speaking detection
      setupAudioAnalysis(stream);

      setChannelState(prev => ({ ...prev, localStream: stream }));
      logger.info('Voice media obtained', { constraints });
      return stream;
    } catch (error) {
      logger.error('Failed to get voice media', error as Error);
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Microphone access denied. Please allow access and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No microphone found. Please connect a microphone and try again.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Microphone is already in use by another application.');
        }
      }
      throw error;
    }
  }, []);

  // Set up audio analysis for speaking detection
  const setupAudioAnalysis = useCallback((stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      const microphone = audioContextRef.current.createMediaStreamSource(stream);
      microphone.connect(analyserRef.current);

      // Start monitoring speaking
      monitorSpeaking();
    } catch (error) {
      logger.error('Failed to setup audio analysis', error as Error);
    }
  }, []);

  // Monitor speaking activity
  const monitorSpeaking = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkSpeaking = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      const isSpeaking = average > 10 && !channelState.isMuted && !channelState.isDeafened;

      if (isSpeaking !== channelState.isSpeaking) {
        setChannelState(prev => ({ ...prev, isSpeaking }));

        // Notify other participants
        if (socket && channelState.channelId) {
          socket.emit('voice-speaking', {
            channelId: channelState.channelId,
            userId: user?.id,
            isSpeaking,
          });
        }
      }

      requestAnimationFrame(checkSpeaking);
    };

    checkSpeaking();
  }, [channelState.isSpeaking, channelState.isMuted, channelState.isDeafened, channelState.channelId, socket, user?.id]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setChannelState(prev => ({ ...prev, isMuted: !audioTrack.enabled }));

        // Notify other participants
        if (socket && channelState.channelId) {
          socket.emit('voice-mute-changed', {
            channelId: channelState.channelId,
            userId: user?.id,
            isMuted: !audioTrack.enabled,
          });
        }

        logger.info('Voice mute toggled', { enabled: audioTrack.enabled });
      }
    }
  }, [channelState.channelId, socket, user?.id]);

  // Toggle deafen
  const toggleDeafen = useCallback(() => {
    setChannelState(prev => {
      const newIsDeafened = !prev.isDeafened;

      // When deafened, mute all remote audio
      peersRef.current.forEach(peer => {
        const stream = peer.streams?.[0];
        if (stream) {
          stream.getAudioTracks().forEach(track => {
            track.enabled = !newIsDeafened;
          });
        }
      });

      // Notify other participants
      if (socket && prev.channelId) {
        socket.emit('voice-deafen-changed', {
          channelId: prev.channelId,
          userId: user?.id,
          isDeafened: newIsDeafened,
        });
      }

      return { ...prev, isDeafened: newIsDeafened };
    });
  }, [socket, user?.id]);

  // Set volume
  const setVolume = useCallback((volume: number) => {
    setChannelState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));

    // Apply volume to all remote streams
    peersRef.current.forEach(peer => {
      const stream = peer.streams?.[0];
      if (stream) {
        stream.getAudioTracks().forEach(track => {
          // Note: Volume control would need additional audio processing
          // This is a simplified implementation
        });
      }
    });
  }, []);

  // Mute specific user (moderator action)
  const muteUser = useCallback((userId: string) => {
    const participant = channelState.participants.find(p => p.id === userId);
    if (!participant || !canMuteSpecificUser(participant.role)) return;

    setChannelState(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.id === userId ? { ...p, isMuted: true } : p
      ),
    }));

    // Notify the user and channel
    if (socket && channelState.channelId) {
      socket.emit('voice-user-muted', {
        channelId: channelState.channelId,
        targetUserId: userId,
        mutedBy: user?.id,
      });
    }
  }, [channelState.participants, channelState.channelId, socket, user?.id, canMuteSpecificUser]);

  // Kick user from channel (moderator action)
  const kickUser = useCallback((userId: string) => {
    const participant = channelState.participants.find(p => p.id === userId);
    if (!participant || !canKickSpecificUser(participant.role)) return;

    // Remove peer connection
    const peer = peersRef.current.get(userId);
    if (peer) {
      peer.destroy();
      peersRef.current.delete(userId);
    }

    setChannelState(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.id !== userId),
    }));

    // Notify the user and channel
    if (socket && channelState.channelId) {
      socket.emit('voice-user-kicked', {
        channelId: channelState.channelId,
        targetUserId: userId,
        kickedBy: user?.id,
      });
    }
  }, [channelState.participants, channelState.channelId, socket, user?.id, canKickSpecificUser]);

  // Create peer connection
  const createPeer = useCallback((userId: string, initiator: boolean, stream?: MediaStream) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: stream || localStreamRef.current || undefined,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      },
    });

    peer.on('signal', (data) => {
      socket?.emit('voice-webrtc-signal', {
        to: userId,
        signal: data,
        channelId: channelState.channelId,
      });
    });

    peer.on('stream', (remoteStream) => {
      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === userId ? { ...p, stream: remoteStream, isConnected: true } : p
        ),
      }));
      logger.info('Voice remote stream received', { userId });
    });

    peer.on('connect', () => {
      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === userId ? { ...p, isConnected: true } : p
        ),
      }));
      logger.info('Voice peer connected', { userId });
    });

    peer.on('close', () => {
      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === userId ? { ...p, isConnected: false, stream: undefined } : p
        ),
      }));
      peersRef.current.delete(userId);
      logger.info('Voice peer disconnected', { userId });
    });

    peer.on('error', (error) => {
      logger.error('Voice peer error', error as Error, { userId });
    });

    return peer;
  }, [socket, channelState.channelId]);

  // Join voice channel
  const joinChannel = useCallback(async (channelId: string, channelName: string, participants: VoiceParticipant[]) => {
    if (!user) return;

    try {
      setChannelState(prev => ({ ...prev, isConnecting: true }));

      // Get user media (audio only)
      const constraints: MediaStreamConstraints = {
        audio: {
          noiseSuppression: channelState.noiseSuppression,
          echoCancellation: channelState.echoCancellation,
        },
      };
      await getUserMedia(constraints);

      // Initialize participants
      const channelParticipants: VoiceParticipant[] = participants
        .filter(p => p.id !== user.id)
        .map(p => ({
          ...p,
          isConnected: false,
        }));

      setChannelState(prev => ({
        ...prev,
        isInChannel: true,
        isConnecting: false,
        participants: channelParticipants,
        channelId,
        channelName,
      }));

      // Notify other participants
      socket?.emit('voice-channel-joined', {
        channelId,
        userId: user.id,
        userName: user.nickname,
        userRole: user.role as Role,
      });

      logger.info('Joined voice channel', { channelId, channelName });

    } catch (error) {
      setChannelState(prev => ({ ...prev, isConnecting: false }));
      logger.error('Failed to join voice channel', error as Error);
      throw error;
    }
  }, [user, socket, channelState.noiseSuppression, channelState.echoCancellation, getUserMedia]);

  // Leave voice channel
  const leaveChannel = useCallback(() => {
    // Stop all streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close all peer connections
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setChannelState({
      isInChannel: false,
      isConnecting: false,
      participants: [],
      localStream: null,
      channelId: null,
      channelName: '',
      isMuted: false,
      isDeafened: false,
      isSpeaking: false,
      volume: 1.0,
      noiseSuppression: true,
      echoCancellation: true,
    });

    // Notify others
    socket?.emit('voice-channel-left', {
      channelId: channelState.channelId,
      userId: user?.id,
    });

    logger.info('Left voice channel', { channelId: channelState.channelId });
  }, [socket, channelState.channelId, user?.id]);

  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleVoiceWebRTCSignal = (data: { from: string; signal: any; channelId: string }) => {
      const { from, signal, channelId } = data;

      if (channelId !== channelState.channelId) return;

      let peer = peersRef.current.get(from);

      if (!peer) {
        peer = createPeer(from, false);
        peersRef.current.set(from, peer);
      }

      peer.signal(signal);
    };

    const handleVoiceChannelJoined = (data: { channelId: string; userId: string; userName: string; userRole: Role }) => {
      if (data.channelId !== channelState.channelId) return;

      setChannelState(prev => ({
        ...prev,
        participants: [...prev.participants, {
          id: data.userId,
          name: data.userName,
          role: data.userRole,
          isMuted: false,
          isDeafened: false,
          isSpeaking: false,
          isConnected: false,
          volume: 1.0,
        }],
      }));
    };

    const handleVoiceChannelLeft = (data: { channelId: string; userId: string }) => {
      if (data.channelId !== channelState.channelId) return;

      const peer = peersRef.current.get(data.userId);
      if (peer) {
        peer.destroy();
        peersRef.current.delete(data.userId);
      }

      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.filter(p => p.id !== data.userId),
      }));
    };

    const handleVoiceMuteChanged = (data: { channelId: string; userId: string; isMuted: boolean }) => {
      if (data.channelId !== channelState.channelId) return;

      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === data.userId ? { ...p, isMuted: data.isMuted } : p
        ),
      }));
    };

    const handleVoiceDeafenChanged = (data: { channelId: string; userId: string; isDeafened: boolean }) => {
      if (data.channelId !== channelState.channelId) return;

      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === data.userId ? { ...p, isDeafened: data.isDeafened } : p
        ),
      }));
    };

    const handleVoiceSpeaking = (data: { channelId: string; userId: string; isSpeaking: boolean }) => {
      if (data.channelId !== channelState.channelId) return;

      setChannelState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === data.userId ? { ...p, isSpeaking: data.isSpeaking } : p
        ),
      }));
    };

    socket.on('voice-webrtc-signal', handleVoiceWebRTCSignal);
    socket.on('voice-channel-joined', handleVoiceChannelJoined);
    socket.on('voice-channel-left', handleVoiceChannelLeft);
    socket.on('voice-mute-changed', handleVoiceMuteChanged);
    socket.on('voice-deafen-changed', handleVoiceDeafenChanged);
    socket.on('voice-speaking', handleVoiceSpeaking);

    return () => {
      socket.off('voice-webrtc-signal', handleVoiceWebRTCSignal);
      socket.off('voice-channel-joined', handleVoiceChannelJoined);
      socket.off('voice-channel-left', handleVoiceChannelLeft);
      socket.off('voice-mute-changed', handleVoiceMuteChanged);
      socket.off('voice-deafen-changed', handleVoiceDeafenChanged);
      socket.off('voice-speaking', handleVoiceSpeaking);
    };
  }, [socket, channelState.channelId, createPeer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveChannel();
    };
  }, [leaveChannel]);

  return {
    channelState,
    joinChannel,
    leaveChannel,
    toggleMute,
    toggleDeafen,
    setVolume,
    muteUser,
    kickUser,
  };
};