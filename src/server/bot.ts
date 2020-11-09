import * as Discord from 'discord.js';
import * as BotConfig from './botConfig';
import { MigBotCommand } from './botApi';
import {
  GuildInWhitelist,
  isBot,
  isInvalidUser,
} from './utils/botValidation';

import denuncia from './bot-commands/denuncia';
import mensajes from './bot-commands/mensajes';
import temario from './bot-commands/temario';
import turnos from './bot-commands/turnos';
import verificador from './bot-commands/verificador';
import server from './bot-commands/server';

const client = new Discord.Client({ fetchAllMembers: true });
const commands: MigBotCommand[] = [];

/*old
const LoadCommands = ( commandsPath:string ): void => {

    if( !BotConfig.config || (BotConfig.config.commands).length === 0 ) {    return    }

    for (const commandObj of BotConfig.config.commands){

        const commandClass =  require(`${commandsPath}/${commandObj.command}`).default;

        const command =  new commandClass() as MigBotCommand;

        commands.push(command);

    }
    //console.log('Commands loaded: ', commands);
}
*/

const LoadCommands = (): void => {
  const denunciaCmd = new denuncia() as MigBotCommand;
  const mensajesCmd = new mensajes() as MigBotCommand;
  const temarioCmd = new temario() as MigBotCommand;
  const turnosCmd = new turnos() as MigBotCommand;
  const verificadorCmd = new verificador() as MigBotCommand;
  const serverCmd = new server() as MigBotCommand;
  //const cleanrolesCmd = new cleanroles() as MigBotCommand;

  const comandosClases = [
    denunciaCmd,
    mensajesCmd,
    temarioCmd,
    turnosCmd,
    verificadorCmd,
    serverCmd,
  ];

  if (!BotConfig.config || BotConfig.config.commands.length === 0) {
    return;
  }

  for (const commandClass of comandosClases) {
    commands.push(commandClass);
  }
};

const handleCommand = async (msg: Discord.Message) => {
  const command = msg.content.split(' ')[0].replace(BotConfig.config.prefix, '');
  const args = msg.content.split(' ').slice(1);

  console.log('Handle cmd: ', command);
  console.log('Handle args: ', args);

  for (const commandClass of commands) {
    try {
      if (!commandClass.isThisCommand(command)) {
        continue;
      }

      commandClass.runCommand(args, msg, client);
    } catch (exception) {
      console.log('ERROR EN handle Command');
      throw new Error(exception);
    }
  }
};

const initBot = (): void => {
  LoadCommands();


  client.on('message', async (message) => {
    //sconsole.log( 'Message content: ', message );

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

    handleCommand(message);
  });

  ///console.log('TOKEN : ', process.env.DISCORD_TOKEN )
  client.login(process.env.DISCORD_TOKEN);
};

export { initBot };
