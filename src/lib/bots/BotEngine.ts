import { Command, builtInCommands } from './commands';

export interface Bot {
  id: string;
  name: string;
  commands: Command[];
  isActive: boolean;
  permissions: string[];
}

export interface AutomationRule {
  id: string;
  trigger: string; // e.g., 'message', 'user_join'
  condition: (data: any) => boolean;
  action: (data: any) => Promise<void>;
  isActive: boolean;
}

export class BotEngine {
  private bots: Map<string, Bot> = new Map();
  private automationRules: AutomationRule[] = [];
  private commands: Map<string, Command> = new Map();

  constructor() {
    // Initialize with built-in commands
    this.loadBuiltInCommands();
  }

  private loadBuiltInCommands() {
    // This will be loaded from commands.ts
    // For now, placeholder
  }

  registerBot(bot: Bot) {
    this.bots.set(bot.id, bot);
    bot.commands.forEach(cmd => {
      this.commands.set(cmd.name, cmd);
    });
  }

  unregisterBot(botId: string) {
    const bot = this.bots.get(botId);
    if (bot) {
      bot.commands.forEach(cmd => {
        this.commands.delete(cmd.name);
      });
      this.bots.delete(botId);
    }
  }

  addAutomationRule(rule: AutomationRule) {
    this.automationRules.push(rule);
  }

  removeAutomationRule(ruleId: string) {
    this.automationRules = this.automationRules.filter(rule => rule.id !== ruleId);
  }

  async processMessage(message: string, userId: string, channelId: string, userRoles: string[]): Promise<string | null> {
    // Check for commands
    if (message.startsWith('/')) {
      const commandName = message.split(' ')[0].substring(1);
      const command = this.commands.get(commandName);
      if (command) {
        // Check permissions
        if (this.hasPermission(userRoles, command.permissions)) {
          return await this.executeCommand(command, message, userId, channelId);
        } else {
          return 'Insufficient permissions';
        }
      }
    }

    // Check automation rules
    for (const rule of this.automationRules) {
      if (rule.trigger === 'message' && rule.condition({ message, userId, channelId })) {
        await rule.action({ message, userId, channelId });
      }
    }

    return null;
  }

  async processUserJoin(userId: string, channelId: string) {
    // Check automation rules for user join
    for (const rule of this.automationRules) {
      if (rule.trigger === 'user_join' && rule.condition({ userId, channelId })) {
        await rule.action({ userId, channelId });
      }
    }
  }

  private hasPermission(userRoles: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(perm => userRoles.includes(perm));
  }

  private async executeCommand(command: Command, message: string, userId: string, channelId: string): Promise<string> {
    // Parse arguments
    const args = message.split(' ').slice(1);

    // Call API route or execute logic
    // For now, placeholder - integrate with existing API routes
    switch (command.name) {
      case 'kick':
        // Call API to kick user
        return `Kicked user ${args[0]}`;
      case 'ban':
        return `Banned user ${args[0]}`;
      case 'mute':
        return `Muted user ${args[0]}`;
      case 'warn':
        return `Warned user ${args[0]}`;
      default:
        return 'Command executed';
    }
  }

  getAvailableCommands(userRoles: string[]): Command[] {
    return Array.from(this.commands.values()).filter(cmd =>
      this.hasPermission(userRoles, cmd.permissions)
    );
  }
}