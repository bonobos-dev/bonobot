import { Message, MessageEmbed, MessageEmbedOptions, TextChannel } from 'discord.js';
import { memberRolesHaveCommandPermission } from '../utils';
import { Command } from '.';
import { ArgumentData } from '../interfaces';

interface messageStaticData {
  aviable?: boolean;
  data?: {
    embedData?: {
      [embedKey: string]: MessageEmbedOptions;
    };
  };
}

export class MessageCommand extends Command {
  private readonly commandName = 'Mensajes';
  private staticData: messageStaticData = {};

  constructor() {
    super();
    console.info('Mensajes Command Instantiated');
    this.start();
  }

  private async start(): Promise<void> {
    try {
      this.data = await this.getCommandData(this.commandName);
      this.commandHealth.started = true;
      if (this.data.staticData.aviable && this.data.staticData.data) this.staticData = this.data.staticData;
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (start()). `, exception);
      throw new Error(exception);
    }
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    try {
      if (!(await memberRolesHaveCommandPermission(this.data.prefix, message))) return;
      this.data = await this.getCommandData(this.commandName);

      if (!this.commandHealth.hasData) {
        this.commandHealth.started = false;

        const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo ejecutar el comando. No encuentro los datos de configuración en la base de datos. Cómunicate con un moderador.`;

        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }

      const argumentData = this.collectCommandArguments(commandContent, this.data);

      for (let n = 0; n < argumentData.length; n++) {
        const argument = argumentData[n];

        if (argument.error) {
          const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, haz utilizado mal el comando. ${argument.errorMessage}`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }

        if (argument.prefix === this.data.prefix) {
          if (argument.params.length === 0) {
            await this.argumentHandler(argument, message);
            return;
          } else continue;
        }
        await this.argumentHandler(argument, message);
      }
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (runCommand). `, exception.message);
    }
  }

  private async argumentHandler(argumentData: ArgumentData, message: Message) {
    try {
      if (argumentData.prefix === this.data.prefix) {
        await message.delete();
        const messageString = `Bienvenido ${message.member.nickname ? message.member.nickname : message.author.username} al comando (${this.commandName}). Para mas informacion utiliza el argumento help seguido del comando.`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }
      if (argumentData.prefix === 'send') {
        await message.delete();
        if (this.data.staticData.aviable && this.data.staticData.data) this.staticData = this.data.staticData;

        let embedKey: string = null;
        let mention: string = null;
        let channel: string = null;
        if (argumentData.params.length > 3) {
          const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, el argumento 'send' solo puede contener cómo máximo 3 parametros. Ej.(send mensaje1 @mention #channel).`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        } else if (argumentData.params.length === 3) {
          embedKey = argumentData.params[0];
          mention = argumentData.params[1];
          channel = argumentData.params[2];
        } else if (argumentData.params.length === 2) {
          embedKey = argumentData.params[0];
          mention = argumentData.params[1];
        } else if (argumentData.params.length === 1) {
          embedKey = argumentData.params[0];
        }

        const keyExists = this.validateEmbedKey(embedKey, this.staticData);
        //console.log(argumentData);

        if (!keyExists) {
          const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la información del mensaje que estás solicitando.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }

        const validMention = this.validateMention(mention, message);
        if (!validMention && mention !== null) {
          const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar el rol que estás mencionando dentro del servidor.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }
        //console.log('VALID MENTION?', validMention);

        const validChannel = this.validateChannel(channel, message);
        //console.log('VALID CHANNEL?', validChannel);

        let targetChannel = message.channel;
        if (validChannel) {
          const id = this.findItemsInsideSymbols(channel, '#', '>')[0];
          targetChannel = (await message.client.channels.fetch(id)) as TextChannel;
        } else if (!validChannel && channel !== null) {
          const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar el canal al que quieres mandar el mensaje.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }

        const embedData = this.staticData.data.embedData[embedKey];
        const embedMessage = this.createEmbed(embedData);

        await targetChannel.send(`${validMention ? mention : ''}`, embedMessage);

        return;
      }
      if (argumentData.prefix === 'help') {
        await message.delete();
        (await message.channel.send(this.helpRequested(this.data))).delete({
          timeout: 25000,
        });
        return;
      }

      if (argumentData.prefix === 'health') {
        await message.delete();
        (await message.channel.send(this.healthRequested(this.data))).delete({
          timeout: 25000,
        });
        return;
      }
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (argumentHandler). `, exception);
      throw new Error(exception);
    }
  }

  private validateMention(mention: string, message: Message): boolean {
    if (mention === null) return false;
    const id = this.findItemsInsideSymbols(mention, '&', '>')[0];
    if (message.guild.roles.cache.has(id)) return true;
    else return false;
  }

  private validateChannel(channel: string, message: Message): boolean {
    if (channel === null) return false;
    const id = this.findItemsInsideSymbols(channel, '#', '>')[0];
    if (message.guild.channels.cache.has(id)) return true;
    else return false;
  }

  private createEmbed(embedData: MessageEmbedOptions): MessageEmbed {
    const template = new MessageEmbed(embedData).setTimestamp();
    return template;
  }

  private validateEmbedKey(key: string, staticData: messageStaticData): boolean {
    const kesyInData = Object.keys(staticData.data.embedData);
    if (kesyInData.length === 0) return false;

    const foundKey = kesyInData.filter((keyInData) => keyInData === key);

    if (foundKey.length === 0) return false;
    else if (foundKey.length > 1) return false;
    else if (foundKey.length === 1) return true;
  }
}
