import { Message, MessageEmbed, MessageEmbedOptions, MessageReaction } from 'discord.js';

import { memberRolesHaveCommandPermission } from '../utils';

import { Command } from '.';

import { ArgumentData } from '../interfaces';

export enum turnos_states {
  working = 'working',
  free = ' free',
}

interface TurnsUser {
  turnInfo?: {
    rollbacked?: boolean;
    skipped?: boolean;
    requestedAt?: number;
    stratetAt?: number;
    endedAt?: number;
  };
  username?: string;
  nickname?: string;
  id?: string;
}

interface TurnsDynamicData {
  [guildId: string]: {
    [channelId: string]: {
      channelId?: string;
      messageId?: string;
      collectingReactions?: boolean;
      currentUser?: TurnsUser;
      users?: TurnsUser[];
      lastUser?: TurnsUser;
      channelStats?: {
        channelOpen?: boolean;
        endedTurns?: TurnsUser[];
      };
    };
  };
}

export class TurnsCommand extends Command {
  private readonly commandName = 'Turnos';

  private dynamicData: TurnsDynamicData = {};

  constructor() {
    super();
    console.info('Turns Command Instantiated');
    this.start();
  }

  private async start(): Promise<void> {
    this.data = await this.getCommandData(this.commandName);
    this.commandHealth.started = true;
    //console.log(this.data);
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    try {
      if (!(await memberRolesHaveCommandPermission(this.data.prefix, message))) return;
      this.setUseCase();
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
            this.dynamicData = this.updateLocalDynamicData(message);
            await this.argumentHandler(argument, message);
            return;
          } else continue;
        }

        this.dynamicData = this.updateLocalDynamicData(message);
        await this.argumentHandler(argument, message);
      }
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (runCommand). `, exception.message);
    }
  }

  private async argumentHandler(argumentData: ArgumentData, message: Message) {
    try {
      if (argumentData.prefix === this.data.prefix) {
        this.commandHealth.lastTimeUsed = this.lastTimeUsed(message);
        let data = this.dynamicData[message.guild.id][message.channel.id];

        if (!data.channelStats.channelOpen) {
          message.delete();
          const messageString = `💢💢 Espérate bonobo. ¿Que no ves que ya me encuentro ejecutando ese comando?`;
          this.sendTemporalTextMessage(messageString, message.channel, 3000);
          return;
        }

        data.channelStats.channelOpen = false;

        let embedMessage: Message;

        if (data.messageId) {
          const messageExistsOnChannel = message.channel.messages.cache.has(data.messageId);
          if (messageExistsOnChannel) {
            embedMessage = await message.channel.messages.fetch(data.messageId);
            if (embedMessage && !embedMessage.deleted) await embedMessage.delete();
          }
        }

        const newTurnsEmbed = this.generateMessageEmbed(data);
        embedMessage = await message.channel.send(newTurnsEmbed);
        data.messageId = embedMessage.id;

        await embedMessage.react('🎟️');
        await embedMessage.react('✅');

        const reactionFilter = (reaction: MessageReaction) => reaction.emoji.name === '🎟️' || reaction.emoji.name === '⛔' || reaction.emoji.name === '✅';

        const reactionCollecotor = embedMessage.createReactionCollector(reactionFilter, { dispose: true });

        reactionCollecotor.on('collect', async (reaction, user) => {
          try {
            await reaction.users.remove(user.id);
            const member = await message.guild.members.fetch(user.id);

            data.collectingReactions = true;
            data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];

            if (reaction.emoji.name === '🎟️') {
              if (this.isUserOnList(data, user.id).isCurrentUser) {
                //console.log(`User ${user.username} revoked a ticked. User lose the current turn.`);

                data.currentUser = data.users[0];
                data.users.splice(0, 1);
                await reaction.message.edit(this.generateMessageEmbed(data));
                data.channelStats.channelOpen = true;
                data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];

                return;
              } else if (this.isUserOnList(data, user.id).isPendingUser) {
                //console.log(`User ${user.username} revoked ticked`);

                const result = data.users.filter((turnUser) => turnUser.id !== user.id);
                data.users = result;
                await reaction.message.edit(this.generateMessageEmbed(data));
                data.channelStats.channelOpen = true;
                data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];

                return;
              } else {
                //console.log(`New ticket for user: ${user.username} `);

                if (!data.currentUser) {
                  data.currentUser = {
                    username: user.username,
                    nickname: member.nickname,
                    id: user.id,
                    turnInfo: {
                      skipped: false,
                      rollbacked: false,
                      requestedAt: Date.now(),
                      endedAt: null,
                      stratetAt: Date.now(),
                    },
                  };
                  await reaction.message.edit(this.generateMessageEmbed(data));
                  data.channelStats.channelOpen = true;
                  data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];

                  return;
                } else {
                  data.users.push({
                    username: user.username,
                    nickname: member.nickname,
                    id: user.id,
                    turnInfo: {
                      skipped: false,
                      rollbacked: false,
                      requestedAt: Date.now(),
                      endedAt: null,
                      stratetAt: null,
                    },
                  });
                  await reaction.message.edit(this.generateMessageEmbed(data));
                  data.channelStats.channelOpen = true;
                  data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];

                  return;
                }
              }
            }

            if (reaction.emoji.name === '✅') {
              if (!data.currentUser) {
                const messageString = `❓ ❓ Que intentas hacer ${member.nickname ? member.nickname : user.username}, no hay nadie en la lista.`;
                this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);
                data.channelStats.channelOpen = true;
                data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
                return;
              }

              if (user.id !== data.currentUser.id) {
                const messageString = `⚠️ ⚠️ Cuidado ${member.nickname ? member.nickname : user.username}, no intentes finalizar un turno que no es el tuyo.`;
                this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);
                data.channelStats.channelOpen = true;
                data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
                return;
              }

              if (data.users.length === 0) {
                //console.log(`User ${user.username} end a turn`);
                if (!data.currentUser.turnInfo.rollbacked) data.currentUser.turnInfo.endedAt = Date.now();
                data.channelStats.endedTurns.push(data.currentUser);
                data.lastUser = data.currentUser;
                data.currentUser = null;
                await reaction.message.edit(this.generateMessageEmbed(data));
                data.channelStats.channelOpen = true;
                data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
                return;
              } else {
                //console.log(`User ${user.username} end a turn`);
                if (!data.currentUser.turnInfo.rollbacked) data.currentUser.turnInfo.endedAt = Date.now();
                data.channelStats.endedTurns.push(data.currentUser);
                data.lastUser = data.currentUser;
                data.currentUser = data.users[0];
                data.currentUser.turnInfo.stratetAt = Date.now();
                data.users.splice(0, 1);
                await reaction.message.edit(this.generateMessageEmbed(data));
                data.channelStats.channelOpen = true;
                data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
                return;
              }
            }
          } catch (exception) {
            console.info(`BONOBOT ERROR at command (${this.commandName}) executing (reactionCollector collect). `, exception);
            throw new Error(exception);
          }
        });

        reactionCollecotor.on('end', async (collected, reason) => {
          try {
            //const messageString = `🔐 La taquilla se ha cerrado.`;
            //console.log('COLLECTOR STOPPED: ', reason);
            //console.log('COLLECTED CHANNEL STATS: ', data.channelStats);
            //this.sendTemporalTextMessage(messageString, embedMessage.channel, 4000);

            data.collectingReactions = false;
            data.channelStats.channelOpen = true;
            //if (embedMessage && !embedMessage.deleted) await embedMessage.delete();
            const updatedData = this.updateLocalDynamicData(message, data);
            this.dynamicData = updatedData;
            data = updatedData[message.guild.id][data.channelId];
            await this.updateDynamicData(this.dynamicData);
          } catch (exception) {
            console.info(`BONOBOT ERROR at command (${this.commandName}) executing (reactionCollector end). `, exception);
          }
        });

        await message.delete();
        data.channelStats.channelOpen = true;
        data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
      }

      if (argumentData.prefix === 'skip') {
        this.commandHealth.lastTimeUsed = this.lastTimeUsed(message);
        let data = this.dynamicData[message.guild.id][message.channel.id];

        let embedMessage: Message;

        if (data.messageId) {
          const messageExistsOnChannel = message.channel.messages.cache.has(data.messageId);
          if (messageExistsOnChannel) embedMessage = await message.channel.messages.fetch(data.messageId);
          else {
            const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la taquilla de turnos en este canal. ¿Estás seguro que aún existe el mensaje?.`;
            this.sendTemporalTextMessage(messageString, message.channel, 4000);
            message.delete();
            data.channelStats.channelOpen = true;
            return;
          }
        } else {
          const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la taquilla de turnos en este canal. ¿Estás seguro que aún existe el mensaje?.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          message.delete();
          data.channelStats.channelOpen = true;
          return;
        }

        if (data.users.length === 0) {
          if (data.currentUser) {
            if (!data.currentUser.turnInfo.rollbacked) data.currentUser.turnInfo.endedAt = Date.now();
            data.currentUser.turnInfo.skipped = true;
            data.lastUser = data.currentUser;
            data.currentUser = null;
            await embedMessage.edit(this.generateMessageEmbed(data));
          } else {
            const messageString = `❓ ❓ Que intentas hacer ${message.member.nickname ? message.member.nickname : message.author.username}, no hay nadie en la lista.`;
            this.sendTemporalTextMessage(messageString, message.channel, 4000);
          }
        } else {
          if (!data.currentUser.turnInfo.rollbacked) data.currentUser.turnInfo.endedAt = Date.now();
          data.currentUser.turnInfo.skipped = true;
          data.lastUser = data.currentUser;
          data.currentUser = data.users[0];
          data.currentUser.turnInfo.stratetAt = Date.now();
          data.users.splice(0, 1);
          await embedMessage.edit(this.generateMessageEmbed(data));
        }

        message.delete();
        data.channelStats.channelOpen = true;
        data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
      }

      if (argumentData.prefix === 'rollback') {
        this.commandHealth.lastTimeUsed = this.lastTimeUsed(message);
        let data = this.dynamicData[message.guild.id][message.channel.id];

        let embedMessage: Message;

        if (data.messageId) {
          const messageExistsOnChannel = message.channel.messages.cache.has(data.messageId);
          if (messageExistsOnChannel) embedMessage = await message.channel.messages.fetch(data.messageId);
          else {
            const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la taquilla de turnos en este canal. ¿Estás seguro que aún existe el mensaje?.`;
            this.sendTemporalTextMessage(messageString, message.channel, 4000);
            message.delete();
            data.channelStats.channelOpen = true;
            return;
          }
        } else {
          const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar la taquilla de turnos en este canal. ¿Estás seguro que aún existe el mensaje?.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          message.delete();
          data.channelStats.channelOpen = true;
          return;
        }

        if (data.users.length === 0) {
          if (!data.lastUser) {
            const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo ejecutar el comando. ${this.getEasterEggMessage('rollback')}`;

            this.sendTemporalTextMessage(messageString, message.channel, 4000);
            message.delete();
            data.channelStats.channelOpen = true;
            return;
          }

          //console.log('LAST USER... ', data.lastUser);
          //console.log('CURRENT USER... ', data.currentUser);
          if (!data.currentUser) {
            data.lastUser.turnInfo.rollbacked = true;
            data.currentUser = data.lastUser;
            data.lastUser = null;
            await embedMessage.edit(this.generateMessageEmbed(data));
          } else {
            data.lastUser.turnInfo.rollbacked = true;
            data.currentUser.turnInfo.stratetAt = null;
            data.users.push(data.currentUser);
            data.currentUser = data.lastUser;
            data.lastUser = null;
            await embedMessage.edit(this.generateMessageEmbed(data));
          }
        } else {
          //let result = this.users.splice(1, 0, this.currentUser[0]);
          //console.log('Rollback Result', result);
          data.lastUser.turnInfo.rollbacked = true;
          data.currentUser.turnInfo.stratetAt = null;
          data.users.unshift(data.currentUser);
          data.currentUser = data.lastUser;
          data.lastUser = null;
          await embedMessage.edit(this.generateMessageEmbed(data));
        }

        message.delete();
        data.channelStats.channelOpen = true;
        data = this.updateLocalDynamicData(message, data)[message.guild.id][data.channelId];
      }

      if (argumentData.prefix === 'help') {
        message.delete();
        (await message.channel.send(this.helpRequested(this.data))).delete({
          timeout: 25000,
        });
        return;
      }

      if (argumentData.prefix === 'health') {
        message.delete();
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

  private async updateDynamicData(data: TurnsDynamicData): Promise<void> {
    this.data.dynamicData = data;
    await this.useCases.edit(this.data);
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

  private generateMessageEmbed(data: TurnsDynamicData['guildId']['channelId'], template?: string): MessageEmbed {
    let embedData: MessageEmbedOptions;

    if (template) {
      embedData = this.data.staticData.data.embedTemplates[template].embedData;
      if (!embedData) embedData = this.data.staticData.data.embedTemplates[this.data.staticData.data.defaultEmbedTurnos].embedData;
    } else embedData = this.data.staticData.data.embedTemplates[this.data.staticData.data.defaultEmbedTurnos].embedData;

    const currentTurnEmptyValue = embedData.fields[0].value;
    const pendingTurnEmptyValue = embedData.fields[1].value;

    const currentTurnValue = `${data.currentUser ? `${data.currentUser.nickname ? data.currentUser.nickname : data.currentUser.username}` : currentTurnEmptyValue}`;

    const usersList: string[] = [];

    for (let i = 0; i < data.users.length; i++) {
      const value = data.users[i].nickname ? data.users[i].nickname : data.users[i].username;
      const actualValue = `${value} \u200B \n`;
      usersList.push(actualValue);
    }

    const pendingTurnsValue = `${currentTurnValue === currentTurnEmptyValue ? currentTurnEmptyValue : `${usersList.length === 0 ? pendingTurnEmptyValue : usersList}`}`;

    return new MessageEmbed({
      title: embedData.title,
      description: embedData.description,
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
      fields: [
        {
          name: `${embedData.fields[0].name}\n\u200B`,
          value: currentTurnValue,
        },
        { name: '\u200B', value: '\u200B' },
        {
          name: `${embedData.fields[1].name}\n\u200B`,
          value: pendingTurnsValue,
        },
        { name: '\u200B', value: '\u200B' },
      ],
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();
  }

  private updateLocalDynamicData(message: Message, channelData?: TurnsDynamicData['guildId']['channelId']): TurnsDynamicData {
    if (this.data.dynamicData[message.guild.id]) {
      if (this.data.dynamicData[message.guild.id][message.channel.id]) {
        if (this.dynamicData[message.guild.id]) {
          //console.log('This guild is already registered on dinamic data');

          if (!this.dynamicData[message.guild.id][message.channel.id]) {
            this.dynamicData[message.guild.id][message.channel.id] = this.data.dynamicData[message.guild.id][message.channel.id];
          }
        } else {
          this.dynamicData[message.guild.id] = {
            [message.channel.id]: this.data.dynamicData[message.guild.id][message.channel.id],
          };
        }
      }
    }

    if (channelData) this.dynamicData[message.guild.id][channelData.channelId] = channelData;
    const dynamicData: TurnsDynamicData = this.dynamicData;

    if (dynamicData[message.guild.id]) {
      //console.log('This guild is already registered on dinamic data');

      if (dynamicData[message.guild.id][message.channel.id]) {
        //console.log('This Channel of this guild is already registered on dinamic data');
      } else {
        dynamicData[message.guild.id][message.channel.id] = {
          channelId: message.channel.id,
          messageId: null,
          collectingReactions: false,
          currentUser: null,
          users: [],
          lastUser: null,
          channelStats: {
            channelOpen: true,
            endedTurns: [],
          },
        };
      }
    } else {
      dynamicData[message.guild.id] = {
        [message.channel.id]: {
          channelId: message.channel.id,
          messageId: null,
          collectingReactions: false,
          currentUser: null,
          users: [],
          lastUser: null,
          channelStats: {
            channelOpen: true,
            endedTurns: [],
          },
        },
      };
    }
    //console.log('DINAMIC DATA: ', dynamicData);
    return dynamicData;
  }

  private isUserOnList(data: TurnsDynamicData['guildId']['channelId'], userId: string): { isCurrentUser: boolean; isPendingUser: boolean } {
    if (!data.currentUser && data.users.length === 0) return { isCurrentUser: false, isPendingUser: false };
    for (let i = 0; i < data.users.length; i++) if (data.users[i].id === userId) return { isCurrentUser: false, isPendingUser: true };
    if (data.currentUser.id === userId) return { isCurrentUser: true, isPendingUser: false };
    return { isCurrentUser: false, isPendingUser: false };
  }
}
