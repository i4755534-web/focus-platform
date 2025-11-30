import { Role } from '@/lib/roles';
import { Badge } from '@/components/ui/badge';
import { User, UserCheck, Shield, Crown } from 'lucide-react';

interface PermissionBadgeProps {
  role: Role;
  className?: string;
}

const roleConfig = {
  [Role.GUEST]: {
    label: 'Гость',
    icon: User,
    className: 'bg-gray-100 text-gray-800 border-gray-300',
  },
  [Role.MEMBER]: {
    label: 'Участник',
    icon: UserCheck,
    className: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  [Role.MODERATOR]: {
    label: 'Модератор',
    icon: Shield,
    className: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  [Role.ADMIN]: {
    label: 'Админ',
    icon: Crown,
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export default function PermissionBadge({ role, className }: PermissionBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className || ''}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}