'use client';

import { Role } from '@/lib/roles';
import { useRoles } from '@/hooks/useRoles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  name: string;
  role: Role;
}

interface RoleManagerProps {
  users: User[];
  onRoleChange: (userId: string, newRole: Role) => void;
}

export default function RoleManager({ users, onRoleChange }: RoleManagerProps) {
  const { canAssignRoles, canManageUser } = useRoles();

  if (!canAssignRoles) {
    return <div className="text-gray-500">У вас нет прав для управления ролями.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Управление ролями</h3>
      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between p-2 border rounded">
          <span className="font-medium">{user.name}</span>
          <Select
            value={user.role}
            onValueChange={(value: Role) => {
              if (canManageUser(user.role)) {
                onRoleChange(user.id, value);
              }
            }}
            disabled={!canManageUser(user.role)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Role.GUEST}>Гость</SelectItem>
              <SelectItem value={Role.MEMBER}>Участник</SelectItem>
              <SelectItem value={Role.MODERATOR}>Модератор</SelectItem>
              <SelectItem value={Role.ADMIN}>Админ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}