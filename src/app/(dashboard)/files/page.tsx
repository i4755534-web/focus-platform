'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileVersioning from '@/components/versioning/FileVersioning';
import { FileText, Upload, Download, Search, Folder, File, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified: Date;
  owner: string;
  shared: boolean;
  versions: number;
}

export default function FilesPage() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPath, setCurrentPath] = useState('/');

  // Mock files data
  const files: FileItem[] = [
    {
      id: '1',
      name: 'Документы',
      type: 'folder',
      modified: new Date('2024-01-15'),
      owner: 'Иван Петров',
      shared: false,
      versions: 0,
    },
    {
      id: '2',
      name: 'Проект_отчет.docx',
      type: 'file',
      size: 245760,
      modified: new Date('2024-01-14'),
      owner: 'Мария Иванова',
      shared: true,
      versions: 5,
    },
    {
      id: '3',
      name: 'Презентация.pptx',
      type: 'file',
      size: 5120000,
      modified: new Date('2024-01-13'),
      owner: 'Иван Петров',
      shared: false,
      versions: 3,
    },
    {
      id: '4',
      name: 'Изображения',
      type: 'folder',
      modified: new Date('2024-01-12'),
      owner: 'Иван Петров',
      shared: true,
      versions: 0,
    },
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(prev => prev + file.name + '/');
    } else {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    // Mock file upload
    console.log('Upload file');
  };

  const handleFileDownload = (file: FileItem) => {
    // Mock download
    console.log('Download file:', file.name);
  };

  const handleFileDelete = (file: FileItem) => {
    // Mock delete
    console.log('Delete file:', file.name);
  };

  const handleFileShare = (file: FileItem) => {
    // Mock share
    console.log('Share file:', file.name);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Файлы</h1>
          <p className="text-gray-600">Управление файлами и версиями</p>
        </div>

        <Button onClick={handleFileUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Загрузить файл
        </Button>
      </div>

      <Tabs defaultValue="files" className="space-y-4">
        <TabsList>
          <TabsTrigger value="files">Файлы</TabsTrigger>
          <TabsTrigger value="versions" disabled={!selectedFile}>
            Версии
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          {/* Search and path */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск файлов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-gray-600">
              Путь: <code className="bg-gray-100 px-2 py-1 rounded">{currentPath}</code>
            </div>
          </div>

          {/* Files list */}
          <Card>
            <CardHeader>
              <CardTitle>Файлы и папки</CardTitle>
              <CardDescription>
                {filteredFiles.length} элементов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFile?.id === file.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleFileSelect(file)}
                  >
                    <div className="flex items-center gap-3">
                      {file.type === 'folder' ? (
                        <Folder className="w-5 h-5 text-blue-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500" />
                      )}
                      <div>
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{file.owner}</span>
                          <span>{file.modified.toLocaleDateString()}</span>
                          {file.size && <span>{formatFileSize(file.size)}</span>}
                          {file.versions > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {file.versions} версий
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {file.shared && (
                        <Badge variant="outline" className="text-xs">
                          Общий
                        </Badge>
                      )}

                      {file.type === 'file' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                              Просмотреть версии
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileDownload(file)}>
                              <Download className="w-4 h-4 mr-2" />
                              Скачать
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileShare(file)}>
                              Поделиться
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleFileDelete(file)}
                              className="text-red-600"
                            >
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="space-y-4">
          {selectedFile && (
            <FileVersioning
              fileId={selectedFile.id}
              onVersionSelect={(version) => {
                console.log('Selected version:', version);
              }}
              onVersionRestore={(version) => {
                console.log('Restore version:', version);
              }}
              onVersionCompare={(v1, v2) => {
                console.log('Compare versions:', v1, v2);
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}