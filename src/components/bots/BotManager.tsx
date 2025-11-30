'use client';

import React, { useState, useEffect } from 'react';
import { Bot } from '@/lib/bots/BotEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

interface BotManagerProps {
  channelId: string;
  serverId?: string;
}

export const BotManager: React.FC<BotManagerProps> = ({ channelId, serverId }) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newBotName, setNewBotName] = useState('');
  const [newBotPermissions, setNewBotPermissions] = useState<string[]>([]);

  const fetchBots = async () => {
    // API call to get bots
    // For now, mock data
    setBots([
      {
        id: '1',
        name: 'ModerationBot',
        commands: [],
        isActive: true,
        permissions: ['moderator'],
      },
    ]);
  };

  useEffect(() => {
    // Fetch bots for the channel/server
    fetchBots();
  }, [channelId, serverId]);

  const handleAddBot = async () => {
    if (!newBotName.trim()) return;

    const newBot: Bot = {
      id: Date.now().toString(),
      name: newBotName,
      commands: [],
      isActive: true,
      permissions: newBotPermissions,
    };

    // API call to add bot
    setBots([...bots, newBot]);
    setNewBotName('');
    setNewBotPermissions([]);
    setIsAddDialogOpen(false);
  };

  const handleToggleBot = async (botId: string, isActive: boolean) => {
    // API call to toggle bot
    setBots(bots.map(bot =>
      bot.id === botId ? { ...bot, isActive } : bot
    ));
  };

  const handleDeleteBot = async (botId: string) => {
    // API call to delete bot
    setBots(bots.filter(bot => bot.id !== botId));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bot Manager</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Bot</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bot</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="botName">Bot Name</Label>
                <Input
                  id="botName"
                  value={newBotName}
                  onChange={(e) => setNewBotName(e.target.value)}
                  placeholder="Enter bot name"
                />
              </div>
              <div>
                <Label>Permissions</Label>
                {/* Simple permission selector, can be enhanced */}
                <div className="flex space-x-2">
                  {['member', 'moderator', 'admin'].map(perm => (
                    <Button
                      key={perm}
                      variant={newBotPermissions.includes(perm) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setNewBotPermissions(prev =>
                          prev.includes(perm)
                            ? prev.filter(p => p !== perm)
                            : [...prev, perm]
                        );
                      }}
                    >
                      {perm}
                    </Button>
                  ))}
                </div>
              </div>
              <Button onClick={handleAddBot}>Add Bot</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {bots.map(bot => (
          <Card key={bot.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {bot.name}
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={bot.isActive}
                    onCheckedChange={(checked) => handleToggleBot(bot.id, checked)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBot(bot.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {bot.permissions.map(perm => (
                  <Badge key={perm} variant="secondary">
                    {perm}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Commands: {bot.commands.length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};