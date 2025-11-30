export interface Command {
  name: string;
  description: string;
  permissions: string[]; // Required roles/permissions
  usage: string;
  category: 'moderation' | 'utility' | 'fun' | 'custom';
}

export const builtInCommands: Command[] = [
  {
    name: 'kick',
    description: 'Kick a user from the channel',
    permissions: ['moderator', 'admin'],
    usage: '/kick <user> [reason]',
    category: 'moderation',
  },
  {
    name: 'ban',
    description: 'Ban a user from the server',
    permissions: ['moderator', 'admin'],
    usage: '/ban <user> [reason]',
    category: 'moderation',
  },
  {
    name: 'mute',
    description: 'Mute a user in the channel',
    permissions: ['moderator', 'admin'],
    usage: '/mute <user> [duration]',
    category: 'moderation',
  },
  {
    name: 'warn',
    description: 'Warn a user',
    permissions: ['moderator', 'admin'],
    usage: '/warn <user> [reason]',
    category: 'moderation',
  },
  {
    name: 'unmute',
    description: 'Unmute a user',
    permissions: ['moderator', 'admin'],
    usage: '/unmute <user>',
    category: 'moderation',
  },
  {
    name: 'clear',
    description: 'Clear messages in the channel',
    permissions: ['moderator', 'admin'],
    usage: '/clear [amount]',
    category: 'moderation',
  },
  {
    name: 'role',
    description: 'Assign or remove a role from a user',
    permissions: ['admin'],
    usage: '/role <user> <role> [add|remove]',
    category: 'utility',
  },
  {
    name: 'info',
    description: 'Get information about a user',
    permissions: ['member'],
    usage: '/info <user>',
    category: 'utility',
  },
  {
    name: 'help',
    description: 'Show available commands',
    permissions: ['member'],
    usage: '/help [command]',
    category: 'utility',
  },
];