import Discord from 'discord.js';
import * as BotConfig from './botConfig';
import { MigBotCommand } from './botApi';
import { GuildInWhitelist, isBot, isInvalidUser } from './utils/botValidation';

import denuncia from './bot-commands/denuncia';
import mensajes from './bot-commands/mensajes';
import temario from './bot-commands/temario';
import turnos from './bot-commands/turnos';
import verificador from './bot-commands/verificador';
import server from './bot-commands/server';

export default class Bot {
  private client: Discord.Client;
  private commands: Array<MigBotCommand>;

  constructor() {
    this.client = new Discord.Client();
    this.loadCommands();
    this.client.login(process.env.DISCORD_TOKEN);
  }

  public start(): void {
    this.client.on('ready', () => {
      console.log('Bot is ready on discord!!!!!!!!!');
    });

    this.client.on('message', async (message) => {
      if (!message.content.startsWith(BotConfig.config.prefix)) {
        return;
      }

      if (isBot(message)) {
        return;
      }

      if (!isInvalidUser(message)) {
        return;
      }

      if (GuildInWhitelist(message) === null) {
        return;
      }

      const roles: any = [];

      message.member.roles.cache.forEach((role) => {
        const roleFound = {
          roleName: role.name,
          roleId: role.id,
        };

        roles.push(roleFound);
      });

      const messageJson = {
        server: {
          name: message.guild.name,
          id: message.guild.id,
        },
        channel: {
          name: (message.channel as any).name,
          id: message.channel.id,
        },
        user: {
          username: message.author.username,
          id: message.author.id,
        },
        message: message.content,
        roles: roles,
      };

      console.log(`New message recibed: `, messageJson);

      if (message.channel.type === 'dm') {
        console.log(
          `El usuario ${message.author.username} mando un mensaje al bonobot`
        );

        return;
      }

      console.log('New message recived from');

      this.handleCommand(message);
    });
  }

  loadCommands(): void {
    const denunciaCmd = new denuncia();
    const mensajesCmd = new mensajes();
    const temarioCmd = new temario();
    const turnosCmd = new turnos();
    const verificadorCmd = new verificador();
    const serverCmd = new server();

    this.commands = [
      denunciaCmd,
      mensajesCmd,
      temarioCmd,
      turnosCmd,
      verificadorCmd,
      serverCmd,
    ];
  }

  handleCommand(msg: Discord.Message): void {
    const command = msg.content
      .split(' ')[0]
      .replace(BotConfig.config.prefix, '');
    const args = msg.content.split(' ').slice(1);

    console.log('Handle cmd: ', command);
    console.log('Handle args: ', args);

    for (const commandClass of this.commands) {
      try {
        if (!commandClass.isThisCommand(command)) {
          continue;
        }

        commandClass.runCommand(args, msg, this.client);
      } catch (exception) {
        console.log('ERROR EN handle Command');
        throw new Error(exception);
      }
    }
  }
}