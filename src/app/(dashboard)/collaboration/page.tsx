'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CollaborativeEditor from '@/components/collaboration/CollaborativeEditor';
import CollaborativeWhiteboard from '@/components/collaboration/CollaborativeWhiteboard';
import { FileText, Palette, Users, Plus, Search } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  type: 'editor' | 'whiteboard';
  collaborators: number;
  lastModified: Date;
  owner: string;
}

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock documents
  const documents: Document[] = [
    {
      id: '1',
      title: 'Совместный проект документации',
      type: 'editor',
      collaborators: 3,
      lastModified: new Date('2024-01-15'),
      owner: 'Пользователь 1',
    },
    {
      id: '2',
      title: 'Дизайн UX/UI',
      type: 'whiteboard',
      collaborators: 5,
      lastModified: new Date('2024-01-14'),
      owner: 'Пользователь 2',
    },
    {
      id: '3',
      title: 'План разработки',
      type: 'editor',
      collaborators: 2,
      lastModified: new Date('2024-01-13'),
      owner: 'Пользователь 1',
    },
  ];

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDocument = (type: 'editor' | 'whiteboard') => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: `Новый ${type === 'editor' ? 'документ' : 'доска'}`,
      type,
      collaborators: 1,
      lastModified: new Date(),
      owner: 'Текущий пользователь',
    };

    // In real app, this would be saved to backend
    setSelectedDocument(newDoc);
    setActiveTab('editor');
  };

  if (selectedDocument) {
    return (
      <div className="h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setSelectedDocument(null)}
            >
              ← Назад
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{selectedDocument.title}</h1>
              <p className="text-sm text-gray-600">
                {selectedDocument.collaborators} участников • Последнее изменение: {selectedDocument.lastModified.toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant="secondary">
            <Users className="w-3 h-3 mr-1" />
            {selectedDocument.collaborators} участников
          </Badge>
        </div>

        <div className="h-[calc(100%-80px)]">
          {selectedDocument.type === 'editor' ? (
            <CollaborativeEditor
              documentId={selectedDocument.id}
              onSave={(content) => {
                console.log('Document saved:', content);
              }}
            />
          ) : (
            <CollaborativeWhiteboard boardId={selectedDocument.id} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Совместная работа</h1>
          <p className="text-gray-600">Создавайте и редактируйте документы вместе с командой</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleCreateDocument('editor')}>
            <FileText className="w-4 h-4 mr-2" />
            Новый документ
          </Button>
          <Button variant="outline" onClick={() => handleCreateDocument('whiteboard')}>
            <Palette className="w-4 h-4 mr-2" />
            Новая доска
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="whiteboards">Доски</TabsTrigger>
          <TabsTrigger value="shared">Общие</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск документов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments
              .filter(doc => doc.type === 'editor')
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FileText className="w-8 h-8 text-blue-500" />
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {doc.collaborators}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>
                      Владелец: {doc.owner}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Изменено: {doc.lastModified.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="whiteboards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments
              .filter(doc => doc.type === 'whiteboard')
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedDocument(doc)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Palette className="w-8 h-8 text-purple-500" />
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 mr-1" />
                        {doc.collaborators}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>
                      Владелец: {doc.owner}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      Изменено: {doc.lastModified.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="shared" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Общие документы</CardTitle>
              <CardDescription>
                Документы, к которым у вас есть доступ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Функция общего доступа к документам находится в разработке.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}