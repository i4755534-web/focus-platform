'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isConnected: boolean;
}

export interface CallState {
  isInCall: boolean;
  isConnecting: boolean;
  participants: CallParticipant[];
  localStream: MediaStream | null;
  callId: string | null;
  callType: 'audio' | 'video';
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  screenStream: MediaStream | null;
}

export const useWebRTC = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isConnecting: false,
    participants: [],
    localStream: null,
    callId: null,
    callType: 'video',
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    screenStream: null,
  });

  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // Get user media (camera/microphone)
  const getUserMedia = useCallback(async (constraints: MediaStreamConstraints) => {
    try {
      // Check if media devices are supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Media devices not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setCallState(prev => ({ ...prev, localStream: stream }));
      logger.info('User media obtained', { constraints });
      return stream;
    } catch (error) {
      logger.error('Failed to get user media', error as Error);
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          throw new Error('Camera/microphone access denied. Please allow access and try again.');
        } else if (error.name === 'NotFoundError') {
          throw new Error('No camera/microphone found. Please connect a device and try again.');
        } else if (error.name === 'NotReadableError') {
          throw new Error('Camera/microphone is already in use by another application.');
        }
      }
      throw error;
    }
  }, []);

  // Get screen sharing stream
  const getScreenShare = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      screenStreamRef.current = stream;
      setCallState(prev => ({ ...prev, screenStream: stream, isScreenSharing: true }));
      logger.info('Screen sharing started');
      return stream;
    } catch (error) {
      logger.error('Failed to get screen share', error as Error);
      throw error;
    }
  }, []);

  // Stop screen sharing
  const stopScreenShare = useCallback(() => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      setCallState(prev => ({ ...prev, screenStream: null, isScreenSharing: false }));
      logger.info('Screen sharing stopped');
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState(prev => ({ ...prev, isMuted: !audioTrack.enabled }));
        logger.info('Audio toggled', { enabled: audioTrack.enabled });
      }
    }
  }, []);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState(prev => ({ ...prev, isVideoOff: !videoTrack.enabled }));
        logger.info('Video toggled', { enabled: videoTrack.enabled });
      }
    }
  }, []);

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
          // Add TURN servers for production
        ],
      },
    });

    peer.on('signal', (data) => {
      socket?.emit('webrtc-signal', {
        to: userId,
        signal: data,
        callId: callState.callId,
      });
    });

    peer.on('stream', (remoteStream) => {
      setCallState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === userId ? { ...p, stream: remoteStream, isConnected: true } : p
        ),
      }));
      logger.info('Remote stream received', { userId });
    });

    peer.on('connect', () => {
      setCallState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === userId ? { ...p, isConnected: true } : p
        ),
      }));
      logger.info('Peer connected', { userId });
    });

    peer.on('close', () => {
      setCallState(prev => ({
        ...prev,
        participants: prev.participants.map(p =>
          p.id === userId ? { ...p, isConnected: false, stream: undefined } : p
        ),
      }));
      peersRef.current.delete(userId);
      logger.info('Peer disconnected', { userId });
    });

    peer.on('error', (error) => {
      logger.error('Peer error', error as Error, { userId });
    });

    return peer;
  }, [socket, callState.callId]);

  // Start call
  const startCall = useCallback(async (participants: string[], callType: 'audio' | 'video' = 'video') => {
    if (!user) return;

    try {
      setCallState(prev => ({ ...prev, isConnecting: true }));

      // Get user media
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === 'video',
      };
      await getUserMedia(constraints);

      const callId = `call_${Date.now()}_${user.id}`;

      // Initialize participants
      const callParticipants: CallParticipant[] = participants.map(pId => ({
        id: pId,
        name: `User ${pId}`, // In real app, get from user data
        isMuted: false,
        isVideoOff: false,
        isConnected: false,
      }));

      setCallState(prev => ({
        ...prev,
        isInCall: true,
        isConnecting: false,
        participants: callParticipants,
        callId,
        callType,
      }));

      // Notify other participants
      socket?.emit('call-started', {
        callId,
        participants: [user.id, ...participants],
        callType,
        initiator: user.id,
      });

      logger.info('Call started', { callId, participants: participants.length, callType });

    } catch (error) {
      setCallState(prev => ({ ...prev, isConnecting: false }));
      logger.error('Failed to start call', error as Error);
      throw error;
    }
  }, [user, socket, getUserMedia]);

  // Join call
  const joinCall = useCallback(async (callId: string, participants: string[]) => {
    if (!user) return;

    try {
      setCallState(prev => ({ ...prev, isConnecting: true }));

      // Get user media
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callState.callType === 'video',
      };
      await getUserMedia(constraints);

      // Initialize participants
      const callParticipants: CallParticipant[] = participants
        .filter(pId => pId !== user.id)
        .map(pId => ({
          id: pId,
          name: `User ${pId}`,
          isMuted: false,
          isVideoOff: false,
          isConnected: false,
        }));

      setCallState(prev => ({
        ...prev,
        isInCall: true,
        isConnecting: false,
        participants: callParticipants,
        callId,
      }));

      // Notify that we joined
      socket?.emit('call-joined', {
        callId,
        userId: user.id,
      });

      logger.info('Joined call', { callId });

    } catch (error) {
      setCallState(prev => ({ ...prev, isConnecting: false }));
      logger.error('Failed to join call', error as Error);
      throw error;
    }
  }, [user, socket, callState.callType, getUserMedia]);

  // End call
  const endCall = useCallback(() => {
    // Stop all streams
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    stopScreenShare();

    // Close all peer connections
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();

    setCallState({
      isInCall: false,
      isConnecting: false,
      participants: [],
      localStream: null,
      callId: null,
      callType: 'video',
      isMuted: false,
      isVideoOff: false,
      isScreenSharing: false,
      screenStream: null,
    });

    // Notify others
    socket?.emit('call-ended', {
      callId: callState.callId,
      userId: user?.id,
    });

    logger.info('Call ended', { callId: callState.callId });
  }, [socket, callState.callId, stopScreenShare, user?.id]);

  // Handle WebRTC signaling
  useEffect(() => {
    if (!socket) return;

    const handleWebRTCSignal = (data: { from: string; signal: any; callId: string }) => {
      const { from, signal, callId } = data;

      if (callId !== callState.callId) return;

      let peer = peersRef.current.get(from);

      if (!peer) {
        // Create peer for incoming signal
        peer = createPeer(from, false);
        peersRef.current.set(from, peer);
      }

      peer.signal(signal);
    };

    const handleCallStarted = (data: { callId: string; participants: string[]; callType: string }) => {
      // Handle incoming call
      logger.info('Incoming call', data);
    };

    const handleCallEnded = (data: { callId: string; userId: string }) => {
      if (data.callId === callState.callId && data.userId !== user?.id) {
        // Someone else ended the call
        endCall();
      }
    };

    socket.on('webrtc-signal', handleWebRTCSignal);
    socket.on('call-started', handleCallStarted);
    socket.on('call-ended', handleCallEnded);

    return () => {
      socket.off('webrtc-signal', handleWebRTCSignal);
      socket.off('call-started', handleCallStarted);
      socket.off('call-ended', handleCallEnded);
    };
  }, [socket, callState.callId, createPeer, endCall, user?.id]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    callState,
    startCall,
    joinCall,
    endCall,
    toggleMute,
    toggleVideo,
    getScreenShare,
    stopScreenShare,
  };
};