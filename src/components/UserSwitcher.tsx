'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/lib/database';
import type { User } from '@/lib/database';

export default function UserSwitcher({ currentUserId, onUserChange }: {
  currentUserId: string;
  onUserChange: (userId: string) => void;
}) {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const allUsers = await db.getAllUsers();
    setUsers(allUsers);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Пользователь:</span>
      <Select value={currentUserId} onValueChange={onUserChange}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.displayName} ({user.username})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={loadUsers} size="sm">Загрузить</Button>
    </div>
  );
}