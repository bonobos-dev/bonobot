import { Client, Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';

import { memberRolesHaveCommandPermission } from '../utils';
import { ArgumentData, CategoryData, CommandData } from '../interfaces';
import { CategoryUseCases } from '../usecases';

import { Command } from '.';

interface CategoriesDynamicData {
  [guildId: string]: {
    [channelId: string]: {
      channelId?: string;
      messages?: {
        [messageId: string]: {
          messageId?: string;
          categorieId?: string;
          deleted?: boolean;
          lastUpdate?: string;
        };
      };
    };
  };
}

export class CategoryCommand extends Command {
  private readonly commandName = 'Categoría';

  private rolUseCases = new CategoryUseCases();
  private dynamicData: CategoriesDynamicData = {};
  private categoriesData: CategoryData[];
  private client: Client;

  constructor(client?: Client) {
    super();
    console.info('Roles Command Instantiated');
    this.client = client;
    this.start(client);
  }

  private async start(client?: Client): Promise<void> {
    try {
      this.data = await this.getCommandData(this.commandName);
      if (this.data.dynamicData.aviable && this.data.dynamicData.data) this.dynamicData = this.data.dynamicData.data;
      this.commandHealth.started = true;
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (start()). `, exception);
      throw new Error(exception);
    }
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    try {
      if (!(await memberRolesHaveCommandPermission(this.data.prefix, message))) return;
      this.data = await this.getCommandData(this.commandName);
      await message.delete();

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
      if (argumentData.prefix === this.data.prefix) {
        this.executeArgumentInfo(message, commandData);
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

  private async executeArgumentInfo(message: Message, commandData: CommandData) {
    const categoryDataAdquired = await this.getGuildCategoriesData(message.guild.id);
    if (!categoryDataAdquired) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la información de las categorias de este servidor dentro de la base de datos.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    const messagesIdsOfChannel = this.setChannelDynamicData(commandData, message);
    if (messagesIdsOfChannel.length > 0) {
      //console.log('Se encontró información dinámica de los roles dentro de la base de datos... realizando revisión de mensajes...');
      const sameMessagesOnChannel = await this.sameMessagesInChannel(messagesIdsOfChannel, commandData.dynamicData.data, message);
      //console.log('Message on channel are the same in database: ', sameMessagesOnChannel);
      if (sameMessagesOnChannel) {
        //console.log('SAME MESSAGE IN CHANNELS... UPDATE ALL MESSAGES');
        return;
      } else {
        //console.log('NOT SAME MESSAGE IN CHANNELS... REMOVING ALL MESSAGES ON CHANNEL... ');
        await this.removeMessagesInChannel(messagesIdsOfChannel, message);
      }
    }

    for (let i = 0; i < this.categoriesData.length; i++) {
      const selectableEmbed = this.generateInformativeMessageEmbed(this.categoriesData[i], commandData);
      const newMessage = await message.channel.send(selectableEmbed);
      const newMessageDyn = {
        messageId: newMessage.id,
        categorieId: this.categoriesData[i].id,
        deleted: false,
        lastUpdate: new Date(Date.now()).toUTCString(),
      };
      await this.addMessageToDynamicData(newMessage, this.dynamicData, newMessageDyn);
    }

    return;
  }

  private async getGuildCategoriesData(guildId: string): Promise<boolean> {
    const guildRolesInDb = await this.rolUseCases.findByQuery({ guild: guildId });
    if (guildRolesInDb.length === 0) return false;
    else {
      this.categoriesData = guildRolesInDb;
      //console.log('ROLES FOUND AND SAVED');
      return true;
    }
  }

  /** Sets the channel of the dynamic data attribute even empty and return the messages ids on that channel if they exist.*/
  private setChannelDynamicData(commandData: CommandData, message: Message): string[] {
    let commandDynamicData: CategoriesDynamicData = commandData.dynamicData.data;
    if (!commandDynamicData) commandDynamicData = {};

    //Set the dynamicData class property with the db command data if it exist.
    if (commandDynamicData[message.guild.id]) {
      if (commandDynamicData[message.guild.id][message.channel.id]) {
        //console.log('SETTING DYNAMIC DATA: ');
        if (this.dynamicData[message.guild.id]) {
          if (this.dynamicData[message.guild.id][message.channel.id]) {
            this.dynamicData[message.guild.id][message.channel.id] = commandDynamicData[message.guild.id][message.channel.id];
          } else {
            this.dynamicData[message.guild.id] = commandDynamicData[message.guild.id];
            //console.log('DYNAMIC DATA FOUND AND PARAMETER SET');
          }
        } else {
          this.dynamicData[message.guild.id] = {};
          this.dynamicData[message.guild.id] = commandDynamicData[message.guild.id];
          //console.log('DYNAMIC DATA FOUND AND PARAMETER SET');
        }
      } else {
        commandDynamicData[message.guild.id][message.channel.id] = {};
        this.dynamicData[message.guild.id] = {};
        this.dynamicData[message.guild.id][message.channel.id] = commandDynamicData[message.guild.id][message.channel.id];
        this.dynamicData[message.guild.id][message.channel.id] = {
          channelId: null,
          messages: {},
        };
      }
    } else {
      commandDynamicData[message.guild.id] = {};
      this.dynamicData[message.guild.id] = {};
      this.dynamicData[message.guild.id] = commandDynamicData[message.guild.id];
      this.dynamicData[message.guild.id][message.channel.id] = {
        channelId: null,
        messages: {},
      };
    }

    const messageKeys = Object.keys(commandDynamicData[message.guild.id][message.channel.id].messages);
    return messageKeys;
  }

  private async updateDynamicData(data: CategoriesDynamicData): Promise<void> {
    this.data.dynamicData.data = data;
    await this.useCases.edit(this.data);
  }

  private async addMessageToDynamicData(embedMessage: Message, dynamicData: CategoriesDynamicData, newMessageDynamicData: CategoriesDynamicData['guildId']['channelId']['messages']['messageId']) {
    if (!dynamicData[embedMessage.guild.id]) dynamicData[embedMessage.guild.id] = {};
    if (!dynamicData[embedMessage.guild.id][embedMessage.channel.id]) {
      dynamicData[embedMessage.guild.id][embedMessage.channel.id] = {
        channelId: embedMessage.channel.id,
        messages: {},
      };
    }

    if (!dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id]) {
      dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id] = { messageId: embedMessage.id, ...newMessageDynamicData };
    }

    dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id] = { ...dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id], ...newMessageDynamicData };
    //for (let i = 0; i < messageEmbedRoles.length; i++) {}

    this.dynamicData = dynamicData;
    this.data.dynamicData.data = this.dynamicData;
    await this.useCases.edit(this.data);
  }

  private async removeMessagesInChannel(messagesIds: string[], message: Message) {
    const channelData = this.dynamicData[message.guild.id][message.channel.id];

    let someChannelsDeleted = false;
    //console.log('CHANNEL DYN DATA', channelDynamicData.messages);
    for (let i = 0; i < messagesIds.length; i++) if (channelData.messages[messagesIds[i]].deleted) someChannelsDeleted = true;

    //console.log('SOME CHANNELS DELETED?', someChannelsDeleted);
    //const channelcache = await message.channel.messages.fetch({ limit: 10 }, true, true);

    if (someChannelsDeleted) {
      for (let i = 0; i < messagesIds.length; i++) {
        const messageExistInChannel = message.channel.messages.cache.has(messagesIds[i]);
        //console.log('MESSAGE EXIST IN CHANNEL?', messageExistInChannel);
        if (messageExistInChannel) {
          const embedForDelete = await message.channel.messages.fetch(messagesIds[i]);
          await embedForDelete.delete();
        }
        delete channelData.messages[messagesIds[i]];
      }
    }

    this.dynamicData[message.guild.id][message.channel.id] = channelData;
    await this.updateDynamicData(this.dynamicData);
  }

  /** Verifies if the message.ids on the channel still exist on the guild channel and if they are all collecting roles. */
  private async sameMessagesInChannel(messageIdsOfChnanel: string[], dynamicData: CategoriesDynamicData, message: Message): Promise<boolean> {
    let same = true;

    await message.channel.messages.fetch({ limit: 30 });
    //console.log('CHECKING MESSAGES MISMATCHS..', dynamicData[message.guild.id][message.channel.id]);
    for (let i = 0; i < messageIdsOfChnanel.length; i++) {
      const messageExistInChannel = message.channel.messages.cache.has(messageIdsOfChnanel[i]);
      //console.log(`CHANNEL: ${message.channel.id} MESAGE ID: ${messageIdsOfChnanel[i]}. ¿FOUND ON GUILD CHANNEL? ${messageExistInChannel} `);

      if (messageExistInChannel) {
        //console.log(`MESSAGE CHANNEL CHANGED ON DYNAMIC DATA `, dynamicData[message.guild.id][message.channel.id].messages[messageIdsOfChnanel[i]]);
        dynamicData[message.guild.id][message.channel.id].messages[messageIdsOfChnanel[i]].deleted = false;
        continue;
      } else {
        //console.log(`MESSAGE CHANGED ON DYNAMIC DATA `, dynamicData[message.guild.id][message.channel.id].messages[messageIdsOfChnanel[i]]);
        //console.log(`MESSAGE CHANGED ON DYNAMIC DATA ${messageIdsOfChnanel[i]}`);
        dynamicData[message.guild.id][message.channel.id].messages[messageIdsOfChnanel[i]].deleted = true;
        same = false;
      }
    }

    await this.updateDynamicData(dynamicData);
    return same;
  }
  /** Set the dynamicData class property with the db command data if it exist. */

  private getEasterEggMessage(key: string): string {
    if (!this.data.staticData.data.easterEggs) return '';
    if (!this.data.staticData.data.easterEggs[key]) return '';

    const easterEggs = this.data.staticData.data.easterEggs[key];
    const messageCount = easterEggs.messages.length - 1;

    const winner = Math.floor(Math.random() * (easterEggs.probability.level - 0) + 0);
    const messageIndex = Math.floor(Math.random() * (messageCount - 0) + 0);

    if (winner === Math.floor(easterEggs.probability.level / 2)) return easterEggs.messages[messageIndex];

    return '';
  }

  /** Returns the roleTypes that have selectable roles inside */
  private generateInformativeMessageEmbed(categoryData: CategoryData, commandData: CommandData): MessageEmbed {
    const embedData: MessageEmbedOptions = commandData.staticData.data.embedData;
    const embedFields = [];

    for (let i = 0; i < categoryData.channels.length; i++) {
      const channelname = '```' + categoryData.channels[i].text + '```';
      const channeldesc = '```' + categoryData.channels[i].description + '```\n\u200B';
      embedFields.push({ name: channelname, value: channeldesc, inline: false });
    }

    const categoryName = `${categoryData.emoji} ${categoryData.name} ${categoryData.emoji}`;

    const embed = new MessageEmbed({
      title: '```' + categoryName + '```',
      description: `\u200B\n${categoryData.description}\n\u200B`,
      color: embedData.color,
      author: {
        name: embedData.author.name,
        url: embedData.author.url,
        icon_url: embedData.author.icon_url,
      },
      thumbnail: {
        url: embedData.thumbnail.url,
      },
      fields: embedFields,
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();

    return embed;
  }
}
