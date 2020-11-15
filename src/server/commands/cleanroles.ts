import CommandInterface from '../interfaces/CommandInterface';
import { validateCommandRestrictions } from '../utils/botValidation';
import { Message, Client } from 'discord.js';

export default class Cleanroles implements CommandInterface {
  private readonly _command = 'cleanroles';

  private currentEmbedMessage: Message;

  constructor() {
    console.log('Cleanroles Command Instantiated');
  }

  help(): string {
    return 'Este comando se utilizo para eliminar roles en los usuarios';
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  public async runCommand(
    args: string[],
    msgObject: Message,
    client: Client
  ) {
    console.log('cleanroles executed');

    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }
    console.log('clean roles called');
  }
}
