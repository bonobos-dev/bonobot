import * as Discord from 'discord.js';

import { MigBotCommand } from '../botApi';
import { validateCommandRestrictions } from '../utils/botValidation';

import {
  TemarioEntity,
  tema,
  subtema,
  TemarioData,
} from '../utils/TemarioEntity';

import { getHostUrl } from '../utils/networkUtil';

const temarioDataTest = {
  titulo: '',
  temas: [
    {
      titulo: '***__SALUD PERSONAL__*** ',
      subtemas: [
        {
          titulo: '*¿Qué es la salud?*',
        },
        {
          titulo: '*Higiene*',
        },
        {
          titulo: '*Ambiente*',
        },
        {
          titulo: '*Actividades Recreativas*',
        },
        {
          titulo: '*Sexualidad*',
        },
      ],
    },
  ],
};

const temarioDataTestFull = {
  titulo: `
Salud Personal 
\u200B
    `,
  temas: [
    {
      titulo: '¿Qué es la salud?',
    },
    {
      titulo: 'Alimentación',
      subtemas: [
        {
          titulo: 'Aspecto biológico.',
        },
        {
          titulo: 'Aspecto psicológico.',
        },
        {
          titulo: 'Aspecto social.',
        },
      ],
    },
    {
      titulo: 'Higiene',
      subtemas: [
        {
          titulo: 'Aspecto biológico.',
        },
        {
          titulo: 'Aspecto psicológico.',
        },
        {
          titulo: 'Aspecto social.',
        },
      ],
    },
    {
      titulo: 'Ambiente',
      subtemas: [
        {
          titulo: 'Aspecto biológico.',
        },
        {
          titulo: 'Aspecto psicológico.',
        },
        {
          titulo: 'Aspecto social.',
        },
      ],
    },
    {
      titulo: 'Actividades Recreativas',
      subtemas: [
        {
          titulo: 'Aspecto biológico.',
        },
        {
          titulo: 'Aspecto psicológico.',
        },
        {
          titulo: 'Aspecto social.',
        },
      ],
    },
    {
      titulo: 'Sexualidad',
      subtemas: [
        {
          titulo: 'Aspecto biológico.',
        },
        {
          titulo: 'Aspecto psicológico.',
        },
        {
          titulo: 'Aspecto social.',
        },
      ],
    },
  ],
};

export default class Temario implements MigBotCommand {
  private readonly _command = 'temario';

  private currentEmbedMessage: Discord.Message;

  private migdrplogo = new Discord.MessageAttachment(
    `${getHostUrl()}/img/migdrp-logo-small-parla_sabatina.png`,
    'migdrp-icon.png'
  );
  private bonobotlogo = new Discord.MessageAttachment(
    `${getHostUrl()}/img/LOGO_bb_dsicordback.png`,
    'bb-logo.png'
  );
  private imgParla = new Discord.MessageAttachment(
    `${getHostUrl()}/img/foro-img.jpg`,
    'foro-img.jpg'
  );

  private crearEmbedTemario(aviso: boolean, data: any): Discord.MessageEmbed {
    const temarioData = data;

    const fieldsForEmbed = () => {
      let fields: any = [];

      //Para todos los temas en el temario
      for (var n = 0; n < temarioData.temas.length; n++) {
        let field: any = {};
        let fieldValues: any = [];

        //Si no hay subtemas el valord será un espacio en blanco
        if (!(temarioData.temas[n] as any).subtemas) {
          field = {
            name: temarioData.temas[n].titulo,
            value: ['\u200b'],
            inline: false,
          };

          fields.push(field);
          continue;
        }

        //Si hay subtemas se agregarán al array 'value'
        for (
          var i = 0;
          i < (temarioData.temas[n] as any).subtemas.length;
          i++
        ) {
          //if(i === 0){ fieldValues.push('\u200b \u200b \u200b \u200b ') }

          fieldValues.push(
            `\u200b \u200b  ${aviso ? '' : '-'} ${
              (temarioData.temas[n] as any).subtemas[i].titulo
            }`
          );

          if (i === (temarioData.temas[n] as any).subtemas.length - 1) {
            fieldValues.push('\u200b \u200b \u200b \u200b ');
            //fieldValues.push('\u200b \u200b \u200b \u200b ')
          }
        }

        field = {
          name: temarioData.temas[n].titulo,
          value: fieldValues,
          inline: false,
        };

        fields.push(field);
      }

      return fields;
    };

    if (aviso) {
      let template = new Discord.MessageEmbed()
        .attachFiles(this.migdrplogo as any)
        .attachFiles(this.bonobotlogo as any)
        .attachFiles(this.imgParla as any)
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
        .addFields(fieldsForEmbed())
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
      let template = new Discord.MessageEmbed()
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
                
                ***__ ${temarioData.titulo} __***
    
            `
        )
        .addFields(fieldsForEmbed())
        .setTimestamp()
        .setFooter(
          'Los bonobos apreciamos mucho la participación!!',
          'attachment://migdrp-icon.png'
        );

      return template;
    }
  }

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
    msgObject: Discord.Message,
    client: Discord.Client
  ) {
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

        let TurnsEmbed = this.crearEmbedTemario(true, temarioDataTest);

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

    let TurnsEmbed = this.crearEmbedTemario(false, temarioDataTestFull);

    await msgObject.channel.send(TurnsEmbed);
  }
}

