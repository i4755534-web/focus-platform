'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  History,
  GitBranch,
  GitCommit,
  GitMerge,
  Download,
  Upload,
  RotateCcw,
  Eye,
  FileText,
  Image,
  Video,
  Archive,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FileVersion {
  id: string;
  version: number;
  name: string;
  size: number;
  type: string;
  hash: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  commitMessage: string;
  changes: string[];
  parentVersion?: string;
  branch?: string;
  tags?: string[];
  metadata: {
    checksum: string;
    compression?: string;
    encryption?: boolean;
  };
}

interface FileVersioningProps {
  fileId: string;
  currentVersion?: FileVersion;
  onVersionSelect?: (version: FileVersion) => void;
  onVersionRestore?: (version: FileVersion) => void;
  onVersionCompare?: (version1: FileVersion, version2: FileVersion) => void;
  readOnly?: boolean;
}

export default function FileVersioning({
  fileId,
  currentVersion,
  onVersionSelect,
  onVersionRestore,
  onVersionCompare,
  readOnly = false,
}: FileVersioningProps) {
  const [versions, setVersions] = useState<FileVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<FileVersion[]>([]);
  const [showCreateVersion, setShowCreateVersion] = useState(false);
  const [newVersionMessage, setNewVersionMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockVersions: FileVersion[] = [
      {
        id: 'v1',
        version: 1,
        name: 'document.docx',
        size: 245760,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        hash: 'a1b2c3d4e5f6',
        author: {
          id: 'user1',
          name: 'Иван Петров',
          avatar: '/avatars/user1.jpg',
        },
        timestamp: new Date('2024-01-10T10:00:00'),
        commitMessage: 'Initial version',
        changes: ['Created document'],
        branch: 'main',
        tags: ['initial'],
        metadata: {
          checksum: 'sha256:abc123',
          compression: 'gzip',
        },
      },
      {
        id: 'v2',
        version: 2,
        name: 'document.docx',
        size: 256000,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        hash: 'f6e5d4c3b2a1',
        author: {
          id: 'user2',
          name: 'Мария Иванова',
          avatar: '/avatars/user2.jpg',
        },
        timestamp: new Date('2024-01-11T14:30:00'),
        commitMessage: 'Added introduction section',
        changes: ['Added introduction', 'Updated formatting'],
        parentVersion: 'v1',
        branch: 'main',
        metadata: {
          checksum: 'sha256:def456',
          compression: 'gzip',
        },
      },
      {
        id: 'v3',
        version: 3,
        name: 'document.docx',
        size: 278528,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        hash: '1a2b3c4d5e6f',
        author: {
          id: 'user1',
          name: 'Иван Петров',
        },
        timestamp: new Date('2024-01-12T09:15:00'),
        commitMessage: 'Final review and corrections',
        changes: ['Fixed typos', 'Added conclusion', 'Updated references'],
        parentVersion: 'v2',
        branch: 'main',
        tags: ['final'],
        metadata: {
          checksum: 'sha256:ghi789',
          compression: 'gzip',
        },
      },
    ];

    setVersions(mockVersions);
  }, [fileId]);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="w-4 h-4" />;
    if (type.includes('video')) return <Video className="w-4 h-4" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleVersionSelect = (version: FileVersion) => {
    onVersionSelect?.(version);
  };

  const handleVersionRestore = (version: FileVersion) => {
    onVersionRestore?.(version);
  };

  const handleVersionCompare = (version: FileVersion) => {
    if (selectedVersions.length === 1) {
      onVersionCompare?.(selectedVersions[0], version);
      setSelectedVersions([]);
    } else {
      setSelectedVersions([version]);
    }
  };

  const handleCreateVersion = async () => {
    if (!newVersionMessage.trim()) return;

    setLoading(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newVersion: FileVersion = {
        id: `v${versions.length + 1}`,
        version: versions.length + 1,
        name: currentVersion?.name || 'document.docx',
        size: currentVersion?.size || 0,
        type: currentVersion?.type || 'application/octet-stream',
        hash: Math.random().toString(36).substr(2, 9),
        author: {
          id: 'current-user',
          name: 'Текущий пользователь',
        },
        timestamp: new Date(),
        commitMessage: newVersionMessage,
        changes: ['Manual version created'],
        parentVersion: currentVersion?.id,
        branch: 'main',
        metadata: {
          checksum: `sha256:${Math.random().toString(36).substr(2, 9)}`,
          compression: 'gzip',
        },
      };

      setVersions(prev => [newVersion, ...prev]);
      setNewVersionMessage('');
      setShowCreateVersion(false);
    } catch (error) {
      console.error('Failed to create version:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVersion = (version: FileVersion) => {
    // Mock download
    console.log('Downloading version:', version.id);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5" />
              <div>
                <CardTitle>История версий</CardTitle>
                <CardDescription>
                  Управление версиями файла и восстановление предыдущих состояний
                </CardDescription>
              </div>
            </div>

            {!readOnly && (
              <div className="flex gap-2">
                <Dialog open={showCreateVersion} onOpenChange={setShowCreateVersion}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <GitCommit className="w-4 h-4 mr-2" />
                      Создать версию
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Создать новую версию</DialogTitle>
                      <DialogDescription>
                        Опишите изменения в этой версии файла
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Опишите изменения..."
                        value={newVersionMessage}
                        onChange={(e) => setNewVersionMessage(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateVersion(false)}
                        >
                          Отмена
                        </Button>
                        <Button
                          onClick={handleCreateVersion}
                          disabled={!newVersionMessage.trim() || loading}
                        >
                          {loading ? 'Создание...' : 'Создать'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Version Comparison */}
      {selectedVersions.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Выбрана версия {selectedVersions[0].version} для сравнения
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedVersions([])}
              >
                Очистить
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Versions List */}
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                    currentVersion?.id === version.id
                      ? 'bg-blue-50 border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Version indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentVersion?.id === version.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {version.version}
                    </div>
                    {index < versions.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                    )}
                  </div>

                  {/* Version content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(version.type)}
                        <div>
                          <h4 className="font-medium">{version.name}</h4>
                          <p className="text-sm text-gray-600">{version.commitMessage}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {version.tags?.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleVersionSelect(version)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Просмотреть
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleVersionCompare(version)}>
                              <GitBranch className="w-4 h-4 mr-2" />
                              Сравнить
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadVersion(version)}>
                              <Download className="w-4 h-4 mr-2" />
                              Скачать
                            </DropdownMenuItem>
                            {!readOnly && (
                              <DropdownMenuItem onClick={() => handleVersionRestore(version)}>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Восстановить
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={version.author.avatar} />
                          <AvatarFallback className="text-xs">
                            {version.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{version.author.name}</span>
                      </div>

                      <span>{version.timestamp.toLocaleString()}</span>
                      <span>{formatFileSize(version.size)}</span>
                      <span className="font-mono text-xs">{version.hash.slice(0, 7)}</span>
                    </div>

                    {version.changes.length > 0 && (
                      <div className="mt-2">
                        <details className="text-sm">
                          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                            Изменения ({version.changes.length})
                          </summary>
                          <ul className="mt-2 space-y-1">
                            {version.changes.map((change, idx) => (
                              <li key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                {change}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}