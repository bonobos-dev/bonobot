

import { Client, Message } from 'discord.js';
import { config } from './botConfig';
import CommandInterface from './interfaces/CommandInterface';
import { GuildInWhitelist, isBot, isInvalidUser } from './utils/botValidation';

import Denuncia from './commands/Denuncia';
import Mensajes from './commands/Mensajes';
import Temario from './commands/Temario';
import Turnos from './commands/Turnos';
import Verificador from './commands/Verificador';
import Server from './commands/Server';

export default class Bonobot {
  private client: Client;
  private commands: Array<CommandInterface>;

  constructor() {
    this.client = new Client();
    this.loadCommands();
    this.client.login(process.env.DISCORD_TOKEN);
  }

  public start(): void {
    this.client.on('ready', () => {
      console.info('Bonobot is ready on discord!!!!!!!!!');
    });
  }
  validate(message: Message): boolean {
    const { prefix } = config;
    const { type: channelType } = message.channel;
    let valid: boolean;
    valid = false;
    if (message.content.startsWith(prefix)) {
      valid = true;
    }

    if (!isBot(message)) {
      valid = true;
    }

    if (isInvalidUser(message)) {
      valid = true;
    }

    if (GuildInWhitelist(message) !== null) {
      valid = true;
    }

    if (channelType !== 'dm') {
      console.info(
        `El usuario ${message.author.username} mando un mensaje al bonobot`
      );
      valid = true;
    }
    return valid;
  }
  run(): void {
    this.client.on('message', async (message: Message) => {
      if (this.validate(message)) {
        this.handleCommand(message);
      }
    });
  }

  loadCommands(): void {
    const denunciaCmd = new Denuncia();
    const mensajesCmd = new Mensajes();
    const temarioCmd = new Temario();
    const turnosCmd = new Turnos();
    const verificadorCmd = new Verificador();
    const serverCmd = new Server();

    this.commands = [
      denunciaCmd,
      mensajesCmd,
      temarioCmd,
      turnosCmd,
      verificadorCmd,
      serverCmd,
    ];
  }
  command(content: string): string {
    const commandSplited = content.split(' ');
    const allCommand = commandSplited[0];
    const command = allCommand.replace(config.prefix, '');
    return command;
  }
  arguments(content: string): Array<string> {
    const argsSplited = content.split(' ');
    const args = argsSplited.slice(1);
    return args;
  }
  handleCommand(message: Message): void {
    const { content } = message;
    const command = this.command(content);
    const args = this.arguments(content);

    for (const commandClass of this.commands) {
      try {
        if (!commandClass.isThisCommand(command)) {
          continue;
        }
        commandClass.runCommand(args, message, this.client);
      } catch (exception) {
        throw new Error(exception);
      }
    }
  }
}
