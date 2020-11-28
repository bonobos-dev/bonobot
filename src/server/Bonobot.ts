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
      console.log('Bonobot is ready on discord!!!!!!!!!');
    });
  }

  apply(): void {
    this.client.on('message', async (message: Message) => {
      if (!message.content.startsWith(config.prefix)) {
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

  handleCommand(msg: Message): void {
    const command = msg.content
      .split(' ')[0]
      .replace(config.prefix, '');
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
