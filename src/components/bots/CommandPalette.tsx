'use client';

import React, { useState, useEffect } from 'react';
import { Command, builtInCommands } from '@/lib/bots/commands';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommandPaletteProps {
  userRoles: string[];
  onCommandSelect: (command: Command) => void;
  placeholder?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  userRoles,
  onCommandSelect,
  placeholder = 'Type / to see available commands'
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredCommands, setFilteredCommands] = useState<Command[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const availableCommands = builtInCommands.filter(cmd =>
    cmd.permissions.some(perm => userRoles.includes(perm))
  );

  useEffect(() => {
    if (inputValue.startsWith('/')) {
      const query = inputValue.slice(1).toLowerCase();
      const filtered = availableCommands.filter(cmd =>
        cmd.name.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query)
      );
      setFilteredCommands(filtered);
      setIsOpen(true);
    } else {
      setFilteredCommands([]);
      setIsOpen(false);
    }
  }, [inputValue, availableCommands]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCommandClick = (command: Command) => {
    setInputValue(`/${command.name} `);
    onCommandSelect(command);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredCommands.length > 0) {
      handleCommandClick(filteredCommands[0]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <Input
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full"
      />
      {isOpen && filteredCommands.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {filteredCommands.map(command => (
              <div
                key={command.name}
                className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                onClick={() => handleCommandClick(command)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">/{command.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {command.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {command.usage}
                    </div>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {command.category}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};