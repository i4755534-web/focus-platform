'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { useSwipe } from '@/hooks/useSwipe';
import { Button } from '@/components/ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

function Book3D() {
  return (
    <Canvas style={{ width: '100px', height: '100px' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh rotation={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[0.9, 1.4, 0.01]} />
        <meshStandardMaterial color="#FFF8DC" />
      </mesh>
    </Canvas>
  );
}

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  type?: 'text' | 'voice' | 'file';
  fileUrl?: string;
  fileType?: string;
  reactions?: Array<{ emoji: string; userId: string }>;
  replyTo?: { id: string; text: string; sender: string };
}

interface MessageListProps {
  messages?: Message[];
  chatId?: string;
  onPinMessage?: (messageId: string) => void;
  onReply?: (message: Message) => void;
}

const MessageList = memo(function MessageList({ messages = [], chatId, onPinMessage, onReply }: MessageListProps) {
  const { addReaction } = useMessages();
  const { user } = useAuth();
  const { addFavorite, isFavorite } = useFavorites();
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const handleReaction = useCallback((messageId: string, emoji: string) => {
    if (user && chatId) {
      addReaction(chatId, messageId, emoji, user.id);
    }
  }, [user, chatId, addReaction]);

  const handlePin = useCallback((messageId: string) => {
    if (onPinMessage) {
      onPinMessage(messageId);
    }
  }, [onPinMessage]);

  const handleDelete = useCallback((messageId: string) => {
    if (user?.role === 'admin' || user?.role === 'moderator') {
      console.log('Deleting message:', messageId);
    }
  }, [user?.role]);

  const handleReply = useCallback((msg: Message) => {
    if (onReply) {
      onReply(msg);
    }
  }, [onReply]);

  const handleFavorite = useCallback((msg: Message) => {
    if (chatId) {
      addFavorite({
        type: 'message',
        chatId,
        content: msg.text,
      });
    }
  }, [chatId, addFavorite]);

  const handleSwipeLeft = useCallback((messageId: string) => {
    // Archive chat
    console.log('Archive chat:', messageId);
  }, []);

  const handleSwipeRight = useCallback((messageId: string) => {
    // Pin message
    if (onPinMessage) {
      onPinMessage(messageId);
    }
  }, [onPinMessage]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          className={`mb-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}
          onMouseEnter={() => setHoveredMessage(msg.id)}
          onMouseLeave={() => setHoveredMessage(null)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="message-liquid-depth inline-block max-w-xs relative group cursor-pointer"
            whileHover={{
              scale: 1.03,
              rotateY: msg.sender === 'me' ? -3 : 3,
              z: 15,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.97 }}
            drag="x"
            dragConstraints={{ left: -120, right: 120 }}
            onDragEnd={(event, info) => {
              if (info.offset.x > 60) {
                handleSwipeRight(msg.id);
              } else if (info.offset.x < -60) {
                handleSwipeLeft(msg.id);
              }
            }}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '1200px',
              background: msg.sender === 'me'
                ? 'linear-gradient(135deg, oklch(var(--neon-primary) / 0.9), oklch(var(--neon-secondary) / 0.8))'
                : 'linear-gradient(135deg, oklch(0.95 0.02 0 / 0.95), oklch(0.92 0.03 0 / 0.9))',
              color: msg.sender === 'me' ? 'white' : 'oklch(0.2 0 0)',
              border: msg.sender === 'me' ? '1px solid oklch(var(--neon-primary) / 0.3)' : '1px solid oklch(0.9 0.05 0 / 0.2)'
            }}
          >
            {msg.replyTo && (
              <div className="text-xs opacity-70 mb-1 border-l-2 pl-2">
                Reply to: {msg.replyTo.text}
              </div>
            )}
            {msg.type === 'text' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {msg.text.split('').map((char, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            )}
            {msg.type === 'voice' && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{
                        height: [10, 30, 10],
                        backgroundColor: ['#6c43ff', '#00f3ff', '#6c43ff']
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm opacity-70">Voice message</span>
              </div>
            )}
            {msg.type === 'file' && msg.fileType === 'pdf' && (
              <div className="flex items-center gap-2">
                <Book3D />
                <span>PDF Document</span>
              </div>
            )}
            {msg.type === 'file' && msg.fileType === 'image' && msg.fileUrl && (
              <motion.img
                src={msg.fileUrl}
                alt="Shared image"
                className="max-w-xs rounded-lg"
                initial={{ rotateY: 0 }}
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              />
            )}
            {msg.type !== 'text' && msg.type !== 'voice' && msg.type !== 'file' && msg.text}
            {msg.text.match(/https?:\/\/[^\s]+/) && (
              <div className="mt-2 p-2 bg-muted rounded">
                <a href={msg.text.match(/https?:\/\/[^\s]+/)![0]} target="_blank" rel="noopener noreferrer" className="text-primary">
                  🔗 {msg.text.match(/https?:\/\/[^\s]+/)![0]}
                </a>
              </div>
            )}
            {hoveredMessage === msg.id && (
              <div className="absolute top-0 right-0 transform translate-x-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col">
                <div>
                  <button onClick={() => handleReaction(msg.id, '👍')} className="text-sm bg-white border rounded px-1">👍</button>
                  <button onClick={() => handleReaction(msg.id, '❤️')} className="text-sm bg-white border rounded px-1 ml-1">❤️</button>
                  <button onClick={() => handleReaction(msg.id, '😂')} className="text-sm bg-white border rounded px-1 ml-1">😂</button>
                </div>
                <button onClick={() => handlePin(msg.id)} className="text-sm bg-white border rounded px-1 mt-1">📌</button>
                <button onClick={() => handleReply(msg)} className="text-sm bg-white border rounded px-1 mt-1">↩️</button>
                <button onClick={() => handleFavorite(msg)} className="text-sm bg-white border rounded px-1 mt-1">⭐</button>
                {(user?.role === 'admin' || user?.role === 'moderator') && (
                  <button onClick={() => handleDelete(msg.id)} className="text-sm bg-white border rounded px-1 mt-1 text-red-600">🗑️</button>
                )}
              </div>
            )}
          </motion.div>
          {msg.reactions && msg.reactions.length > 0 && (
            <motion.div
              className="text-xs text-gray-500 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {msg.reactions.map((reaction, index) => (
                <motion.span
                  key={index}
                  className="mr-1 inline-block"
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.1 }}
                >
                  {reaction.emoji}
                </motion.span>
              ))}
            </motion.div>
          )}
          <motion.div
            className="text-xs text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {msg.timestamp}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
});

export default MessageList;