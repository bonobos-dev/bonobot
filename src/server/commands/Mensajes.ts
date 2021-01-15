import { Message, MessageEmbed, MessageAttachment, Client, TextChannel, MessageEmbedOptions } from 'discord.js';
import path from 'path';

import { CommandInterface } from '../interfaces/CommandInterface';
import { memberRolesHaveCommandPermission } from '../utils';

export default class Mensajes implements CommandInterface {
  private readonly _command = 'mensajes';
  private channel = '📣・avisos';
  private currentEmbedMessage: Message;

  private gaios = {
    title: 'El Sindicato de Gaios del Inframundo',
    description: `A quienes les gusta la historia en general, en este server abordan diversas épocas, especialmente en torno a Latinoamérica. Así como también cuentan con una biblioteca sobre historia, así como otros canales dedicados al ocio. Próximamente contarán con dos cursos: Mesoamérica y el Descubrimiento y Conquista de América.\n
    `,
    url: 'https://discord.gg/eJs2z4B',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/eJs2z4B',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private elagora = {
    title: 'El Ágora',
    description: 'Se trata de un pequeño espacio donde puedes participar en diversos foros, conversaciones casuales. También cuentan con un tablón de anuncios en donde puedes estar al tanto de nuevos vídeos de canales como Migala, El Pasquín, Esquizofrenia Natural, Quetzal, entre otros.  Está algo empolvado, es un buen server que realmente vale la pena.',
    url: 'https://discord.gg/EyZFAUS',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/EyZFAUS',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private operaprime = {
    title: 'Ópera Prima',
    description: '¡Si lo tuyo es la música en todas sus expresiones! ¡Este server te puede interesar! En Ópera Prima se dedican a la difusión, conocimiento, enseñanza y la conversación en torno a la música. Ahí cuentas con la opción de compartir tus proyectos, recomendar buenas piezas musicales o explorar nuevas opciones para agregar a tu repertorio.',
    url: 'https://discord.gg/cQFGqur5Yn',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/cQFGqur5Yn',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private escrituraylectura = {
    title: 'Escritura y lectura',
    description: `Desde Latinoamérica hasta España, la comunidad de escritores y lectores más grande de Discord -en español- abre sus puertas a nuevos miembros.

    Dedicados a la discusión y elaboración de literatura de todo tipo, buscamos participantes dispuestos a sumergirse en un clima de debate y creatividad, abarcando todos los géneros y formatos literarios.
    
    Somos una comunidad crítica, pensada para proveer una plataforma a escritores aspirantes en busca de apoyo y críticas, así como un hogar para todo aquel que desee conversar sobre todos los temas relacionados con la literatura universal.
    
    Recuerda verificarte con nuestro bot de seguridad mediante captcha, si no te llega ningún mensaje o no puedes hacerlo, envía un mensaje a los administradores de Escritura y lectura`,
    url: 'https://discord.gg/RjJFZZU',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/RjJFZZU',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private consejobonobivconeurociencias = {
    title: 'Consejo Bonóbico de Neurociencias',
    description: `No sabemos a ciencia cierta cuándo o como, lo que sí es que esta pasando. ¡Estás pensando! Desde el Big bag hasta el momento en que tus ojos leen estás líneas; tantos anónimos, poetas, filósofos, científicos y tecnologías... ¿Será que ahora después de tanto por fin podamos a empezar a dilucidar cómo es que toda esta odisea cósmica deriva en las playas de la consciencia? Eso, es lo que vamos averiguar juntos y llevar hasta la última consecuencia la pregunta: ¿Quién soy? Y posteriormente juntos, compartirla al mundo.`,
    url: 'https://discord.gg/hE7SqkG',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/hE7SqkG',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private comunidadHispanoParlante = {
    title: 'Comunidad Hispano-Parlante',
    description: `En este espacio contamos una gran variedad de interesantes secciones, cada una con su propio atractivo.\n
    **Liga Senshadou:** Nuestra joya de la corona. Se trata de batallas en equipos entre Panzers/Blindados de distintos países, todo bien reglamentado. Es otra manera de calmar esas ganas de invadir Polonia. Habrá premios al finalizar la temporada ;3.\n
    **Traductores:** ¿Habláis algún otro idioma? ¿Os gustaría traducir al Español otros contenidos en ese idioma para que más gente lo conozca? Pues este es vuestro lugar, hemos traducido muchas cosas, puedes buscarnos también en YouTube ;3\n
    ¡Eso y otras cosas más que encontraréis en el server, como la zona anime y de gaming!`,
    url: 'https://discord.gg/zAgq28r3mY',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/zAgq28r3mY',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private temario = {
    title: 'Comunidad Hispano-Parlante',
    description: `En este espacio contamos una gran variedad de interesantes secciones, cada una con su propio atractivo.\n
    **Liga Senshadou:** Nuestra joya de la corona. Se trata de batallas en equipos entre Panzers/Blindados de distintos países, todo bien reglamentado. Es otra manera de calmar esas ganas de invadir Polonia. Habrá premios al finalizar la temporada ;3.\n
    **Traductores:** ¿Habláis algún otro idioma? ¿Os gustaría traducir al Español otros contenidos en ese idioma para que más gente lo conozca? Pues este es vuestro lugar, hemos traducido muchas cosas, puedes buscarnos también en YouTube ;3\n
    ¡Eso y otras cosas más que encontraréis en el server, como la zona anime y de gaming!`,
    url: 'https://discord.gg/zAgq28r3mY',
    color: 8703273,
    author: {
      name: 'Alianza Bonóbica',
      url: 'https://discord.gg/zAgq28r3mY',
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
    },
    thumbnail: {
      url: 'https://cdn.discordapp.com/attachments/759558927657599007/794780127670173726/bb-logo.png',
    },
    footer: {
      icon_url: 'https://cdn.discordapp.com/attachments/794784166947717150/794785657738231808/migdrp-logo-small-green.png',
      text: 'Para información adicional de la embajada consulta a un administrador',
    },
  };

  private createEmbed(embeddata: MessageEmbedOptions): MessageEmbed {
    const template = new MessageEmbed(embeddata).setTimestamp();

    return template;
  }

  constructor() {
    //console.log('Mensajes Command Instantiated');
  }

  help(): string {
    return 'Este comando es el sitema de tickets de la comunidad bonóbica';
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  private async checkSelectedChannel(message: Message) {
    try {
      const channelFound = message.guild.channels.cache.findKey((channel) => channel.name === this.channel);

      if (channelFound) {
        //console.log('Channel Found: ', channelFound);
        return channelFound;
      }

      //console.log('Channel not found..');
      return null;
    } catch (e) {
      //console.log('Error on getSelectedChannel().. ', e);
    }
  }

  private async getSelectedChannel(client: Client, id: string) {
    try {
      const channelFound = client.channels.fetch(id);
      return channelFound;
    } catch (e) {
      //console.log('Error on getSelectedChannel().. ', e);
    }
  }

  public async runCommand(args: string[], content: string, msgObject: Message): Promise<void> {
    //if (!memberRolesHaveCommandPermission(this._command, msgObject)) return;

    //console.log('Arguments: ', args);

    //console.log('Content: ', content);

    await msgObject.channel.send(this.createEmbed(this.gaios));
    await msgObject.channel.send(this.gaios.url);
    await msgObject.channel.send(this.createEmbed(this.elagora));
    await msgObject.channel.send(this.elagora.url);
    await msgObject.channel.send(this.createEmbed(this.operaprime));
    await msgObject.channel.send(this.operaprime.url);
    await msgObject.channel.send(this.createEmbed(this.escrituraylectura));
    await msgObject.channel.send(this.escrituraylectura.url);
    await msgObject.channel.send(this.createEmbed(this.consejobonobivconeurociencias));
    await msgObject.channel.send(this.consejobonobivconeurociencias.url);
    await msgObject.channel.send(this.createEmbed(this.comunidadHispanoParlante));
    await msgObject.channel.send(this.comunidadHispanoParlante.url);

    return;
  }
}
