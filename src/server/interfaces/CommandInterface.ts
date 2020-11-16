import { Message, Client } from 'discord.js';

export default interface MigBotCommand {
  help(): string;
  isThisCommand(command: string): boolean;
  runCommand(
    args: string[],
    msgObject: Message,
    client: Client
  ): void;
}

