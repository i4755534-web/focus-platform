'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ChatHeaderProps {
  name: string;
  participants: string[];
  typingUsers?: string[];
}

export default function ChatHeader({ name, participants, typingUsers = [], onSummarize }: ChatHeaderProps) {
  const router = useRouter();

  const handleExport = () => {
    // Mock export - in real app would fetch messages and generate file
    const exportData = {
      chatName: name,
      participants,
      exportedAt: new Date().toISOString(),
      messages: [
        { sender: 'User1', text: 'Hello!', timestamp: '2024-01-01T10:00:00Z' },
        { sender: 'User2', text: 'Hi there!', timestamp: '2024-01-01T10:01:00Z' },
      ]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border-b bg-white flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={() => router.push('/chats')} className="mr-4 text-xl hover:text-blue-500">←</button>
        <div>
          <h3 className="text-lg font-semibold">{name}</h3>
          {typingUsers.length > 0 ? (
            <p className="text-sm text-blue-500 italic">Печатает: {typingUsers.join(', ')}</p>
          ) : (
            <p className="text-sm text-gray-500">Участники: {participants.join(', ')}</p>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={handleExport}
          variant="outline"
          size="sm"
          className="border-purple-300 text-purple-700 hover:bg-purple-100"
        >
          📄 Экспорт
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">⚙️</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Настройки чата</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p>Уведомления</p>
                <input type="checkbox" defaultChecked />
              </div>
              <div>
                <p>Показывать статусы</p>
                <input type="checkbox" defaultChecked />
              </div>
              <div>
                <p>Тема чата</p>
                <select className="w-full p-2 border rounded">
                  <option>Стандартная</option>
                  <option>Темная</option>
                  <option>Светлая</option>
                  <option>Фиолетовая</option>
                </select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}