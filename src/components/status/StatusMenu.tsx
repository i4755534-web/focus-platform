'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import StatusIndicator from './StatusIndicator';

type Status = 'online' | 'offline' | 'busy' | 'away';

interface StatusMenuProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'online', label: 'Онлайн' },
  { value: 'offline', label: 'Оффлайн' },
  { value: 'busy', label: 'Занят' },
  { value: 'away', label: 'Не беспокоить' },
];

export default function StatusMenu({ currentStatus, onStatusChange }: StatusMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <StatusIndicator status={currentStatus} showText />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {statusOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            className="flex items-center space-x-2"
          >
            <StatusIndicator status={option.value} />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}