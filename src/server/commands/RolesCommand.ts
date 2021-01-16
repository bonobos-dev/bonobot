import { Client, CollectorFilter, Message, MessageCollector, MessageEmbed, MessageEmbedOptions, TextChannel } from 'discord.js';

import { memberRolesHaveCommandPermission, ignoreUserId } from '../utils';
import { ArgumentData, CommandData, RoleData } from '../interfaces';
import { RoleUseCases } from '../usecases';

import { Command } from '.';

interface MessageEmbedRoles {
  id?: string;
  name?: string;
  emoji?: string;
  selectable?: boolean;
}

interface RolesDynamicData {
  [guildId: string]: {
    [channelId: string]: {
      channelId?: string;
      messages?: {
        [messageId: string]: {
          messageId?: string;
          deleted?: boolean;
          isCollectingReactions?: boolean;
          lastUpdate?: string;
          roleType?: string;
          isSelectable?: boolean;
          roles?: MessageEmbedRoles[];
          reactionInfo?: Array<{
            role?: {
              id?: string;
              emoji?: string;
            };
            action?: string;
            date?: string;
            username?: string;
            nickname?: string;
            id?: string;
          }>;
        };
      };
    };
  };
}

interface RolesStaticData {
  roleCategories?: {
    [roleType: string]: {
      description?: string;
    };
  };
  embedData?: MessageEmbedOptions;
  easteEggs?: any;
}

export class RolesCommand extends Command {
  private readonly commandName = 'Roles';

  private rolUseCases = new RoleUseCases();

  private staticData: RolesStaticData = {};
  private dynamicData: RolesDynamicData = {};
  private rolesData: RoleData[];
  private client: Client;
  private channelCollectors: {
    [channelId: string]: MessageCollector;
  } = {};

  constructor(client?: Client) {
    super();
    console.info('Roles Command Instantiated');
    this.client = client;
    this.start(client);
  }

  private async start(client?: Client): Promise<void> {
    try {
      this.data = await this.getCommandData(this.commandName);
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
            await this.argumentHandler(argument, message, this.data);
            return;
          } else continue;
        }

        await this.argumentHandler(argument, message, this.data);
      }
    } catch (exception) {
      //console.info(`BONOBOT ERROR at command (${this.commandName}) executing (runCommand). `, exception.message);
    }
  }

  private async argumentHandler(argumentData: ArgumentData, message: Message, commandData: CommandData) {
    try {
      if (argumentData.prefix === this.data.prefix) {
        await message.delete();
        await this.startCommandAnalisis(this.client, this.data);
        const messageString = `Bienvenido ${message.member.nickname ? message.member.nickname : message.author.username} al comando (roles). Para mas informacion utiliza el argumento help seguido del comando.`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }
      if (argumentData.prefix === 'select') {
        this.executeArgumentSelect(message, commandData);
      }
      if (argumentData.prefix === 'info') {
        this.executeArgumentInfo(message, commandData);
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
      //console.info(`BONOBOT ERROR at command (${this.commandName}) executing (argumentHandler). `, exception);
      throw new Error(exception);
    }
  }

  private async executeArgumentSelect(message: Message, commandData: CommandData) {
    await message.delete();
    const roleDataAdquired = await this.getRolesData(message.guild.id);
    if (!roleDataAdquired) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la información de los roles dentro de la base de datos.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    const staticDataSet = this.setStaticData(commandData);
    if (!staticDataSet) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la información estática de los roles dentro de los datos del comando.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    const dynamicDataSet = this.setDynamicData(commandData, message);
    let checkEmpty;
    if (dynamicDataSet) checkEmpty = this.classifyExistingMessagesInChannel(message, this.dynamicData);

    if (dynamicDataSet && checkEmpty.selectableMesagesIds.length !== 0) {
      //console.log('Se encontró información dinámica de los roles dentro de la base de datos... realizando revisión de mensajes...');
      const sameMessagesOnChannel = await this.sameMessagesInChannel(this.dynamicData, message, true);
      //console.log('Message on channel are the same in database: ', sameMessagesOnChannel);
      if (sameMessagesOnChannel) {
        const messages = this.classifyExistingMessagesInChannel(message, this.dynamicData);
        //console.log('SAME MESSAGE IN CHANNELS... CHEK IF THEY ARE COLLECTING');
        //console.log('Classified messages on channel check: ', messages);
        await this.repareNonCollectingMessages(messages.selectableMesagesIds, message, this.dynamicData);
      } else {
        const messages = this.classifyExistingMessagesInChannel(message, this.dynamicData);
        //console.log('NOT SAME MESSAGE IN CHANNELS... REMOVING SELECTABLE MESSAGES ON CHANNEL AND MIGRATING DATA... ');
        await this.removeAnsRestoreMessagesInChannel(messages.selectableMesagesIds, message, true);
      }
      return;
    }

    //console.log('DINAMIC DATA PARAMETER NOT SET, NOTHING IN THE DB FOR THIS CHANNEL');
    const typesWithSelectableRoles = this.getSelectableTypes(this.staticData, this.dynamicData, message, this.rolesData);

    //console.log('Selectable roles: ', typesWithSelectableRoles);
    if (typesWithSelectableRoles.length === 0) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar roles seleccionables dentro de los datos de este servidor.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    for (let i = 0; i < typesWithSelectableRoles.length; i++) {
      //console.log('SPAWNING NEW EMBED...: ', typesWithSelectableRoles[i]);
      const selectableEmbed = this.generateSelectableMessageEmbed(this.staticData, typesWithSelectableRoles[i]);
      const newMessage = await message.channel.send(selectableEmbed.embed);
      await this.addMessageToDynamicData(newMessage, this.dynamicData, selectableEmbed.messageDynamicData);
      await this.startReactionCollector(newMessage);
    }

    //await this.updateDynamicDataRoleCategories(message, this.dynamicData, this.staticData, this.rolesData);

    return;
  }

  private async executeArgumentInfo(message: Message, commandData: CommandData) {
    await message.delete();
    const roleDataAdquired = await this.getRolesData(message.guild.id);
    if (!roleDataAdquired) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la información de los roles dentro de la base de datos.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    const staticDataSet = this.setStaticData(commandData);
    if (!staticDataSet) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la información estática de los roles dentro de los datos del comando.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    const dynamicDataSet = this.setDynamicData(commandData, message);
    let checkEmpty;
    if (dynamicDataSet) checkEmpty = this.classifyExistingMessagesInChannel(message, this.dynamicData);
    if (dynamicDataSet && checkEmpty.informativeMesagesIds.length !== 0) {
      //console.log('Se encontró información dinámica de los roles dentro de la base de datos... realizando revisión de mensajes...');
      const sameMessagesOnChannel = await this.sameMessagesInChannel(this.dynamicData, message, false);
      //console.log('Message on channel are the same in database: ', sameMessagesOnChannel);
      if (sameMessagesOnChannel) {
        const messages = this.classifyExistingMessagesInChannel(message, this.dynamicData);
        //console.log('SAME MESSAGE IN CHANNELS... CHEK IF THEY ARE COLLECTING');
        //console.log('Classified messages on channel check: ', messages);
        //await this.repareNonCollectingMessages(messages.selectableMesagesIds, message, this.dynamicData);
      } else {
        const messages = this.classifyExistingMessagesInChannel(message, this.dynamicData);
        //console.log('NOT SAME MESSAGE IN CHANNELS... REMOVING SELECTABLE MESSAGES ON CHANNEL AND MIGRATING DATA... ');
        await this.removeAnsRestoreMessagesInChannel(messages.informativeMesagesIds, message, false);
      }
      return;
    }

    //console.log('DINAMIC DATA PARAMETER NOT SET, NOTHING IN THE DB FOR THIS CHANNEL');
    const roleTypesInStaticData = Object.keys(this.staticData.roleCategories);

    //console.log('Selectable roles: ', roleTypesInStaticData);
    if (roleTypesInStaticData.length === 0) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar roles seleccionables dentro de los datos de este servidor.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    for (let i = 0; i < roleTypesInStaticData.length; i++) {
      //console.log('SPAWNING NEW EMBED...: ', roleTypesInStaticData[i]);
      const selectableEmbed = this.generateInformativeMessageEmbed(this.staticData, roleTypesInStaticData[i]);
      const newMessage = await message.channel.send(selectableEmbed.embed);
      await this.addMessageToDynamicData(newMessage, this.dynamicData, selectableEmbed.messageDynamicData);
      //await this.startReactionCollector(newMessage);
    }

    //await this.updateDynamicDataRoleCategories(message, this.dynamicData, this.staticData, this.rolesData);

    return;
  }

  private async startMessageCollectorOnChannel(message: Message, dynamicData: RolesDynamicData) {
    const channel = message.channel;
    const dynamicChannelData = dynamicData[message.guild.id][channel.id];
    const messagesIds = Object.keys(dynamicChannelData.messages);

    const messagefilter: CollectorFilter = (m) => messagesIds.includes(m.id);

    this.channelCollectors[channel.id] = channel.createMessageCollector(messagefilter, { dispose: true, max: 20, maxProcessed: 20 });

    this.channelCollectors[channel.id].on('dispose', async (m) => {
      try {
        //console.log('SOMEONE DELETED A MESSAGE... ', m);
        const messages = this.classifyExistingMessagesInChannel(message, this.dynamicData);
        await this.removeAnsRestoreMessagesInChannel(messages.selectableMesagesIds, message, true);
        return;
      } catch (exception) {
        //console.info(`BONOBOT ERROR at command (${this.commandName}) executing (MessageCollector disposing) on channel ${m.channel.id} on guild ${m.guild.id}).`, exception);
        throw new Error(exception);
      }
    });

    this.channelCollectors[channel.id].on('end', async (collection) => {
      try {
        const messageString = `⚠️ ⚠️ He dejado de supervisar los mensajes de este canal, no podré saber si alguien borra algún mensaje.`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      } catch (exception) {
        //console.info(`BONOBOT ERROR at command (${this.commandName}) executing (MessageCollector ending) on channel ${message.channel.id} on guild ${message.guild.id}).`, exception);
        throw new Error(exception);
      }
    });
  }

  private async getRolesData(guildId: string): Promise<boolean> {
    const guildRolesInDb = await this.rolUseCases.findByQuery({ guild: guildId });
    if (guildRolesInDb.length === 0) return false;
    else {
      this.rolesData = guildRolesInDb;
      //console.log('ROLES FOUND AND SAVED');
      return true;
    }
  }

  private async updateStaticData(data: RolesStaticData): Promise<void> {
    this.data.staticData.data = data;
    await this.useCases.edit(this.data);
  }

  private async updateDynamicData(data: RolesDynamicData): Promise<void> {
    this.data.dynamicData.data = data;
    await this.useCases.edit(this.data);
  }

  private async addMessageToDynamicData(embedMessage: Message, dynamicData: RolesDynamicData, newMessageDynamicData: RolesDynamicData['guildId']['channelId']['messages']['messageId']) {
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

  private async updateDynamicDataMessag(embedMessage: Message, messageDynamicData: RolesDynamicData['guildId']['channelId']['messages']['messageId']): Promise<boolean> {
    if (embedMessage.id !== messageDynamicData.messageId) {
      //console.info('MESSAGES IDS MISSMATCH UPDATING DYNAMIC DATA. REQUIRE REVISION');
    }
    if (!this.dynamicData[embedMessage.guild.id]) return false;
    if (!this.dynamicData[embedMessage.guild.id][embedMessage.channel.id]) return false;
    if (!this.dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id]) return false;
    if (!this.dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[messageDynamicData.messageId]) return false;

    this.dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id] = messageDynamicData;

    this.data.dynamicData.data = this.dynamicData;
    await this.useCases.edit(this.data);
    return true;
  }

  private async startReactionCollector(embedMessage: Message) {
    const messageDynamicData = this.dynamicData[embedMessage.guild.id][embedMessage.channel.id].messages[embedMessage.id];

    const embedRoles = messageDynamicData.roles;

    //console.log('EMBED ROLES: ', embedRoles);

    const collectorFilter: CollectorFilter = (reaction) => {
      const currentEmoji = embedRoles.filter((role) => role.emoji === reaction.emoji.name);

      if (currentEmoji.length === 0) return false;
      else if (currentEmoji.length === 1) return true;
      else if (currentEmoji.length > 1) return false;
      else return false;
    };

    if (embedMessage.reactions.cache.array().length !== embedRoles.length) {
      await embedMessage.reactions.removeAll();
      for (let i = 0; i < embedRoles.length; i++) await embedMessage.react(embedRoles[i].emoji);
    }
    await embedMessage.awaitReactions(collectorFilter, { time: 1 });
    const reactionCollector = embedMessage.createReactionCollector(collectorFilter);

    reactionCollector.on('collect', async (reaction, user) => {
      try {
        messageDynamicData.isCollectingReactions = true;
        messageDynamicData.lastUpdate = new Date(Date.now()).toUTCString();
        if (!ignoreUserId(user.id)) await reaction.users.remove(user.id);
        const member = await embedMessage.guild.members.fetch(user.id);
        //console.log(`Reaction added: `, reaction.emoji.name);
        //console.log('User: ', user.username);

        const currentEmoji = embedRoles.filter((role) => role.emoji === reaction.emoji.name);

        if (currentEmoji.length === 0 || currentEmoji.length > 1) {
          const messageString = `🐒 Lo siento ${member.nickname ? member.nickname : user.username}, por el momento no puedo otorgarte este rol.`;
          this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);

          return;
        } else if (currentEmoji.length === 1) {
          const roleId = currentEmoji[0].id;

          const roleExistOnGuild = embedMessage.guild.roles.cache.has(roleId);

          if (!roleExistOnGuild) {
            const messageString = `🐒 Lo siento ${member.nickname ? member.nickname : user.username}, el rol ha sido modificado y por el momento no puedo otorgarlo. Por favor intenta de nuevo más tarde.`;
            this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);

            return;
          }

          const roleExistOnMember = member.roles.cache.has(roleId);
          const reactionInfo = {
            role: {
              id: roleId,
              emoji: reaction.emoji.name,
            },
            action: null,
            date: new Date(Date.now()).toUTCString(),
            username: user.username,
            nickname: member.nickname,
            id: user.id,
          };

          if (roleExistOnMember) {
            await member.roles.remove(roleId);
            reactionInfo.action = 'removed';
          } else {
            await member.roles.add(roleId);
            reactionInfo.action = 'added';
          }
          messageDynamicData.reactionInfo.push(reactionInfo);
          const dataUpdated = await this.updateDynamicDataMessag(embedMessage, messageDynamicData);

          if (!dataUpdated) {
            const messageString = `🐒 Lo siento ${member.nickname ? member.nickname : user.username}, algo ha salido mal al actualizar los datos.`;
            this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);
            return;
          }
          return;
        }
      } catch (exception) {
        //console.info(`BONOBOT ERROR at command (${this.commandName}) executing (reactionCollector collecting on message ${embedMessage.id} on channel ${embedMessage.channel.id} on guild ${embedMessage.guild.id}).`, exception);
        throw new Error(exception);
      }
    });

    reactionCollector.on('end', async (collected, reason) => {
      try {
        //console.log('REASON OF COLECTOR STOPILNG:', reason);
        messageDynamicData.isCollectingReactions = false;
        messageDynamicData.lastUpdate = new Date(Date.now()).toUTCString();
        const dataUpdated = await this.updateDynamicDataMessag(embedMessage, messageDynamicData);
        if (!dataUpdated) {
          const messageString = `🐒 El recolector de reacciones ha parado. Para roles (${messageDynamicData.roleType}).`;
          this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);
          return;
        }
        return;
      } catch (exception) {
        //console.info(`BONOBOT ERROR at command (${this.commandName}) executing (reactionCollector ending on message ${embedMessage.id} on channel ${embedMessage.channel.id} on guild ${embedMessage.guild.id}).`, exception);
        throw new Error(exception);
      }
    });
  }

  private async removeAnsRestoreMessagesInChannel(messagesIds: string[], message: Message, selectable: boolean) {
    const channelDynamicData = this.dynamicData[message.guild.id][message.channel.id];
    const channelDynamicDataMessageKeys = Object.keys(this.dynamicData[message.guild.id][message.channel.id].messages);

    const reactionInfoForMessage: { [roleType: string]: RolesDynamicData['guildId']['channelId']['messages']['messageId']['reactionInfo'] } = {};

    const validatedMessagesKeys: string[] = [];
    channelDynamicDataMessageKeys.map((key) => {
      for (let n = 0; n < messagesIds.length; n++) {
        if (key === messagesIds[n]) validatedMessagesKeys.push(key);
      }
    });

    //console.log('CHANNEL DYN DATA', channelDynamicData.messages);
    for (let i = 0; i < validatedMessagesKeys.length; i++) {
      if (channelDynamicData.messages[validatedMessagesKeys[i]].deleted) {
        //console.log('MESSAGE ALREADY DELETED ');
        const oldKeyRoleType = channelDynamicData.messages[validatedMessagesKeys[i]].roleType;
        reactionInfoForMessage[oldKeyRoleType] = channelDynamicData.messages[validatedMessagesKeys[i]].reactionInfo;
        delete channelDynamicData.messages[validatedMessagesKeys[i]];
      } else {
        const embedForDelete = await message.channel.messages.fetch(validatedMessagesKeys[i]);
        await embedForDelete.delete();
        const oldKeyRoleType = channelDynamicData.messages[validatedMessagesKeys[i]].roleType;
        reactionInfoForMessage[oldKeyRoleType] = channelDynamicData.messages[validatedMessagesKeys[i]].reactionInfo;
        delete channelDynamicData.messages[validatedMessagesKeys[i]];
      }
    }

    if (selectable) {
      const typesWithSelectableRoles = this.getSelectableTypes(this.staticData, this.dynamicData, message, this.rolesData);

      //console.log('Selectable roles: ', typesWithSelectableRoles);
      if (typesWithSelectableRoles.length === 0) {
        const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar roles seleccionables dentro de los datos de este servidor.`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }

      for (let i = 0; i < typesWithSelectableRoles.length; i++) {
        //console.log('RESTORING MESSAGE EMBED...: ', typesWithSelectableRoles[i]);
        const selectableEmbed = this.generateSelectableMessageEmbed(this.staticData, typesWithSelectableRoles[i]);
        if (reactionInfoForMessage[selectableEmbed.messageDynamicData.roleType]) selectableEmbed.messageDynamicData.reactionInfo = reactionInfoForMessage[selectableEmbed.messageDynamicData.roleType];
        const newMessage = await message.channel.send(selectableEmbed.embed);
        await this.addMessageToDynamicData(newMessage, this.dynamicData, selectableEmbed.messageDynamicData);
        await this.startReactionCollector(newMessage);
      }
    } else {
      const roleTypesInStaticData = Object.keys(this.staticData.roleCategories);

      if (roleTypesInStaticData.length === 0) {
        const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar roles dentro de los datos de este servidor.`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }

      for (let i = 0; i < roleTypesInStaticData.length; i++) {
        //console.log('RESTORING MESSAGE EMBED...: ', roleTypesInStaticData[i]);
        const selectableEmbed = this.generateInformativeMessageEmbed(this.staticData, roleTypesInStaticData[i]);
        if (reactionInfoForMessage[selectableEmbed.messageDynamicData.roleType]) selectableEmbed.messageDynamicData.reactionInfo = reactionInfoForMessage[selectableEmbed.messageDynamicData.roleType];
        const newMessage = await message.channel.send(selectableEmbed.embed);
        await this.addMessageToDynamicData(newMessage, this.dynamicData, selectableEmbed.messageDynamicData);
      }
    }

    this.dynamicData[message.guild.id][message.channel.id] = channelDynamicData;
    await this.updateDynamicData(this.dynamicData);
  }

  /** Verifies if the message.ids on the channel still exist on the guild channel and if they are all collecting roles. */
  private async sameMessagesInChannel(dynamicData: RolesDynamicData, message: Message, selectable: boolean): Promise<boolean> {
    let same = true;

    if (selectable) {
      const messages = this.classifyExistingMessagesInChannel(message, dynamicData);

      await message.channel.messages.fetch({ limit: 10 });
      //console.log('CHECKING SELECTABLE MESSAGES MISMATCHS');
      for (let i = 0; i < messages.selectableMesagesIds.length; i++) {
        const messageExistInChannel = message.channel.messages.cache.has(messages.selectableMesagesIds[i]);
        //console.log(`CHANNEL: ${message.channel.id} MESAGE ID: ${messages.selectableMesagesIds[i]}. ¿FOUND ON GUILD CHANNEL? ${messageExistInChannel} `);

        if (messageExistInChannel) {
          dynamicData[message.guild.id][message.channel.id].messages[messages.selectableMesagesIds[i]].isCollectingReactions = false;
          //console.log(`MESSAGE CHANNEL CHANGED ON DYNAMIC DATA `, dynamicData[message.guild.id][message.channel.id].messages[messages.selectableMesagesIds[i]]);
          continue;
        } else {
          dynamicData[message.guild.id][message.channel.id].messages[messages.selectableMesagesIds[i]].deleted = true;
          dynamicData[message.guild.id][message.channel.id].messages[messages.selectableMesagesIds[i]].isCollectingReactions = false;
          //console.log(`MESSAGE CHANNEL CHANGED ON DYNAMIC DATA `, dynamicData[message.guild.id][message.channel.id].messages[messages.selectableMesagesIds[i]]);
          same = false;
        }
      }
    } else {
      const messages = this.classifyExistingMessagesInChannel(message, dynamicData);

      await message.channel.messages.fetch({ limit: 15 });
      for (let i = 0; i < messages.informativeMesagesIds.length; i++) {
        const messageExistInChannel = message.channel.messages.cache.has(messages.informativeMesagesIds[i]);

        if (messageExistInChannel) {
          dynamicData[message.guild.id][message.channel.id].messages[messages.informativeMesagesIds[i]].deleted = false;
          dynamicData[message.guild.id][message.channel.id].messages[messages.informativeMesagesIds[i]].isCollectingReactions = false;
          continue;
        } else {
          dynamicData[message.guild.id][message.channel.id].messages[messages.informativeMesagesIds[i]].deleted = true;
          dynamicData[message.guild.id][message.channel.id].messages[messages.informativeMesagesIds[i]].isCollectingReactions = false;
          same = false;
        }
      }
    }
    await this.updateDynamicData(dynamicData);
    return same;
  }

  /** Repare messages Ids that are not collecting reactions. You can only provide a list of existing messages ids or it will fail. */
  private async repareNonCollectingMessages(messagesIds: string[], message: Message, dynamicData: RolesDynamicData) {
    const dynamicChannelData = dynamicData[message.guild.id][message.channel.id];
    for (let i = 0; i < messagesIds.length; i++) {
      //console.log(`REPARING COLLECTOR FOR MESSAGE: ${messagesIds[i]}`);
      const messageData = dynamicChannelData.messages[messagesIds[i]];
      if (messageData.isCollectingReactions) continue;
      else {
        const embedMessage = await message.channel.messages.fetch(messagesIds[i]);
        await this.startReactionCollector(embedMessage);
      }
    }
  }

  private async startCommandAnalisis(client: Client, commandData: CommandData) {
    if (!this.data.dynamicData.data) {
      //console.log('NO DINAMIC DATA FOUND ON DB FOR ROLES COMMAND');
    } else {
      //console.log('DINAMIC DATA FOUND ..', this.data.dynamicData.data);

      const dynamicData: RolesDynamicData = this.data.dynamicData.data;
      const guildIds = Object.keys(dynamicData);
      const channelsIds: Array<string[]> = [];
      for (let i = 0; i < guildIds.length; i++) {
        const channelsOfGuild = Object.keys(dynamicData[guildIds[i]]);
        channelsIds.push(channelsOfGuild);

        for (let n = 0; n < channelsOfGuild.length; n++) {
          const messagesOfChannel = dynamicData[guildIds[i]][channelsOfGuild[n]].messages;
          const messagesIdsOfChannel = Object.keys(messagesOfChannel);
          //console.log(messagesIdsOfChannel);
          //const selectableDeleted = false;
          //const informativeDeleted = false;
          for (let x = 0; x < messagesIdsOfChannel.length; x++) {
            const currentMessage = messagesOfChannel[messagesIdsOfChannel[x]];
            if (!currentMessage) return;
            //console.log(currentMessage.deleted);

            if (currentMessage.isSelectable) {
              const currentChannel = (await client.channels.fetch(channelsOfGuild[n], true, true)) as TextChannel;
              const message = await currentChannel.messages.fetch(currentMessage.messageId, true, true);
              await this.executeArgumentSelect(message, commandData);
            } else {
              if (currentMessage.deleted) {
                const currentChannel = (await client.channels.fetch(channelsOfGuild[n], true, true)) as TextChannel;
                const message = await currentChannel.messages.fetch(currentMessage.messageId, true, true);
                await this.executeArgumentInfo(message, commandData);
              } else {
                continue;
              }
            }
          }
        }
      }
    }
  }

  private classifyExistingMessagesInChannel(message: Message, dynamicData: RolesDynamicData): { selectableMesagesIds: string[]; informativeMesagesIds: string[] } {
    const selectableIdsInChanel: string[] = [];
    const informativeIdsInChanel: string[] = [];
    //console.log('dynamicData', dynamicData[message.guild.id][message.channel.id]);
    //console.log('message', message.id);
    const messagesKeys = Object.keys(dynamicData[message.guild.id][message.channel.id].messages);
    for (let i = 0; i < messagesKeys.length; i++) {
      const currentMessageOfChannel = dynamicData[message.guild.id][message.channel.id].messages[messagesKeys[i]];
      //console.log('currentMessageOfChannel', currentMessageOfChannel);
      if (currentMessageOfChannel.isSelectable) {
        selectableIdsInChanel.push(currentMessageOfChannel.messageId);
        informativeIdsInChanel.push(currentMessageOfChannel.messageId);
      } else if (!currentMessageOfChannel.isSelectable) informativeIdsInChanel.push(currentMessageOfChannel.messageId);
    }

    return { selectableMesagesIds: selectableIdsInChanel, informativeMesagesIds: informativeIdsInChanel };
  }

  private setStaticData(commandData: CommandData): boolean {
    const commandStaticData: RolesStaticData = commandData.staticData.data;
    const roleTypesInData = Object.keys(commandStaticData);

    if (roleTypesInData.length === 0) return false;
    else {
      this.staticData = commandStaticData;
      //console.log('STATIC DATA FOUND AND PARAMETER SET');
      return true;
    }
  }

  private setDynamicData(commandData: CommandData, message: Message): boolean {
    const commandDynamicData: RolesDynamicData = commandData.dynamicData.data;
    if (!commandDynamicData) return false;
    //Set the dynamicData class property with the db command data if it exist.
    if (commandDynamicData[message.guild.id]) {
      if (commandDynamicData[message.guild.id][message.channel.id]) {
        //console.log('SETTING DYNAMIC DATA: ');
        if (this.dynamicData[message.guild.id]) {
          if (this.dynamicData[message.guild.id][message.channel.id]) {
            this.dynamicData[message.guild.id][message.channel.id] = commandDynamicData[message.guild.id][message.channel.id];
            //console.log('DYNAMIC DATA FOUND AND PARAMETER SET');
            return true;
          } else {
            this.dynamicData[message.guild.id] = commandDynamicData[message.guild.id];
            //console.log('DYNAMIC DATA FOUND AND PARAMETER SET');
            return true;
          }
        } else {
          this.dynamicData[message.guild.id] = {};
          this.dynamicData[message.guild.id] = commandDynamicData[message.guild.id];
          //console.log('DYNAMIC DATA FOUND AND PARAMETER SET');
          return true;
        }
      } else return false;
    } else return false;
  }

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
  private getSelectableTypes(staticData: RolesStaticData, dynamicData: RolesDynamicData, message: Message, roleData: RoleData[]): string[] {
    const roleTypesInStaticData = Object.keys(staticData.roleCategories);

    const selectableTypes: { [roleType: string]: boolean } = {};

    for (let i = 0; i < roleTypesInStaticData.length; i++) {
      const roleType = roleTypesInStaticData[i];
      roleData.forEach((role) => {
        if (role.type === roleType && role.selectable) selectableTypes[roleType] = role.selectable;
      });
    }

    //console.log('FROM GET SELECTABLE TYPES: ', roleTypesInStaticData);

    const selectableTypesKeys = Object.keys(selectableTypes);
    return selectableTypesKeys;
  }

  private generateInformativeMessageEmbed(
    staticData: RolesStaticData,
    roleType: string
  ): {
    messageDynamicData: RolesDynamicData['guildId']['channelId']['messages']['messageId'];
    embed: MessageEmbed;
  } {
    const embedData: MessageEmbedOptions = staticData.embedData;
    const roleTypeDescription = staticData.roleCategories[roleType].description;
    const roles: MessageEmbedRoles[] = [];
    const roleDataOfType = this.rolesData.filter((role) => role.type === roleType);
    const roleInfoSelectableFields = roleDataOfType.map((role) => {
      //console.log('MAPING ROLE: ', role);

      const name = `\u200B`;
      const namevalue = `<@&${role.id}>\n`;
      const descvalue = '```' + role.description + '```';
      const fieldValue = namevalue + descvalue;

      roles.push({
        id: role.id,
        emoji: role.emoji,
        name: role.name,
        selectable: true,
      });

      return {
        name: name,
        value: fieldValue,
        inline: false,
      };
    });

    const embed = new MessageEmbed({
      title: roleType,
      description: roleTypeDescription,
      url: embedData.url,
      color: embedData.color,
      author: {
        name: embedData.author.name,
        url: embedData.author.url,
        icon_url: embedData.author.icon_url,
      },
      thumbnail: {
        url: embedData.thumbnail.url,
      },
      fields: roleInfoSelectableFields,
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();

    return {
      messageDynamicData: {
        deleted: false,
        isCollectingReactions: false,
        lastUpdate: new Date(Date.now()).toUTCString(),
        roleType: roleType,
        isSelectable: false,
        roles: roles,
      },
      embed: embed,
    };
  }

  private generateSelectableMessageEmbed(
    staticData: RolesStaticData,
    roleType: string
  ): {
    messageDynamicData: RolesDynamicData['guildId']['channelId']['messages']['messageId'];
    embed: MessageEmbed;
  } {
    const embedData: MessageEmbedOptions = staticData.embedData;
    const roleTypeDescription = staticData.roleCategories[roleType].description;
    const roles: MessageEmbedRoles[] = [];
    const roleDataOfType = this.rolesData.filter((role) => role.type === roleType && role.selectable);
    const roleInfoSelectableFields = roleDataOfType.map((role) => {
      //console.log('MAPING ROLE: ', role);
      if (role.selectable) {
        const name = `\u200B`;
        const namevalue = `${role.emoji} <@&${role.id}>\n`;
        const descvalue = '```' + role.description + '```';
        const fieldValue = namevalue + descvalue;

        roles.push({
          id: role.id,
          emoji: role.emoji,
          name: role.name,
          selectable: true,
        });

        return {
          name: name,
          value: fieldValue,
          inline: false,
        };
      }
    });

    //console.log('ROLE SELECTABLE FIELDS: ', roleInfoSelectableFields);

    const embed = new MessageEmbed({
      title: roleType,
      description: roleTypeDescription,
      url: embedData.url,
      color: embedData.color,
      author: {
        name: embedData.author.name,
        url: embedData.author.url,
        icon_url: embedData.author.icon_url,
      },
      thumbnail: {
        url: embedData.thumbnail.url,
      },
      fields: roleInfoSelectableFields,
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();

    return {
      messageDynamicData: {
        deleted: false,
        isCollectingReactions: false,
        lastUpdate: new Date(Date.now()).toUTCString(),
        roleType: roleType,
        isSelectable: true,
        roles: roles,
        reactionInfo: [],
      },
      embed: embed,
    };
  }
}
