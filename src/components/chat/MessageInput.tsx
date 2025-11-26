'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import DOMPurify from 'dompurify';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
  replyTo?: { id: string; text: string; sender: string } | null;
  onCancelReply?: () => void;
}

export default function MessageInput({ onSendMessage, onTyping, replyTo, onCancelReply }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (onTyping) {
      onTyping(e.target.value.length > 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const sanitizedText = DOMPurify.sanitize(text);
      if (sanitizedText.startsWith('/')) {
        handleCommand(sanitizedText);
      } else {
        onSendMessage(sanitizedText);
      }
      setText('');
      if (onTyping) {
        onTyping(false);
      }
    }
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.slice(1).split(' ');
    switch (cmd) {
      case 'help':
        alert('Доступные команды:\n/help - показать помощь\n/me <действие> - действие');
        break;
      case 'me':
        onSendMessage(`*${args.join(' ')}*`);
        break;
      default:
        alert('Неизвестная команда');
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setText(prev => prev + emojiObject.emoji);
    setShowPicker(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('Voice message recorded:', audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="border-t">
      {replyTo && (
        <div className="p-2 bg-gray-100 flex items-center justify-between">
          <div className="text-sm">
            Reply to: {replyTo.text}
          </div>
          <Button variant="ghost" size="sm" onClick={onCancelReply}>✕</Button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="p-4 flex">
        <Input value={text} onChange={handleChange} placeholder="Введите сообщение..." className="flex-1 mr-2" />
        <Button type="button" onClick={() => setShowPicker(!showPicker)} className="mr-2">😀</Button>
        <Button type="button" onClick={() => onSendMessage('🎤 Голосовое сообщение')} className="mr-2">🎤</Button>
        <Button type="submit">Отправить</Button>
      </form>
      {showPicker && (
        <div className="absolute bottom-full right-0 mb-2">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
}