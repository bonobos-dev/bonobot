import { Message, Client } from 'discord.js';

export interface MigBotCommand {
  help(): string;
  isThisCommand(command: string): boolean;
  runCommand(
    args: string[],
    msgObject: Message,
    client: Client
  ): void;
}

