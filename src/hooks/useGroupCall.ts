'use client';

import { useState, useCallback, useEffect } from 'react';
import { useWebRTC, CallParticipant } from './useWebRTC';
import { useStatus } from './useStatus';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
}

export interface GroupCallState {
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
  chatMessages: ChatMessage[];
  maxParticipants: number;
}

export const useGroupCall = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const { setStatus } = useStatus();
  const {
    callState: webRTCState,
    startCall: startWebRTCCall,
    joinCall: joinWebRTCCall,
    endCall: endWebRTCCall,
    toggleMute,
    toggleVideo,
    getScreenShare,
    stopScreenShare,
  } = useWebRTC();

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const maxParticipants = 10;

  const groupCallState: GroupCallState = {
    ...webRTCState,
    chatMessages,
    maxParticipants,
  };

  // Send chat message
  const sendChatMessage = useCallback((message: string) => {
    if (!user || !groupCallState.callId || !message.trim()) return;

    const chatMessage: ChatMessage = {
      id: `msg_${Date.now()}_${user.id}`,
      senderId: user.id,
      senderName: user.nickname || 'User',
      message: message.trim(),
      timestamp: new Date(),
    };

    setChatMessages(prev => [...prev, chatMessage]);

    // Send to other participants via socket
    socket?.emit('group-call-chat', {
      callId: groupCallState.callId,
      message: chatMessage,
    });

    logger.info('Chat message sent', { callId: groupCallState.callId, messageId: chatMessage.id });
  }, [user, groupCallState.callId, socket]);

  // Invite participant
  const inviteParticipant = useCallback((userId: string) => {
    if (!groupCallState.callId || groupCallState.participants.length >= maxParticipants) return;

    socket?.emit('group-call-invite', {
      callId: groupCallState.callId,
      inviteeId: userId,
      inviterId: user?.id,
    });

    logger.info('Participant invited', { callId: groupCallState.callId, inviteeId: userId });
  }, [groupCallState.callId, groupCallState.participants.length, maxParticipants, socket, user?.id]);

  // Start group call
  const startGroupCall = useCallback(async (participants: string[], callType: 'audio' | 'video' = 'video') => {
    if (participants.length > maxParticipants - 1) { // -1 for self
      throw new Error(`Maximum ${maxParticipants} participants allowed`);
    }

    // Set status to busy
    setStatus('busy');

    await startWebRTCCall(participants, callType);

    logger.info('Group call started', { participants: participants.length, callType });
  }, [startWebRTCCall, setStatus, maxParticipants]);

  // Join group call
  const joinGroupCall = useCallback(async (callId: string, participants: string[]) => {
    if (participants.length > maxParticipants) {
      throw new Error(`Maximum ${maxParticipants} participants allowed`);
    }

    // Set status to busy
    setStatus('busy');

    await joinWebRTCCall(callId, participants);

    logger.info('Joined group call', { callId, participants: participants.length });
  }, [joinWebRTCCall, setStatus, maxParticipants]);

  // End group call
  const endGroupCall = useCallback(() => {
    endWebRTCCall();

    // Reset status
    setStatus('online');

    // Clear chat
    setChatMessages([]);

    logger.info('Group call ended', { callId: groupCallState.callId });
  }, [endWebRTCCall, setStatus, groupCallState.callId]);

  // Handle incoming chat messages
  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (data: { callId: string; message: ChatMessage }) => {
      if (data.callId === groupCallState.callId) {
        setChatMessages(prev => [...prev, data.message]);
      }
    };

    const handleCallInvite = (data: { callId: string; inviteeId: string; inviterId: string }) => {
      // Handle invite - could show notification
      logger.info('Received call invite', data);
    };

    socket.on('group-call-chat', handleChatMessage);
    socket.on('group-call-invite', handleCallInvite);

    return () => {
      socket.off('group-call-chat', handleChatMessage);
      socket.off('group-call-invite', handleCallInvite);
    };
  }, [socket, groupCallState.callId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (groupCallState.isInCall) {
        endGroupCall();
      }
    };
  }, [groupCallState.isInCall, endGroupCall]);

  return {
    groupCallState,
    startGroupCall,
    joinGroupCall,
    endGroupCall,
    toggleMute,
    toggleVideo,
    getScreenShare,
    stopScreenShare,
    sendChatMessage,
    inviteParticipant,
  };
};