import {Message, MessageEmbed, MessageAttachment, EmbedField} from 'discord.js';

import CommandInterface from '../interfaces/CommandInterface';
import { validateCommandRestrictions } from '../utils/botValidation';
import path from 'path';
import { TemarioData } from '../interfaces/TemarioInterfaces';

import * as temaries from '../../../data/temaries.json'

const temarioActual:TemarioData =  temaries[0] as any;

export default class Temario implements CommandInterface {
  private readonly _command = 'temario';

  private currentEmbedMessage: Message;

  private migdrplogo = new MessageAttachment( 
    path.join(__dirname, `../assets/img/migdrp-logo-small-parla_sabatina.png`), 
    'migdrp-icon.png' 
  );
  private bonobotlogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/bb_dsicordbackcolor.png`),
    'bb-logo.png'
  );

  constructor() {
    console.log('Temario Command Instantiated');
  }

  public help(): string {
    return 'Comando de generación de temarios de la Comunidad Bonóbica';
  }

  public isThisCommand(command: string): boolean {
    return command === this._command;
  }

  public async runCommand(
    args: string[],
    msgObject: Message
  ): Promise<void> {
    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }

    let mention = '<@&697314419868172298>';

    if (args.length > 0) {
      if (args[0] === 'aviso') {
        if (args[1] !== null && args[1] !== undefined) {
          mention = args[1];
          console.log(args[1]);
        }

        if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
          await this.currentEmbedMessage.delete();
        }

        const TurnsEmbed = this.generateEmbedMessage(true, temarioActual);

        await msgObject.channel.send(
          `${mention} Aquí tienen el temario para la parla sabatina, recuerden que cualquier información respecto al tema la pueden postear en <#698202549697773610>`
        );

        await msgObject.channel.send(TurnsEmbed);
      }
      return;
    }

    if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
      await this.currentEmbedMessage.delete();
    }

    const TurnsEmbed = this.generateEmbedMessage(false, temarioActual);

    await msgObject.channel.send(TurnsEmbed);
  }

  private generateEmbedMessage(aviso: boolean, data: TemarioData): MessageEmbed {

    const embedFileds = this.generateEmbedFields(data, aviso);

    if (aviso) {
      const template = new MessageEmbed()
        .attachFiles(this.migdrplogo as any)
        .attachFiles(this.bonobotlogo as any)
        .setColor('#a956bd')
        .setAuthor(
          'TEMARIO DEL FORO SABATINO',
          'attachment://migdrp-icon.png',
          'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
        )
        .setThumbnail('attachment://bb-logo.png')

        .setDescription(
          `
                :microphone2:  \u200B \u200B \u200B ***__ Sobre el foro sabatino __***  \u200B \u200B \u200B :microphone2: 
        
                El tema para esta charla es: 
                \u200B     
            `
        )
        .addFields(embedFileds)
        .setImage('attachment://foro-img.jpg')
        .setTimestamp()
        .addFields({
          name: 'Horario de las charlas',
          value: [
            '\u200b',
            '08:10 PM :flag_mx:  (CDMX)',
            '09:10 PM :flag_co:  /  :flag_pe: / :flag_ec:',
            '010:10 PM :flag_bo:  /  :flag_ve:',
            '11:10 PM :flag_ar:  /  :flag_uy: / :flag_cl:',
            '04:10 AM :flag_ea:',
            '\u200b',
          ],
        })
        .setFooter(
          '¡Los bonobos apreciamos mucho la participación!',
          'attachment://migdrp-icon.png'
        );

      return template;
    } else {
      const template = new MessageEmbed()
        .attachFiles(this.migdrplogo as any)
        .attachFiles(this.bonobotlogo as any)
        .setColor('#a956bd')
        .setAuthor(
          'TEMARIO DEL FORO SABATINO',
          'attachment://migdrp-icon.png',
          'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
        )
        .setThumbnail('attachment://bb-logo.png')
        .addFields(embedFileds)
        .setTimestamp()
        .setFooter(
          'Los bonobos apreciamos mucho la participación!!',
          'attachment://migdrp-icon.png'
        );

      return template;
    }
  }

  private generateEmbedFields( temarioData: TemarioData, aviso: boolean ): EmbedField[] {

    const embedFields: EmbedField[] = [];

    //Para todos los temas en el temario
    for (let n = 0; n < temarioData.content.length; n++) {
      let field: EmbedField;
      const fieldValues: string[] = [];

      //Si no hay subtemas el valord será un espacio en blanco
      if ( temarioData.content[n].subtitles.length === 0 ) {
        field = {
          name: temarioData.content[n].title,
          value: ['\u200b'] as unknown as string,
          inline: false,
        };
        embedFields.push(field);
        continue;
      }

      //Si hay subtemas se agregarán al array 'value'
      for (let i = 0; i < temarioData.content[n].subtitles.length; i++) {

        fieldValues.push(
          `\u200b \u200b  ${aviso ? '' : '-'} ${
            (temarioData.content[n] as any).subtitles[i]
          }`
        );

        if (i === (temarioData.content[n] as any).subtitles.length - 1) {
          fieldValues.push('\u200b \u200b \u200b \u200b ');
        }
      }

      field = {
        name: temarioData.content[n].title,
        value: fieldValues as unknown as string,
        inline: false,
      };

      embedFields.push(field);
    }

    return embedFields;
  }

}

