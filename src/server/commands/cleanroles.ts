import * as Discord from 'discord.js';

import CommandInterface from '../interfaces/CommandInterface';
import { validateCommandRestrictions } from '../utils/botValidation';

export default class Cleanroles implements CommandInterface {
  private readonly _command = 'cleanroles';

  private currentEmbedMessage: Discord.Message;

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
    msgObject: Discord.Message,
    client: Discord.Client
  ) {
    console.log('cleanroles executed');

    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }
    console.log('clean roles called');
  }
}
