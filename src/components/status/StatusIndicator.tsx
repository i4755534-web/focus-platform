'use client';

import { Badge } from '@/components/ui/badge';

type Status = 'online' | 'offline' | 'busy' | 'away';

interface StatusIndicatorProps {
  status: Status;
  showText?: boolean;
}

const statusConfig = {
  online: { color: 'bg-green-500', text: 'Онлайн' },
  offline: { color: 'bg-gray-500', text: 'Оффлайн' },
  busy: { color: 'bg-red-500', text: 'Занят' },
  away: { color: 'bg-yellow-500', text: 'Не беспокоить' },
};

export default function StatusIndicator({ status, showText = false }: StatusIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
      {showText && <span className="text-sm text-gray-600">{config.text}</span>}
    </div>
  );
}