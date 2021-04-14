import { Message, MessageEmbed, MessageAttachment, EmbedField, MessageEmbedOptions } from 'discord.js';

import { ArgumentData, TemaryData } from '../interfaces';
import { memberRolesHaveCommandPermission } from '../utils';
import { TemaryUseCases } from '../usecases';
import path from 'path';

import { Command } from '.';

export class TemaryCommand extends Command {
  private readonly commandName = 'Temario';
  private temaryData: TemaryData[];
  private temaryUsecases = new TemaryUseCases();

  private currentEmbedMessage: Message;

  private migdrplogo = new MessageAttachment(path.join(__dirname, `../assets/img/migdrp-logo-small-parla_sabatina.png`), 'migdrp-icon.png');
  private bonobotlogo = new MessageAttachment(path.join(__dirname, `../assets/img/bb_discordbackcolor.png`), 'bb-logo.png');

  constructor() {
    super();
    console.info('Temario Command Instantiated');
    this.setTemariesUseCase();
    this.start();
  }

  private async start(): Promise<void> {
    try {
      this.data = await this.getCommandData(this.commandName);
      this.temaryData = await this.getActiveTemary();
      this.commandHealth.started = true;
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (start()). `, exception);
      throw new Error(exception);
    }
    //console.log(this.data);
  }

  private setTemariesUseCase(): void {
    this.temaryUsecases = new TemaryUseCases();
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    try {
      if (!(await memberRolesHaveCommandPermission(this.data.prefix, message))) return;
      this.setUseCase();
      this.setTemariesUseCase();
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
        this.temaryData = await this.getActiveTemary();
        const validTemary = this.validateActiveTemary();
        if (!validTemary) {
          const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo ejecutar el comando. No encuentro ningún temario activo en la base de datos.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }

        if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
          await this.currentEmbedMessage.delete();
        }

        const temarioEmbed = this.generateEmbedMessage(false, this.temaryData[0]);
        this.currentEmbedMessage = await message.channel.send(temarioEmbed);
      }

      if (argumentData.prefix === 'aviso') {
        await message.delete();
        this.temaryData = await this.getActiveTemary();
        const validTemary = this.validateActiveTemary();
        if (!validTemary) {
          const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo ejecutar el comando. No encuentro ningún temario activo en la base de datos.`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }

        const mention = argumentData.argsContent;
        const mentionRoleId = this.findItemsInsideSymbols(mention, '&', '>')[0];
        const mentionRoleExist = message.guild.roles.cache.has(mentionRoleId);

        //console.log(mentionRoleExist);
        if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
          await this.currentEmbedMessage.delete();
        }

        const temarioEmbed = this.generateEmbedMessage(true, this.temaryData[0]);

        await message.channel.send(`${mentionRoleExist ? mention : ''}`, temarioEmbed);
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

  private async getActiveTemary(): Promise<TemaryData[]> {
    const activeTemary = await this.temaryUsecases.findByQuery({ active: true });
    return activeTemary;
  }

  private validateActiveTemary(): boolean {
    if (this.temaryData.length === 1) return true;
    else return false;
  }

  private generateEmbedMessage(aviso: boolean, data: TemaryData): MessageEmbed {
    const embedFileds = this.generateEmbedFields(data, aviso);
    const embedData: MessageEmbedOptions = this.data.staticData.data.embedData;
    if (!embedData) return;

    if (aviso) {
      const timeData: Array<{ zone: string; emoji: string; time: string }> = this.data.staticData.data.timeData;
      const timeFileds: { [time: string]: string[] } = {};

      for (let i = 0; i < timeData.length; i++) {
        if (timeFileds[timeData[i].time]) {
          timeFileds[timeData[i].time].push(timeData[i].emoji);
        } else {
          timeFileds[timeData[i].time] = [];
          timeFileds[timeData[i].time].push(timeData[i].emoji);
        }
      }

      const emojisPerHour = Object.keys(timeFileds);

      let timeValueString = '';
      for (let i = 0; i < emojisPerHour.length; i++) {
        timeValueString += `\u200b ${emojisPerHour[i]} \u200b`;

        for (let n = 0; n < timeFileds[emojisPerHour[i]].length; n++) {
          timeValueString += `${timeFileds[emojisPerHour[i]][n]}${n < timeFileds[emojisPerHour[i]].length - 1 ? ' / ' : ' '}`;
        }

        timeValueString += '\n';
      }

      const timeDataField: EmbedField = {
        name: 'Horario de las charlas',
        value: timeValueString,
        inline: false,
      };

      embedFileds.push(timeDataField);
    }

    const newTemplate = new MessageEmbed({
      title: embedData.title,
      description: `
        :microphone2:  \u200B \u200B \u200B ***__ Sobre el foro sabatino __***  \u200B \u200B \u200B :microphone2: 

        El tema para esta charla es: 
        \u200B     
        __**${data.name}**__
        \u200B     
      `,
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
      fields: embedFileds,
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();

    return newTemplate;
  }

  private generateEmbedFields(temarioData: TemaryData, aviso: boolean): EmbedField[] {
    const embedFields: EmbedField[] = [];

    //Para todos los temas en el temario
    for (let n = 0; n < temarioData.content.length; n++) {
      let field: EmbedField;
      const fieldValues: string[] = [];

      //Si no hay subtemas el valord será un espacio en blanco
      if (temarioData.content[n].subtitles.length === 0) {
        field = {
          name: temarioData.content[n].title,
          value: (['\u200b'] as unknown) as string,
          inline: false,
        };
        embedFields.push(field);
        continue;
      }

      //Si hay subtemas se agregarán al array 'value'
      for (let i = 0; i < temarioData.content[n].subtitles.length; i++) {
        fieldValues.push(`\u200b \u200b  ${aviso ? '' : '-'} ${(temarioData.content[n] as any).subtitles[i]}`);

        if (i === (temarioData.content[n] as any).subtitles.length - 1) {
          fieldValues.push('\u200b \u200b \u200b \u200b ');
        }
      }

      field = {
        name: temarioData.content[n].title,
        value: (fieldValues as unknown) as string,
        inline: false,
      };

      embedFields.push(field);
    }
    return embedFields;
  }
}
