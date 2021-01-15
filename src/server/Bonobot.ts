import { Client, Message } from 'discord.js';

import { GuildUseCases } from './usecases';

import { isBot, ignoreGuild, ignoreRoles, ignoreUser } from './utils';

import { BonobotConfiguration } from './interfaces';

import { TurnsCommand, RolesCommand, TemaryCommand, CategoryCommand, VerificationCommand, InfoCommand } from './commands';
//import Denuncia from './commands/Denuncia';
//import Mensajes from './commands/Mensajes';
//import Turnos from './commands/Turnos';
//import Verificador from './commands/Verificador';
//import Server from './commands/Server';

export default class Bonobot {
  public config: BonobotConfiguration;
  public client: Client;

  constructor(config: BonobotConfiguration) {
    this.config = config;
    this.client = new Client();
  }

  public async start(): Promise<void> {
    try {
      await this.client.login(process.env.DISCORD_TOKEN);
      await Promise.resolve(this.discordLoginReady(this.client));
      this.config.mainGuild = await this.client.guilds.fetch(this.config.mainGuildId);
      this.config.mainGuildData = await new GuildUseCases().findById(this.config.mainGuildId);

      this.loadCommands();

      this.startEventListeners();
    } catch (exception) {
      console.error('Some exception starting bonobot', exception.message);
    }
  }

  private discordLoginReady(client: Client) {
    return new Promise((resolve) => {
      client.on('ready', () => {
        resolve(console.log('Bot is ready on discord. (Loged in)'));
      });
    });
  }

  private startEventListeners(): void {
    console.log('Bot is listening messages...');
    this.client.on('message', async (message: Message) => {
      if (this.validate(message)) this.handleCommand(message);
    });
  }

  private validate(message: Message): boolean {
    const prefix = this.config.prefix;
    const { type: channelType } = message.channel;

    if (channelType === 'dm') {
      console.info(`El usuario ${message.author.username}#${message.author.discriminator} con id ${message.author.id} mando un mensaje privado al bonobot: ${message.content}`);
      return false;
    }

    if (!message.content.startsWith(prefix)) return false;
    if (isBot(message)) return false;
    if (ignoreUser(message, this.config.ignoredUsers)) return false;
    if (ignoreGuild(message, this.config.ignoredGuilds)) return false;
    if (ignoreRoles(message, this.config.ignoredRoles)) return false;

    return true;
  }

  private loadCommands(): void {
    this.config.commands = [new TurnsCommand(), new RolesCommand(this.client), new TemaryCommand(), new CategoryCommand(), new VerificationCommand(this.client), new InfoCommand()];
  }

  command(content: string): string {
    const commandSplited = content.split(' ');
    const allCommand = commandSplited[0];
    const command = allCommand.replace(this.config.prefix, '');
    return command;
  }

  fullargs(content: string): string {
    const fullargs = content.replace(this.config.prefix, '');
    return fullargs;
  }

  handleCommand(message: Message): void {
    const { content } = message;
    const command = this.command(content);
    const fullargs = this.fullargs(content);

    for (const commandClass of this.config.commands) {
      try {
        if (!commandClass.isThisCommand(command)) {
          continue;
        }
        commandClass.runCommand(fullargs, message);
      } catch (exception) {
        throw new Error(exception);
      }
    }
  }
}
