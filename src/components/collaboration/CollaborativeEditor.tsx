'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Edit3, Eye, MessageSquare, Save, Undo, Redo } from 'lucide-react';

interface Cursor {
  userId: string;
  userName: string;
  position: number;
  color: string;
}

interface Change {
  id: string;
  userId: string;
  userName: string;
  type: 'insert' | 'delete';
  position: number;
  content: string;
  timestamp: number;
}

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: string;
  onSave?: (content: string) => void;
  readOnly?: boolean;
}

export default function CollaborativeEditor({
  documentId,
  initialContent = '',
  onSave,
  readOnly = false,
}: CollaborativeEditorProps) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(initialContent);
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [changes, setChanges] = useState<Change[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [history, setHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Colors for different users
  const userColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  const getUserColor = useCallback((userId: string) => {
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % userColors.length;
    return userColors[index];
  }, []);

  // Join document room
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('join-document', {
        documentId,
        userId: user.id,
        userName: user.nickname,
        color: getUserColor(user.id),
      });

      // Listen for document updates
      socket.on('document-update', (data: { content: string; changes: Change[] }) => {
        setContent(data.content);
        setChanges(data.changes);
      });

      // Listen for cursor updates
      socket.on('cursor-update', (cursorData: Cursor[]) => {
        setCursors(cursorData);
      });

      // Listen for active users
      socket.on('active-users', (users: any[]) => {
        setActiveUsers(users);
      });

      return () => {
        socket.off('document-update');
        socket.off('cursor-update');
        socket.off('active-users');
        socket.emit('leave-document', { documentId, userId: user.id });
      };
    }
  }, [socket, isConnected, user, documentId, getUserColor]);

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    if (readOnly) return;

    setContent(newContent);
    setIsTyping(true);

    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newContent);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));

    // Emit change to server
    if (socket && user) {
      socket.emit('document-change', {
        documentId,
        userId: user.id,
        userName: user.nickname,
        content: newContent,
        changes: [{
          id: Date.now().toString(),
          userId: user.id,
          userName: user.nickname,
          type: 'insert',
          position: textareaRef.current?.selectionStart || 0,
          content: newContent,
          timestamp: Date.now(),
        }],
      });
    }

    // Clear typing indicator
    setTimeout(() => setIsTyping(false), 1000);
  }, [socket, user, documentId, readOnly, historyIndex]);

  // Handle cursor movement
  const handleCursorMove = useCallback(() => {
    if (socket && user && textareaRef.current) {
      const position = textareaRef.current.selectionStart;
      socket.emit('cursor-move', {
        documentId,
        userId: user.id,
        userName: user.nickname,
        position,
        color: getUserColor(user.id),
      });
    }
  }, [socket, user, documentId, getUserColor]);

  // Save document
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(content);
      setLastSaved(new Date());
    }
  }, [onSave, content]);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setContent(history[newIndex]);
    }
  }, [historyIndex, history]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Совместное редактирование</h2>
          </div>

          {/* Connection status */}
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? 'Подключено' : 'Отключено'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Active users */}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span className="text-sm text-gray-600">{activeUsers.length}</span>
            <div className="flex -space-x-2">
              {activeUsers.slice(0, 3).map((activeUser) => (
                <Avatar key={activeUser.id} className="w-6 h-6 border-2 border-white">
                  <AvatarImage src={activeUser.avatar} />
                  <AvatarFallback className="text-xs">
                    {activeUser.nickname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {activeUsers.length > 3 && (
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">
                  +{activeUsers.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {!readOnly && (
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={handleUndo}
                disabled={historyIndex <= 0}
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="w-4 h-4" />
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Сохранить
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onSelect={handleCursorMove}
          onKeyUp={handleCursorMove}
          onClick={handleCursorMove}
          readOnly={readOnly}
          className="w-full h-full p-4 resize-none border-0 focus:outline-none focus:ring-0 font-mono text-sm"
          placeholder={readOnly ? "Только чтение..." : "Начните вводить текст..."}
        />

        {/* Cursors */}
        {cursors.map((cursor) => (
          <div
            key={cursor.userId}
            className="absolute pointer-events-none"
            style={{
              left: `${(cursor.position % 80) * 8}px`,
              top: `${Math.floor(cursor.position / 80) * 20}px`,
            }}
          >
            <div
              className="w-0.5 h-5"
              style={{ backgroundColor: cursor.color }}
            />
            <div
              className="px-2 py-1 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="absolute bottom-4 right-4">
            <div className="bg-black text-white px-3 py-1 rounded-lg text-sm">
              {user?.nickname} печатает...
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>Символов: {content.length}</span>
            <span>Изменений: {changes.length}</span>
            {lastSaved && (
              <span>Сохранено: {lastSaved.toLocaleTimeString()}</span>
            )}
          </div>

          {readOnly && (
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Режим просмотра</span>
            </div>
          )}
        </div>
      </div>

      {/* Changes sidebar */}
      {changes.length > 0 && (
        <div className="absolute right-0 top-0 h-full w-80 bg-white border-l shadow-lg">
          <Card className="h-full rounded-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                История изменений
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {changes.slice(-10).reverse().map((change) => (
                <div key={change.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {change.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{change.userName}</p>
                    <p className="text-xs text-gray-600">
                      {change.type === 'insert' ? 'Добавил' : 'Удалил'} текст
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(change.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}