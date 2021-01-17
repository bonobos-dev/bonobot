import { Client, CollectorFilter, Message, MessageCollector, TextChannel } from 'discord.js';
import { memberRolesHaveCommandPermission } from '../utils';
import { Command } from '.';
import { ArgumentData, CommandData } from '../interfaces';

interface VerificationDynamicData {
  [guildId: string]: {
    channelId?: string;
    isCollectingMessages?: boolean;
    lastMessageCollected?: string;
    lastHealthUpdate?: string;
  };
}

interface VerificationCollectors {
  [guildId: string]: MessageCollector;
}

interface VerificationRoles {
  [guildId: string]: {
    austra?: string;
    chimp?: string;
    bonobo?: string;
    gold?: string;
    mandril?: string;
  };
}

export class VerificationCommand extends Command {
  private readonly commandName = 'Verificador';
  private verificationRoles: VerificationRoles = {};
  private dynamicData: VerificationDynamicData = {};
  private collectors: VerificationCollectors = {};
  private client: Client;

  constructor(client?: Client) {
    super();
    console.info('Verification Command Instantiated');
    this.client = client;
    this.start(client);
  }

  private async start(client?: Client): Promise<void> {
    try {
      this.data = await this.getCommandData(this.commandName);
      if (this.data.dynamicData.aviable && this.data.dynamicData.data) this.dynamicData = this.data.dynamicData.data;
      if (this.data.staticData.data.verificationRoles) this.verificationRoles = this.data.staticData.data.verificationRoles;
      this.commandHealth.started = true;
      await this.startCommandAnalisis(client, this.data);
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (start()). `, exception);
      throw new Error(exception);
    }
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    try {
      if (!(await memberRolesHaveCommandPermission(this.data.prefix, message))) return;
      this.setUseCase();
      this.data = await this.getCommandData(this.commandName);
      await message.delete();

      if (!this.commandHealth.hasData) {
        this.commandHealth.started = false;

        const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo ejecutar el comando. No encuentro los datos de configuración del comando en la base de datos. Cómunicate con un moderador.`;

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
            await this.argumentHandler(argument, message, this.data);
            return;
          } else continue;
        }

        await this.argumentHandler(argument, message, this.data);
      }
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (runCommand). `, exception.message);
    }
  }

  private async argumentHandler(argumentData: ArgumentData, message: Message, commandData: CommandData) {
    try {
      if (argumentData.prefix === commandData.prefix) {
        //console.log('COMMAND VERIFICADOR. No arguments command called, checking parameters', argumentData);
        this.executeVerificador(commandData, message);
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

  /** Set the channel id to the guild dynamic data and remove the old channelId and the message collector for that channel if already exists another one on the data.*/
  private async setGuildDynamicData(commandData: CommandData, message: Message, externalChannel?: string) {
    try {
      //console.log('SETTING DYNAMIC DATA');
      let commandDynamicData: VerificationDynamicData = commandData.dynamicData.data;
      let channelId: string;
      if (externalChannel) {
        const channelExists = message.guild.channels.cache.has(externalChannel);
        //console.log('EXTERNAL CHANNEL EXISTS');

        if (!channelExists) {
          const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, el canal que ingresaste no existe en el servidor.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        } else channelId = externalChannel;
      } else channelId = message.channel.id;

      //console.log('CURRENT CHANNEL ID: ', channelId);
      if (!commandDynamicData) {
        //console.log('NOT COMMAND DYNAMIC DATA IN DB: ', channelId);
        commandDynamicData = {};
        commandDynamicData[message.guild.id] = {
          channelId: channelId,
          isCollectingMessages: false,
        };
        return;
      } else if (commandDynamicData[message.guild.id]) {
        //console.log('COMMAND DYNAMIC DATA OF GUILD FOUND IN DB: ', commandDynamicData[message.guild.id]);
        if (commandDynamicData[message.guild.id].channelId !== channelId) {
          if (commandDynamicData[message.guild.id].isCollectingMessages && this.collectors[message.guild.id]) {
            this.collectors[message.guild.id].stop();
            this.collectors[message.guild.id] = null;
          }
          commandDynamicData[message.guild.id] = {
            channelId: channelId,
            isCollectingMessages: false,
          };
        } else {
          if (!commandDynamicData[message.guild.id].isCollectingMessages) {
            //console.log('IS NOT COLLECTING MESSAGES');
          } //console.log('IS COLLECTING MESSAGES, NO CHANGES');
        }
      } else {
        commandDynamicData[message.guild.id] = {
          channelId: channelId,
          isCollectingMessages: false,
        };
      }
      this.dynamicData = commandDynamicData;
      await this.updateDynamicData(this.dynamicData);
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (setGuildDynamicData). `, exception);
      throw new Error(exception);
    }
  }

  private async verivyVerificationRoles(verificationRoles: VerificationRoles, message: Message): Promise<boolean> {
    const guild = message.guild;
    const roleKeys = Object.keys(verificationRoles[message.guild.id]);
    let allRolesExist = true;

    for (let i = 0; i < roleKeys.length; i++) {
      const currentRole = guild.roles.cache.has(roleKeys[i]);
      if (!currentRole) allRolesExist = false;
    }

    return allRolesExist;
  }

  private async updateDynamicData(data: VerificationDynamicData): Promise<void> {
    this.data.dynamicData.data = data;
    await this.useCases.edit(this.data);
  }

  private async startCommandAnalisis(client: Client, commandData: CommandData) {
    if (!this.data.dynamicData.data) {
      //console.log('NO DINAMIC DATA FOUND ON DB FOR ROLES COMMAND');
    } else {
      //console.log('DINAMIC DATA FOUND ..', this.data.dynamicData.data);

      const dynamicData: VerificationDynamicData = this.data.dynamicData.data;
      const guildIds = Object.keys(dynamicData);
      for (let i = 0; i < guildIds.length; i++) {
        const currentChannel = (await client.channels.fetch(dynamicData[guildIds[i]].channelId, true, true)) as TextChannel;
        const chimpanceMessages = commandData.staticData.data.verifyMessages as string[];
        const bonoboMessages = commandData.staticData.data.easterEggs.verifyMessages.bonobo.messages as string[];
        const goldenMessages = commandData.staticData.data.easterEggs.verifyMessages.golden.messages as string[];

        //console.log('DYNAMIC DATA:', dynamicData);

        const collectorFilter: CollectorFilter = () => true;

        const messageCollector = currentChannel.createMessageCollector(collectorFilter);
        dynamicData[guildIds[i]].isCollectingMessages = true;
        dynamicData[guildIds[i]].channelId = currentChannel.id;
        this.collectors[guildIds[i]] = messageCollector;
        const verificationRoles = this.verificationRoles[guildIds[i]];

        messageCollector.on('collect', async (m: Message) => {
          if (m.author.bot) return;
          const content = m.content.toLocaleLowerCase();
          await m.delete();

          if (!m.member.roles.cache.has(verificationRoles.austra)) {
            const messageString = `⚠️ Lo siento ${m.member.nickname ? m.member.nickname : m.author.username}, solo puedo verificar usuarios con el rol de Australopithecus`;
            this.sendTemporalTextMessage(messageString, m.channel, 4000);
            return;
          }

          let chimpCheck = false;
          let bonoboCheck = false;
          let luckyCheck = false;

          for (let i = 0; i < chimpanceMessages.length; i++) if (content === chimpanceMessages[i]) chimpCheck = true;
          for (let i = 0; i < bonoboMessages.length; i++) if (content === bonoboMessages[i]) bonoboCheck = true;
          for (let i = 0; i < goldenMessages.length; i++) if (content === goldenMessages[i]) luckyCheck = true;

          if (chimpCheck) {
            await m.member.roles.add(verificationRoles.chimp);
            await m.member.roles.remove(verificationRoles.austra);
            await m.author.send(this.getRandomMessage(commandData.staticData.data.wellcomeMessages));
          }

          if (bonoboCheck) {
            if (this.getEasterEggVerificationWinner('bonobo')) {
              await m.member.roles.add(verificationRoles.bonobo);
            } else {
              await m.member.roles.add(verificationRoles.chimp);
            }
            await m.member.roles.remove(verificationRoles.austra);
            await m.author.send(this.getRandomMessage(commandData.staticData.data.wellcomeMessages));
          }

          if (luckyCheck) {
            if (this.getEasterEggVerificationWinner('golden')) {
              await m.member.roles.add(verificationRoles.bonobo);
              await m.member.roles.add(verificationRoles.gold);
            } else {
              await m.member.roles.add(verificationRoles.chimp);
              await m.member.roles.add(verificationRoles.mandril);
            }
            await m.member.roles.remove(verificationRoles.austra);
            await m.author.send(this.getRandomMessage(commandData.staticData.data.wellcomeMessages));
          }

          dynamicData[m.guild.id].lastMessageCollected = new Date(Date.now()).toUTCString();
          dynamicData[m.guild.id].isCollectingMessages = true;
          this.updateDynamicData(dynamicData);
        });

        messageCollector.on('end', async () => {
          const messageString = `⚠️ El recolector de mensajes ha parado.`;
          this.sendTextMessage(messageString, currentChannel);
          dynamicData[guildIds[i]].isCollectingMessages = true;
          this.updateDynamicData(dynamicData);
        });
      }
    }
  }

  private async executeVerificador(commandData: CommandData, message: Message) {
    const allRoles = this.verivyVerificationRoles(this.verificationRoles, message);
    if (!allRoles) {
      const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar los roles de verificación en los datos del comando.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }
    await this.setGuildDynamicData(commandData, message);

    const chimpanceMessages = commandData.staticData.data.verifyMessages as string[];
    const bonoboMessages = commandData.staticData.data.easterEggs.verifyMessages.bonobo.messages as string[];
    const goldenMessages = commandData.staticData.data.easterEggs.verifyMessages.golden.messages as string[];

    //console.log('DYNAMIC DATA:', this.dynamicData);

    const collectorFilter: CollectorFilter = () => true;
    if (this.collectors[message.guild.id]) this.collectors[message.guild.id].stop();
    const messageCollector = message.channel.createMessageCollector(collectorFilter);
    this.dynamicData[message.guild.id].channelId = message.channel.id;
    this.dynamicData[message.guild.id].isCollectingMessages = true;
    this.collectors[message.guild.id] = messageCollector;
    const verificationRoles = this.verificationRoles[message.guild.id];

    messageCollector.on('collect', async (m: Message) => {
      if (m.author.bot) return;
      const content = m.content.toLocaleLowerCase();
      await m.delete();

      if (!m.member.roles.cache.has(verificationRoles.austra)) {
        const messageString = `⚠️ Lo siento ${m.member.nickname ? m.member.nickname : m.author.username}, solo puedo verificar usuarios con el rol de Australopithecus`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }

      let chimpCheck = false;
      let bonoboCheck = false;
      let luckyCheck = false;

      for (let i = 0; i < chimpanceMessages.length; i++) if (content === chimpanceMessages[i]) chimpCheck = true;
      for (let i = 0; i < bonoboMessages.length; i++) if (content === bonoboMessages[i]) bonoboCheck = true;
      for (let i = 0; i < goldenMessages.length; i++) if (content === goldenMessages[i]) luckyCheck = true;

      if (chimpCheck) {
        await m.member.roles.add(verificationRoles.chimp);
        await m.member.roles.remove(verificationRoles.austra);
        await m.author.send(this.getRandomMessage(commandData.staticData.data.wellcomeMessages));
      }

      if (bonoboCheck) {
        if (this.getEasterEggVerificationWinner('bonobo')) {
          await m.member.roles.add(verificationRoles.bonobo);
        } else {
          await m.member.roles.add(verificationRoles.chimp);
        }
        await m.member.roles.remove(verificationRoles.austra);
        await m.author.send(this.getRandomMessage(commandData.staticData.data.wellcomeMessages));
      }

      if (luckyCheck) {
        if (this.getEasterEggVerificationWinner('golden')) {
          await m.member.roles.add(verificationRoles.bonobo);
          await m.member.roles.add(verificationRoles.gold);
        } else {
          await m.member.roles.add(verificationRoles.chimp);
          await m.member.roles.add(verificationRoles.mandril);
        }
        await m.member.roles.remove(verificationRoles.austra);
        await m.author.send(this.getRandomMessage(commandData.staticData.data.wellcomeMessages));
      }

      this.dynamicData[message.guild.id].lastMessageCollected = new Date(Date.now()).toUTCString();
      this.dynamicData[message.guild.id].isCollectingMessages = true;
      this.updateDynamicData(this.dynamicData);
    });

    messageCollector.on('end', async () => {
      const messageString = `⚠️ El recolector de mensajes ha parado.`;
      this.sendTextMessage(messageString, message.channel);
      this.dynamicData[message.guild.id].isCollectingMessages = true;
      this.updateDynamicData(this.dynamicData);
    });
  }

  private getRandomMessage(messages: string[]): string {
    const randomIndex = Math.floor(Math.random() * (messages.length - 1 - 0) + 0);
    return messages[randomIndex];
  }

  private getEasterEggVerificationWinner(key: string): boolean {
    if (!this.data.staticData.data.easterEggs) return false;
    if (!this.data.staticData.data.easterEggs.verifyMessages) return false;
    const easterEggData = this.data.staticData.data.easterEggs.verifyMessages[key];
    const winner = Math.floor(Math.random() * (easterEggData.probability.level - 0) + 0);
    if (winner === Math.floor(easterEggData.probability.level / 2)) return true;
    else return false;
  }
}
