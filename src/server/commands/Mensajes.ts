import { Message, MessageEmbed, MessageAttachment, Client } from 'discord.js';
import path from 'path';

import { MigBotCommand } from '../interfaces/botApi';
import { validateCommandRestrictions } from '../utils/botValidation';

export default class Mensajes implements MigBotCommand {
  private readonly _command = 'mensajes';
  private currentEmbedMessage: Message;
  private migdrplogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/migdrp-logo-small-red.png`),
    'migdrp-icon.png'
  );
  private migdrplogoGreen = new MessageAttachment(
    path.join(__dirname, `../assets/img/migdrp-logo-small-green.png`),
    'migdrp-icon-green.png'
  );
  private bonobotlogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/bb_dsicordbackcolor.png`),
    'bb-logo.png'
  );

  private createEmbed(): MessageEmbed {
    const template = new MessageEmbed()
      .attachFiles(this.migdrplogoGreen as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#d5ae00')
      .setAuthor(
        'COMUNICADO BONÓBICO OFICIAL',
        'attachment://migdrp-icon-green.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setDescription(
        `

        \u200B 
        :warning:  \u200B \u200B \u200B ***_Sobre la charla sabatina_***  \u200B \u200B \u200B :warning:

            ¡Hey bonobos! ¿Qué tal? ¿Cómo les trata la vida? Luego de unas conversaciones en administración se decidió que para tener más calidad en los foros sabatinos, este será cada dos semanas, así que… **¡Nos vemos el sábado 19 de septiembre para el próximo foro!**  Mientras tanto, sigamos con las actividades habituales.
            
            \u200B
        `
      )
      .setThumbnail('attachment://bb-logo.png')
      .setTimestamp()
      .setFooter(
        'Para comentarios, inquietudes o sugerencias contacte a su esencial más cercano',
        'attachment://migdrp-icon-green.png'
      );

    return template;
  }

  constructor() {
    console.log('Mensajes Command Instantiated');
  }

  help(): string {
    return 'Este comando es el sitema de tickets de la comunidad bonóbica';
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  public async runCommand(args: string[], msgObject: Message, client: Client) {
    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }

    //Deletes the old embed message if exist
    if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
      await this.currentEmbedMessage.delete();
    }

    const TurnsEmbed = this.createEmbed();

    /*
        await msgObject.channel.send(`<@&705975181688045598>

Aqui tienen el temario para la parla sabatina, recuerden que cualquier informacion respecto al tema la pueden postear en <#698202549697773610>

`);
        */

    await msgObject.channel.send(`@everyone`);
    await msgObject.channel.send(TurnsEmbed);
  }
}