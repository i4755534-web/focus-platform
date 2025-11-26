'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useAISearch } from './useAISearch';
import { logger } from '@/lib/logger';

// Extend window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export interface VoiceCommand {
  keywords: string[];
  action: (transcript: string) => void;
  description: string;
}

export interface VoiceState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  isProcessing: boolean;
}

export const useVoiceCommands = () => {
  const { user } = useAuth();
  const { search } = useAISearch();
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    confidence: 0,
    error: null,
    isProcessing: false,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Voice commands
  const voiceCommands: VoiceCommand[] = [
    {
      keywords: ['поиск', 'найди', 'ищи', 'search', 'find'],
      action: async (transcript) => {
        const searchQuery = transcript.replace(/^(поиск|найди|ищи|search|find)\s*/i, '');
        if (searchQuery.trim()) {
          speak(`Ищу: ${searchQuery}`);
          await search(searchQuery);
          speak('Результаты поиска готовы');
        }
      },
      description: 'Поиск сообщений, файлов или пользователей',
    },
    {
      keywords: ['открой чат', 'открой канал', 'open chat', 'open channel'],
      action: (transcript) => {
        // Extract channel name from transcript
        const channelMatch = transcript.match(/(?:открой чат|открой канал|open chat|open channel)\s+(.+)/i);
        if (channelMatch) {
          const channelName = channelMatch[1].trim();
          speak(`Открываю чат: ${channelName}`);
          // Navigate to channel (would need router integration)
          window.location.href = `/chats/${channelName.toLowerCase().replace(/\s+/g, '-')}`;
        }
      },
      description: 'Открыть чат или канал',
    },
    {
      keywords: ['позвони', 'видеозвонок', 'call', 'video call'],
      action: (transcript) => {
        const userMatch = transcript.match(/(?:позвони|видеозвонок|call|video call)\s+(.+)/i);
        if (userMatch) {
          const userName = userMatch[1].trim();
          speak(`Звоню пользователю: ${userName}`);
          // Start call (would need call integration)
        }
      },
      description: 'Начать звонок пользователю',
    },
    {
      keywords: ['статус', 'мой статус', 'status'],
      action: () => {
        speak(`Ваш статус: ${user?.status || 'онлайн'}`);
      },
      description: 'Проверить текущий статус',
    },
    {
      keywords: ['помощь', 'help', 'что ты умеешь'],
      action: () => {
        const commands = voiceCommands.map(cmd => cmd.description).join(', ');
        speak(`Я могу помочь с: ${commands}`);
      },
      description: 'Показать доступные команды',
    },
    {
      keywords: ['останови', 'хватит', 'stop', 'enough'],
      action: () => {
        stopListening();
        speak('Голосовое управление отключено');
      },
      description: 'Остановить голосовое управление',
    },
  ];

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if (synthRef.current && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU'; // Russian language
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      synthRef.current.speak(utterance);
    }
  }, []);

  // Process voice command
  const processCommand = useCallback((transcript: string) => {
    setVoiceState(prev => ({ ...prev, isProcessing: true }));

    const lowerTranscript = transcript.toLowerCase();

    for (const command of voiceCommands) {
      const matched = command.keywords.some(keyword =>
        lowerTranscript.includes(keyword.toLowerCase())
      );

      if (matched) {
        try {
          command.action(transcript);
          logger.info('Voice command executed', { command: command.description, transcript });
          break;
        } catch (error) {
          logger.error('Voice command failed', error as Error, { command: command.description });
          speak('Произошла ошибка при выполнении команды');
        }
      }
    }

    setVoiceState(prev => ({ ...prev, isProcessing: false }));
  }, [voiceCommands, speak]);

  // Start listening
  const startListening = useCallback(() => {
    if (!voiceState.isSupported || voiceState.isListening) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ru-RU'; // Russian language
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true, error: null }));
        logger.info('Voice recognition started');
      };

      recognition.onresult = (event) => {
        const result = event.results[0];
        if (result.isFinal) {
          const transcript = result[0].transcript;
          const confidence = result[0].confidence;

          setVoiceState(prev => ({
            ...prev,
            transcript,
            confidence,
          }));

          processCommand(transcript);
        }
      };

      recognition.onerror = (event) => {
        const error = event.error;
        setVoiceState(prev => ({
          ...prev,
          error: `Ошибка распознавания: ${error}`,
          isListening: false,
        }));
        logger.error('Voice recognition error', new Error(error));
        speak('Произошла ошибка распознавания речи');
      };

      recognition.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }));
        logger.info('Voice recognition ended');
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      setVoiceState(prev => ({
        ...prev,
        error: 'Не удалось запустить распознавание речи',
        isListening: false,
      }));
      logger.error('Failed to start voice recognition', error as Error);
      speak('Не удалось запустить голосовое управление');
    }
  }, [voiceState.isSupported, voiceState.isListening, processCommand, speak]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop();
    }
  }, [voiceState.isListening]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (voiceState.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [voiceState.isListening, startListening, stopListening]);

  // Check browser support
  useEffect(() => {
    const isSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSpeechSynth = 'speechSynthesis' in window;

    setVoiceState(prev => ({
      ...prev,
      isSupported: isSupported && hasSpeechSynth,
    }));

    if (isSupported) {
      synthRef.current = window.speechSynthesis;
    }

    logger.info('Voice commands support checked', { isSupported, hasSpeechSynth });
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  return {
    voiceState,
    voiceCommands,
    startListening,
    stopListening,
    toggleListening,
    speak,
  };
};