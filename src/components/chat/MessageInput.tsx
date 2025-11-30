'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import DOMPurify from 'dompurify';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onTyping?: (isTyping: boolean) => void;
  replyTo?: { id: string; text: string; sender: string } | null;
  onCancelReply?: () => void;
}

export default function MessageInput({ onSendMessage, onTyping, replyTo, onCancelReply }: MessageInputProps) {
  const [text, setText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const { isListening, transcript, isSupported, startListening, stopListening } = useSpeechRecognition();

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

  // Update text when transcript changes
  useEffect(() => {
    if (transcript) {
      setText(transcript);
    }
  }, [transcript]);

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
        <Button
          type="button"
          onClick={isListening ? stopListening : startListening}
          className={`mr-2 ${isListening ? 'bg-red-500' : ''}`}
          disabled={!isSupported}
        >
          {isListening ? '⏹️' : '🎤'}
        </Button>
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