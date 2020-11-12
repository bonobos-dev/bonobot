import * as Discord from 'discord.js';

import { MigBotCommand } from '../botApi';

import { validateCommandRestrictions } from '../utils/botValidation';

import * as BotConfig from '../botConfig';

import { getHostUrl } from '../utils/networkUtil';

export default class Server implements MigBotCommand {
  private _command = 'server';
  private channel = '📌・sobre_el_servidor';

  private roles =
    BotConfig.config.env === 'production'
      ? BotConfig.roles.cb_real
      : BotConfig.roles.cb_pruebas;

  private currentEmbedMessage0: Discord.Message;
  private currentEmbedMessage1: Discord.Message;
  private currentEmbedMessage2: Discord.Message;
  private reactionCollector: Discord.ReactionCollector;

  private migdrplogo = new Discord.MessageAttachment(
    `${getHostUrl()}/img/migdrp-logo-small-parla_sabatina.png`,
    'migdrp-icon.png'
  );
  private bonobotlogo = new Discord.MessageAttachment(
    `${getHostUrl()}/img/cb-logo.png`,
    'bb-logo.png'
  );
  private imgParla = new Discord.MessageAttachment(
    `${getHostUrl()}/img/foro_img_horizontal.jpeg`,
    'foro-img.jpg'
  );

  private free = true;

  private async checkSelectedChannel(message: Discord.Message) {
    try {
      const channelFound = message.guild.channels.cache.findKey(
        (channel) => channel.name === this.channel
      );

      if (channelFound) {
        console.log('Channel Found: ', channelFound);
        return channelFound;
      }

      console.log('Channel not found..');
      return null;
    } catch (e) {
      console.log('Error on getSelectedChannel().. ', e);
    }
  }

  private async getSelectedChannel(client: Discord.Client, id: string) {
    try {
      const channelFound = client.channels.fetch(id);
      return channelFound;
    } catch (e) {
      console.log('Error on getSelectedChannel().. ', e);
    }
  }

  constructor() {
    console.log('Server Command Instantiated');
  }

  private crearEmbedSobreRoles(): Discord.MessageEmbed {
    const template = new Discord.MessageEmbed()
      .attachFiles(this.migdrplogo as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#a956bd')
      .setAuthor(
        'INFORMACIÓN SOBRE EL SERVIDOR',
        'attachment://migdrp-icon.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setThumbnail('attachment://bb-logo.png')

      .setDescription(
        `
\u200B
        `
      )

      .addFields({
        name: `**Rᴏʟᴇs ᴘʀɪɴᴄɪᴘᴀʟᴇs**`,
        value: `
𝖫𝗈𝗌 𝗋𝗈𝗅𝖾𝗌 𝗉𝗋𝗂𝗇𝖼𝗂𝗉𝖺𝗅𝖾𝗌 𝗋𝖾𝗆𝖺𝗋𝖼𝖺𝗇 𝗅𝖺 𝖺𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽, 𝗅𝗈𝗌 𝗉𝖾𝗋𝗆𝗂𝗌𝗈𝗌 𝗒 𝗅𝖺𝗌 𝗋𝖾𝗌𝗉𝗈𝗇𝗌𝖺𝖻𝗂𝗅𝗂𝖽𝖺𝖽𝖾𝗌 𝖽𝖾 𝗅𝗈𝗌 𝗎𝗌𝗎𝖺𝗋𝗂𝗈𝗌 𝖽𝖾𝗇𝗍𝗋𝗈 𝖽𝖾𝗅 𝗌𝖾𝗋𝗏𝗂𝖽𝗈𝗋, 𝗌𝖾 𝖽𝗂𝗏𝗂𝖽𝖾𝗇 𝖾𝗇 𝖻𝖺́𝗌𝗂𝖼𝗈𝗌 𝗒 𝖺𝗏𝖺𝗇𝗓𝖺𝖽𝗈𝗌. 𝖫𝗈𝗌 𝗋𝗈𝗅𝖾𝗌 𝖺𝗏𝖺𝗇𝗓𝖺𝖽𝗈𝗌 𝖾𝗌𝗍𝖺́𝗇 𝖺𝗅 𝗌𝖾𝗋𝗏𝗂𝖼𝗂𝗈 𝖽𝖾 𝗅𝖺 𝖼𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽.
\u200B
\u200B \u200B <@&${this.roles.austalopitecus.id}>
${'```Es el rol automático para cuando ingresan al servidor.```'}
\u200B \u200B <@&${this.roles.chimpancé.id}>
${'```Es el rol que se te asigna una vez estás verificado.```'}
\u200B \u200B <@&${this.roles.bonobo.id}>
${'```Se asigna a los usuarios que una vez verificados tienen actividad en el servidor.```'}
\u200B \u200B <@&${this.roles.intercambiable.id}>
${'```Usuarios que tienen una actividad significativa dentro del servidor y promueven el cumplimiento de las reglas.```'}
\u200B \u200B <@&${this.roles.influyente.id}>
${'```Usuarios con funciones de moderación.```'}
\u200B \u200B <@&${this.roles.esencial.id}>
${'```Usuarios con funciones administrativas.```'}
\u200B
\u200B
        `,
      })
      .addFields({
        name: `**Pᴏʀ ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs**`,
        value: `
\u200B
\u200B \u200B <@&${this.roles['parla sabatina'].id}>
${'```Para recibir los avisos relacionados al foro sabatino.```'}
\u200B \u200B <@&${this.roles.lumierista.id}>
${'```Se te informará sobre las transmisiones de series, películas o cualquier otro contenido audiovisual.```'}
\u200B \u200B <@&${this.roles['lector avispado'].id}>
${'```Se te informará sobre las actividades de lectura.```'}
\u200B \u200B <@&${this.roles['bonobo literario'].id}>
${'```Rol del Círculo Literario Bonóbico, para personas que tengan interés por escribir o escritores aficionados.```'}
\u200B \u200B <@&${this.roles.chaturanga.id}>
${'```Rol del club de ajedrez, para aquellos que disfruten de este deporte o quieran aprender a jugarlo.```'}        
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B \u200B <@&${this.roles['eco bonobo'].id}>
${'```Rol de La reserva, para todos aquellos que tengan interés por temas relacionados con la ecología, huertos, y biósfera en general.```'}
\u200B \u200B <@&${this.roles.políglota.id}>
${'```Rol del club Lenguas Homínidas, para quienes disfruten de aprender idiomas.```'}
\u200B \u200B <@&${this.roles.cinéfilo.id}>
${'```Rol del club de cine, para quienes tengan interés en el arte del cine.```'}
\u200B \u200B <@&${this.roles.sabronobo.id}>
${'```Rol del club Jardín de las delicias, para todos los que tengan interés en la gastronomía```'}
\u200B
\u200B
        `,
      })

      .addFields({
        name: `**Pᴏʀ ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs ᴇᴅᴜᴄᴀᴛɪᴠᴀs**`,
        value: `
\u200B
\u200B \u200B <@&${this.roles['homo economicus'].id}>
${'```Para quienes deseen asistir a las clases de economía.```'}
\u200B \u200B <@&${this.roles['photo shoppers'].id}>
${'```Para quienes desean asistir a nuestro taller de Photoshop.```'}
\u200B \u200B <@&${this.roles['homo artem'].id}>
${'```Para quienes deseen asistir a las clases de historia del arte.```'}
\u200B \u200B <@&${this.roles.entomófagos.id}>
${'```Para quienes deseen asistir a las clases de entomología.```'}
\u200B \u200B <@&${this.roles['homo sonitus'].id}>
${'```Para quienes desean asistir a clases de diseño sonoro con DAW```'}
\u200B \u200B <@&${this.roles["Deutsche Primat"].id}>
${'```Para quienes desean asistir a clases de alemán```'}
\u200B
\u200B
        `,
      })

      .addFields({
        name: `**Tᴇᴍᴘᴏʀᴀʟᴇs**`,
        value: `
\u200B
\u200B \u200B <@&${this.roles.stremears.id}>
${'```Se asigna a los usuarios que deban transmitir en el servidor.```'}
\u200B
\u200B
        `,
      })

      .addFields({
        name: `**Rᴇsᴇʀᴠᴀᴅᴏs**`,
        value: `
\u200B
\u200B \u200B <@&${this.roles.embajadores.id}>
${'```Rol de relaciones públicas, reservado para los administradores de otros servidores.```'}
\u200B
\u200B
        `,
      })

      .addFields({
        name: `**Aʀᴄʜɪᴠᴀᴅᴏs**`,
        value: `
\u200B
\u200B \u200B <@&${this.roles['komecanto esperantisto'].id}>
${'```Rol correspondiente a las clases de esperanto que se impartieron en la comunidad, puedes verlo en nuestros canales archivados asignándote el rol.```'}
\u200B
\u200B
        `,
      })

      .setTimestamp()
      .setFooter('Bienvenido Bonobo!!', 'attachment://migdrp-icon.png');

    return template;
  }

  private crearEmbedSobreElServidor1(): Discord.MessageEmbed {
    const template = new Discord.MessageEmbed()
      .attachFiles(this.migdrplogo as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#a956bd')
      .setAuthor(
        'INFORMACIÓN SOBRE EL SERVIDOR',
        'attachment://migdrp-icon.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setThumbnail('attachment://bb-logo.png')

      .setDescription(
        `
\u200B
        `
      )

      .addFields({
        name: `**Esᴛʀᴜᴄᴛᴜʀᴀ ᴅᴇʟ sᴇʀᴠɪᴅᴏʀ** `,
        value: `
\u200B
${'``🌄 PUERTAS DEL SAMSARA 🌄``'}
\u200B
𝖤𝗌𝗍𝖺 𝖾𝗌 𝗅𝖺 𝖾𝗇𝗍𝗋𝖺𝖽𝖺 𝖺 𝗇𝗎𝖾𝗌𝗍𝗋𝖺 𝖼𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽, 𝗎́𝗇𝗂𝖼𝖺𝗆𝖾𝗇𝗍𝖾 𝖾𝗌 𝗏𝗂𝗌𝗂𝖻𝗅𝖾 𝗉𝖺𝗋𝖺 𝗅𝗈𝗌 𝗎𝗌𝗎𝖺𝗋𝗂𝗈𝗌 𝗊𝗎𝖾 𝗇𝗈 𝗌𝖾 𝗁𝖺𝗇 𝗏𝖾𝗋𝗂𝖿𝗂𝖼𝖺𝖽𝗈.
\u200B
${'``✅・verificación``'}
${'```Encontrarán las reglas, podrán asignarse los roles de las actividades que más les interesen y se verificarán.```'}
${'``📌・sobre_el_servidor``'}
${'```Aquí podrán encontrar la información de los roles y la estructura del servidor.```'}
\u200B
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``📞 LÍNEA DIRECTA 📞``'}
\u200B
𝖤𝗌𝗍𝖺 𝖼𝖺𝗍𝖾𝗀𝗈𝗋𝗂́𝖺 𝖾𝗌 𝗅𝖺 𝖼𝗈𝗇𝖾𝗑𝗂𝗈́𝗇 𝖼𝗈𝗇 𝗅𝖺 𝖺𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝖼𝗂𝗈́𝗇.
\u200B
${'``📢・avisos``'}
${'```Aquí encontrarás los comunicados oficiales de la Comunidad Bonóbica.```'}
${'``💎・recursos``'}
${'```Aquí encontrarás los recursos del servidor. Información sobre el servidor, las reglas, los roles y los formatos establecidos para los distintos canales.```'}
${'``🔔・campanario``'}
${'```En este canal se notificará contenido audiovisual de interés.```'}
${'``📮・propuestas``'}
${'```Espacio de retroalimentación bonóbica. Aquí puedes dejarnos tus sugerencias para mejorar el servidor, recuerda seguir el formato establecido.```'}
${'``📣・la_mampara``'}
${'```En este espacio puedes realizar denuncias anónimas sobre alguna actividad de uno o varios usuarios en el servidor, recuerda seguir el formato establecido.```'}
\u200B
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``☕ ESTACION CAFEÍNA ☕``'}
\u200B
${'``🐒・la_plaza``'}
${'```Aquí pueden tener una plática abierta con todos los bonobos, disfruten de conversaciones amenas sin ningún tema en específico.```'}
${'``🐵・el_ágora``'}
${'```Espacio para conversaciones con cierta formalidad, una charla amena sobre un tema específico del que quieras hablar con los bonobos.```'}
${'``🔬・ciencias_biológicas``'}
${'```Canal destinado a las ciencias que se dediquen a estudiar la vida y sus procesos. Pueden compartir información o tener charlas al respecto.```'}
${'``📐・ciencias_exactas``'}
${'```Canal destinado a ramas de la ciencia como física y matemáticas, y lo que se relacione con ellas.```'}`,
      })
      .addFields({
        name: `\u200B`,
        value: `
${'``👥・ciencias_humanas``'}
${'```Canal destinado a las ciencias y disciplinas cuyo objeto es el ser humano.```'}
${'``🌎・ciencias_sociales``'}
${'```Canal destinado a las ramas de la ciencia relacionadas con la sociedad y el comportamiento humano.```'}
${'``💼・geopolítica_e_historia``'}
${'```Canal destinado al estudio de los efectos de la geografía humana y la geografía física sobre la política y las relaciones internacionales, y al estudio de los sucesos del pasado.```'}
${'``🎥・arte_y_fotografía``'}
${'```Canal destinado para todo tipo de arte. Pueden compartir información o tener charlas al respecto.```'}
\u200B
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``📩 CASETA ELECTORAL 📩``'}
\u200B
𝖤𝗇 𝖾𝗌𝗍𝖺 𝗌𝖾𝖼𝖼𝗂𝗈́𝗇 𝗌𝖾 𝗁𝖺𝖼𝖾𝗇 𝗅𝖺𝗌 𝗉𝗋𝗈𝗉𝗎𝖾𝗌𝗍𝖺𝗌 𝗒 𝗌𝖾 𝗋𝖾𝖺𝗅𝗂𝗓𝖺𝗇 𝗅𝖺𝗌 𝗏𝗈𝗍𝖺𝖼𝗂𝗈𝗇𝖾𝗌 𝗉𝖺𝗋𝖺 𝗅𝖺𝗌 𝖽𝗂𝗌𝗍𝗂𝗇𝗍𝖺𝗌 𝖺𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽𝖾𝗌 𝖽𝖾 𝗅𝖺 𝖼𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽. ¡𝖣𝖾𝖼𝗂𝖽𝖾 𝖼𝗈𝗇 𝗌𝖺𝖻𝗂𝖽𝗎𝗋𝗂́𝖺, 𝖻𝗈𝗇𝗈𝖻𝗈!
\u200B
${'``📥・urna_sabatina``'}
${'```Aquí encontrarás las propuestas de temas para el foro sabatino y podrás votar por la que más te agrade.```'}
${'``📕・urna_literaria``'}
${'```Aquí encontrarás las propuestas de los libros para las actividades de lectura y podrás votar por la que más te agrade.```'}
${'``🎓・urna_educativa``'}
${'```Aquí encontrarás las propuestas para las actividades educativas (cursos / talleres), y podrás votar por la que más te agrade.```'}
${'``📡・urna_streamer``'}
${'```Aquí encontrarás las propuestas de temas para transmisiones en la comunidad (contenido audiovisual), y podrás votar por la que más te agrade.```'}
\u200B
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``👾 LA FRIKIPLAZA 👾``'}
\u200B
𝖤𝗌𝗍𝖾 𝖾𝗌𝗉𝖺𝖼𝗂𝗈 𝖾𝗌𝗍𝖺́ 𝖽𝖾𝗌𝗍𝗂𝗇𝖺𝖽𝗈 𝖺 𝗍𝖾𝗆𝖺𝗌 𝗋𝖾𝗅𝖺𝖼𝗂𝗈𝗇𝖺𝖽𝗈𝗌 𝖼𝗈𝗇 𝗏𝗂𝖽𝖾𝗈𝗃𝗎𝖾𝗀𝗈𝗌, 𝖺𝗇𝗂𝗆𝖾, 𝗆𝖺𝗇𝗀𝖺, 𝖼𝗈𝗆𝗂𝖼𝗌 𝗈 𝖼𝗎𝖺𝗅𝗊𝗎𝗂𝖾𝗋 𝖼𝗈𝗇𝗍𝖾𝗇𝗂𝖽𝗈 𝗊𝗎𝖾 𝗍𝗎 𝗅𝖺𝖽𝗈 𝖿𝗋𝗂𝗄𝗂 𝗊𝗎𝗂𝖾𝗋𝖺 𝖼𝗈𝗆𝗉𝖺𝗋𝗍𝗂𝗋.
\u200B
${'``🤓・zona_geek``'}
${'```Aquí puedes compartir información sobre los temas frikis de tu preferencia.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``🎲・sala_arcade``'}
${'```En este canal puedes jugar con los bots que tenemos en la comunidad.```'}
${'``🎴・zona_miscelánea``'}
${'```En este canal pueden compartir memes, u otra clase de contenido sin una clasificación específica.```'}
${'``🎮・chat・💬``'}
${'```¿No puedes hablar? ¡No te preocupes! Puedes usar este canal para conversaciones en el canal de voz Gaming.```'}
${'``🎮・Gaming``'}
${'```Canal de voz para ser utilizado en las actividades de La Frikiplaza.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``💽 ARCHIVO BONÓBICO 💽``'}
\u200B
${'``📚・biblioteca_de_alejandría``'}
${'```¡Nuestra biblioteca oficial! Aquí puedes compartir textos para la comunidad.```'}
${'``🎵・música_bonóbica``'}
${'```Espacio para recomendaciones musicales, es hora de ponerle ritmo a nuestras vidas con la mejor música bonóbica.```'}
${'``📺・telebonobo``'}
${'```En este canal puedes compartir contenido audiovisual de interés para la comunidad.```'}
${'``🏢・embajadas``'}
${'```En este canal encontrarás invitaciones a servidores que pueden interesarte.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``🚩 ESTACIÓN PRAXIS 🚩``'}
\u200B
${'``📝・círculo_literario``'}
${'```Actividades enfocadas en los usuarios que tengan interés por escribir.```'}
${'``📔・tendedero_literario``'}
${'```Espacio para que los bonobos compartan sus escritos.```'}
${'``👑・club_de_ajedrez``'}
${'```Canal para las actividades del Club de ajedrez. Talleres de aprendizaje, torneos y partidas casuales en línea.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``🌿・la_reserva``'}
${'```Canal enfocado en actividades y discusión de ecología, huertos, y biósfera en general.```'}
${'``👅・lenguas_homínidas``'}
${'```Actividades enfocadas en el aprendizaje de idiomas.```'}
${'``🎬・el_bonobo_de_rosemary``'}
${'```Canal destinado a las actividades del club de cine. Transmisión de películas, crítica, conversación sobre cine y más.```'}
${'``🍞・jardín_de_las_delicias``'}
${'```Actividades enfocadas a todo lo relacionado con la gastronomía, se comparten recetas y se transmiten en vivo.```'}
${'``📖・𝚂𝚊𝚕𝚊 𝟷・🔊 | 📖・𝚂𝚊𝚕𝚊 𝟸・🔊 | 📖・𝚂𝚊𝚕𝚊 𝟹・🔊``'}
${'```Canales de audio para utilizarse en las actividades de la estación praxis.```'}
        `,
      })

      .setTimestamp()
      .setFooter('Bienvenido Bonobo!!', 'attachment://migdrp-icon.png');

    return template;
  }

  private crearEmbedSobreElServidor2(): Discord.MessageEmbed {
    const template = new Discord.MessageEmbed()
      .attachFiles(this.migdrplogo as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#a956bd')
      .setAuthor(
        'INFORMACIÓN SOBRE EL SERVIDOR',
        'attachment://migdrp-icon.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setThumbnail('attachment://bb-logo.png')

      .setDescription(
        `
\u200B
        `
      )

      .addFields({
        name: `\u200B`,
        value: `
${'``🏫 LICEO BONÓBICO 🏫``'}
\u200B
${'``💸・economía_clases``'}
${'```Canal para las clases de economía impartidas por REDxDJ.```'}
${'``💻・photoshop_taller``'}
${'```Canal para el taller de Photoshop impartido por Aronelusuario.```'}
${'``🏺・historia_del_arte``'}
${'```Canal para las clases de historia del arte impartidas por Rostæm.```'}
${'``🦗・entomología``'}
${'```Canal para las clases de entomología impartidas por Grillo.```'}
${'``📖・𝚂𝚊𝚕𝚘́𝚗 𝙰・🔊 | 📖・𝚂𝚊𝚕𝚘́𝚗 𝙱・🔊 | 📖・𝚂𝚊𝚕𝚘́𝚗 𝙲・🔊``'}
${'```Canales de audio para utilizarse en las actividades del Liceo Bonóbico.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``🙊 AUDITORIO BONÓBICO 🙊``'}
\u200B
${'``🌐・repositorio_sabatino``'}
${'```Aquí pueden compartir contenido relacionado con el foro sabatino, comparte videos, libros, artículos o cualquier otra fuente de información.```'}
${'``💌・recados_bonóbicos``'}
${'```Sección para los mensajes intermedios del foro sabatino.```'}
${'``🎤・voz_escrita``'}
${'```¿No puedes hablar? ¡No te preocupes! Puedes usar este canal para conversaciones en el canal de voz Foro Sabatino, y anexar fuentes citadas.```'}
${'``🎤・Foro Sabatino``'}
${'```Canal de audio destinado para el foro sabatino.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``🍺 TABERNA BONÓBICA 🍺``'}
\u200B
𝖤𝗌𝗍𝖾 𝖾𝗌𝗉𝖺𝖼𝗂𝗈 𝖾𝗌𝗍𝖺́ 𝖽𝖾𝗌𝗍𝗂𝗇𝖺𝖽𝗈 𝖺 𝗅𝖺 𝖼𝗈𝗇𝗏𝗂𝗏𝖾𝗇𝖼𝗂𝖺 𝖻𝗈𝗇𝗈́𝖻𝗂𝖼𝖺, 𝗎́𝗇𝖾𝗍𝖾 𝖾𝗇 𝖼𝗎𝖺𝗅𝗊𝗎𝗂𝖾𝗋 𝗆𝗈𝗆𝖾𝗇𝗍𝗈 𝖺 𝖼𝗁𝖺𝗋𝗅𝖺𝗋 𝖼𝗈𝗇 𝗅𝗈𝗌 𝖻𝗈𝗇𝗈𝖻𝗈𝗌 𝗈 𝖺 𝖾𝗌𝖼𝗎𝖼𝗁𝖺𝗋 𝗆𝗎́𝗌𝗂𝖼𝖺 𝖾𝗇 𝗇𝗎𝖾𝗌𝗍𝗋𝖺 𝗋𝖺𝖽𝗂𝗈 𝖻𝗈𝗇𝗈𝖻𝗈.
\u200B
${'``🎧・rockola``'}
${'```Canal para comandos de bots musicales.```'}
${'``🍻・chat・💬``'}
${'```¿No puedes hablar? ¡No te preocupes! Puedes usar este canal para conversaciones en el canal de voz Barra Libre.```'}
${'``🥂・chat・💬``'}
${'```¿No puedes hablar? ¡No te preocupes! Puedes usar este canal para conversaciones en el canal de voz La Terraza.```'}
${'``📻・chat・💬``'}
${'```Este canal es para utilizarse en conversaciones del canal de voz Radio Bonobo.```'}
${'``🍻・Barra Libre``'}
${'```Canal de voz para conversaciones casuales. No está permitido activar la cámara ni stremear.```'}
${'``🥂・La Terraza``'}
${'```Canal de voz para conversaciones casuales.```'}
${'``📻・Radio Bonobo``'}
${'```Canal de voz para escuchar música entre bonobos.```'}
        `,
      })

      .addFields({
        name: `\u200B`,
        value: `
${'``🚧 LA POCILGA 🚧``'}
\u200B
Podrás ver esta categoría al obtener tu rol de bonobo, ten cuidado, el contenido puede no ser apto para todos.
\u200B
${'``🐀・el_sótano``'}
${'```The toxicity of our city, our city. Canal para ser “tóxico” o hablar de lo que quieras como quieras. ¡Atención! Lo que pasa en el sótano, se queda en el sótano. Si te piden no continuar con una broma, o se te dice que le bajes un poco a lo que dices, tenerlo en cuenta y no insistir.```'}
${'``🍆・canal_de_sexo``'}
${'```Canal para contenido NSFW, no se permite el ChildPorn ni el gore.```'}
${'``💤・Arenas de Morfeo``'}
${'```Los canales de voz no son para dormir, si entraste a uno y estuviste inactivo mucho tiempo, terminarás en este canal.```'}
        `,
      })

      .setTimestamp()
      .setFooter('Bienvenido Bonobo!!', 'attachment://migdrp-icon.png');

    return template;
  }

  public help(): string {
    return 'El comando para configurar el canal de verificación';
  }

  public isThisCommand(command: string): boolean {
    return command === this._command;
  }

  public async runCommand(
    args: string[],
    msgObject: Discord.Message,
    client: Discord.Client
  ) {
    console.log('command verificador ejecutado');

    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }

    if (args.length > 0) {
      if (args[0] === 'sobre_el_servidor') {
        const channel_ID = await this.checkSelectedChannel(msgObject);

        if (channel_ID === null) {
          msgObject.author.send(
            'No encuentro el canal de verificación, no puedo postear el mensaje de verificación.'
          );
          return;
        }

        if (args[1] !== null && args[1] !== undefined) {
          msgObject.author.send('Este comando no lleva esos argumentos');
          return;
        }

        const channelDenuncias = (await this.getSelectedChannel(
          msgObject.client,
          channel_ID
        )) as Discord.TextChannel;

        const embedRoles = this.crearEmbedSobreRoles();
        const embedservidor1 = this.crearEmbedSobreElServidor1();
        const embedservidor2 = this.crearEmbedSobreElServidor2();

        //Deletes the old embed message if exist
        /*
                if(this.currentEmbedMessage0 && !this.currentEmbedMessage0.deleted){
                    await this.currentEmbedMessage0.delete();
                }

                if(this.currentEmbedMessage1 && !this.currentEmbedMessage1.deleted){
                    await this.currentEmbedMessage1.delete();
                }

                if(this.currentEmbedMessage2 && !this.currentEmbedMessage2.deleted){
                    await this.currentEmbedMessage2.delete();
                }

                */
        await msgObject.channel.send(embedRoles);
        await msgObject.channel.send(embedservidor1);
        await msgObject.channel.send(embedservidor2);
      }
    }
  }
}

