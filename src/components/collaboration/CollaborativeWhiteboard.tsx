'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Pen,
  Square,
  Circle,
  Type,
  Eraser,
  Undo,
  Redo,
  Download,
  Upload,
  Users,
  Palette,
  Trash2,
  Eye
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  id: string;
  userId: string;
  userName: string;
  tool: 'pen' | 'eraser' | 'rectangle' | 'circle' | 'text';
  points: Point[];
  color: string;
  width: number;
  text?: string;
  timestamp: number;
}

interface CollaborativeWhiteboardProps {
  boardId: string;
  width?: number;
  height?: number;
}

export default function CollaborativeWhiteboard({
  boardId,
  width = 800,
  height = 600,
}: CollaborativeWhiteboardProps) {
  const { socket, isConnected } = useSocket();
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<'pen' | 'eraser' | 'rectangle' | 'circle' | 'text'>('pen');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [paths, setPaths] = useState<DrawingPath[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [history, setHistory] = useState<DrawingPath[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isTextMode, setIsTextMode] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState<Point | null>(null);
  const [isARMode, setIsARMode] = useState(false);

  // Colors palette
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'
  ];

  // Join whiteboard room
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('join-whiteboard', {
        boardId,
        userId: user.id,
        userName: user.nickname,
      });

      // Listen for drawing updates
      socket.on('drawing-update', (data: { paths: DrawingPath[] }) => {
        setPaths(data.paths);
      });

      // Listen for active users
      socket.on('whiteboard-users', (users: any[]) => {
        setActiveUsers(users);
      });

      return () => {
        socket.off('drawing-update');
        socket.off('whiteboard-users');
        socket.emit('leave-whiteboard', { boardId, userId: user.id });
      };
    }
  }, [socket, isConnected, user, boardId]);

  // Draw on canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw all paths
    paths.forEach((path) => {
      ctx.strokeStyle = path.color;
      ctx.lineWidth = path.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (path.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }

      if (path.tool === 'text' && path.text) {
        ctx.font = `${path.width * 10}px Arial`;
        ctx.fillStyle = path.color;
        ctx.fillText(path.text, path.points[0]?.x || 0, path.points[0]?.y || 0);
      } else if (path.tool === 'rectangle' && path.points.length >= 2) {
        const start = path.points[0];
        const end = path.points[path.points.length - 1];
        const rectWidth = end.x - start.x;
        const rectHeight = end.y - start.y;

        ctx.strokeRect(start.x, start.y, rectWidth, rectHeight);
      } else if (path.tool === 'circle' && path.points.length >= 2) {
        const start = path.points[0];
        const end = path.points[path.points.length - 1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

        ctx.beginPath();
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (path.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);

        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }

        ctx.stroke();
      }
    });
  }, [paths, width, height]);

  // Redraw when paths change
  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse event handlers
  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentTool === 'text') {
      setIsTextMode(true);
      setTextPosition(getMousePos(e));
      return;
    }

    setIsDrawing(true);
    const pos = getMousePos(e);

    const newPath: DrawingPath = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.nickname || '',
      tool: currentTool,
      points: [pos],
      color: currentColor,
      width: brushSize,
      timestamp: Date.now(),
    };

    setPaths(prev => [...prev, newPath]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setPaths(prev => prev.map(path =>
      path.id === prev[prev.length - 1]?.id
        ? { ...path, points: [...path.points, pos] }
        : path
    ));
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);

      // Add to history
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push([...paths]);
        return newHistory.slice(-20); // Keep last 20 states
      });
      setHistoryIndex(prev => Math.min(prev + 1, 19));

      // Emit to server
      if (socket) {
        socket.emit('drawing-change', {
          boardId,
          paths: [...paths],
        });
      }
    }
  };

  // Text input handler
  const handleTextSubmit = () => {
    if (textInput && textPosition) {
      const newPath: DrawingPath = {
        id: Date.now().toString(),
        userId: user?.id || '',
        userName: user?.nickname || '',
        tool: 'text',
        points: [textPosition],
        color: currentColor,
        width: brushSize,
        text: textInput,
        timestamp: Date.now(),
      };

      setPaths(prev => [...prev, newPath]);
      setTextInput('');
      setTextPosition(null);
      setIsTextMode(false);

      // Emit to server
      if (socket) {
        socket.emit('drawing-change', {
          boardId,
          paths: [...paths, newPath],
        });
      }
    }
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPaths(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPaths(history[newIndex]);
    }
  };

  // Clear canvas
  const handleClear = () => {
    setPaths([]);
    setHistory([[]]);
    setHistoryIndex(0);

    if (socket) {
      socket.emit('drawing-change', {
        boardId,
        paths: [],
      });
    }
  };

  // Export canvas
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${boardId}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Совместная доска
            </CardTitle>

            <div className="flex items-center gap-4">
              {/* Connection status */}
              <Badge variant={isConnected ? "default" : "destructive"}>
                {isConnected ? 'Подключено' : 'Отключено'}
              </Badge>

              {/* Active users */}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
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
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Tools */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={currentTool === 'pen' ? 'default' : 'outline'}
                onClick={() => setCurrentTool('pen')}
              >
                <Pen className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentTool === 'eraser' ? 'default' : 'outline'}
                onClick={() => setCurrentTool('eraser')}
              >
                <Eraser className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentTool === 'rectangle' ? 'default' : 'outline'}
                onClick={() => setCurrentTool('rectangle')}
              >
                <Square className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentTool === 'circle' ? 'default' : 'outline'}
                onClick={() => setCurrentTool('circle')}
              >
                <Circle className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={currentTool === 'text' ? 'default' : 'outline'}
                onClick={() => setCurrentTool('text')}
              >
                <Type className="w-4 h-4" />
              </Button>
            </div>

            {/* Colors */}
            <div className="flex gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border-2 ${
                    currentColor === color ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>

            {/* Brush size */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Размер:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm w-6">{brushSize}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={handleUndo} disabled={historyIndex <= 0}>
                <Undo className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                <Redo className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleClear}>
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleExport}>
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={isARMode ? 'default' : 'outline'}
                onClick={() => setIsARMode(!isARMode)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-white relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Text input overlay */}
        {isTextMode && textPosition && (
          <div
            className="absolute bg-white border rounded p-2 shadow-lg"
            style={{ left: textPosition.x, top: textPosition.y }}
          >
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextSubmit();
                if (e.key === 'Escape') {
                  setIsTextMode(false);
                  setTextInput('');
                  setTextPosition(null);
                }
              }}
              placeholder="Введите текст..."
              className="border-0 outline-none text-sm"
              autoFocus
            />
            <div className="flex gap-1 mt-1">
              <Button size="sm" onClick={handleTextSubmit}>OK</Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsTextMode(false);
                setTextInput('');
                setTextPosition(null);
              }}>
                Отмена
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}