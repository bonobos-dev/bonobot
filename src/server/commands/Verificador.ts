import {MessageAttachment, Message, MessageEmbed, Client,ReactionCollector, TextChannel,MessageReaction} from 'discord.js';

import CommandInterface from '../interfaces/CommandInterface';

import { validateCommandRestrictions } from '../utils/botValidation';

import { roles,config } from '../botConfig';

import path from 'path';

export default class Verificador implements CommandInterface {
  private _command = 'verificador';
  private channel = '✅・verificación';
  private rolesChannel = '💎・roles';
  private roles =
    config.env === 'production'
      ? roles.cb_real
      : roles.cb_pruebas;

  private currentEmbedMessage: Message;
  private reactionCollector: ReactionCollector;

  private currentEmbedMessage2: Message;
  private reactionCollector2: ReactionCollector;

  private migdrplogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/migdrp-logo-small-parla_sabatina.png`),
    'migdrp-icon.png'
  );
  private bonobotlogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/cb-logo.png`),
    'bb-logo.png'
  );
  private imgParla = new MessageAttachment(
    path.join(__dirname, `../assets/img/foro_img_horizontal.jpeg`),
    'foro-img.jpg'
  );

  private free = true;

  private async checkSelectedChannel(message: Message) {
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

  private async getSelectedChannel(client: Client, id: string) {
    try {
      const channelFound = client.channels.fetch(id);
      return channelFound;
    } catch (e) {
      console.log('Error on getSelectedChannel().. ', e);
    }
  }

  private async checkSelectedChannel2(message: Message) {
    try {
      const channelFound = message.guild.channels.cache.findKey(
        (channel) => channel.name === this.rolesChannel
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

  private async getSelectedChannel2(client: Client, id: string) {
    try {
      const channelFound = client.channels.fetch(id);
      return channelFound;
    } catch (e) {
      console.log('Error on getSelectedChannel().. ', e);
    }
  }

  constructor() {
    console.log('Verificador Command Instantiated');
  }

  private crearEmbedVerificador(): MessageEmbed {
    const template = new MessageEmbed()
      .attachFiles(this.migdrplogo as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#a956bd')
      .setAuthor(
        'BIENVENIDO A LA COMUNIDAD BONÓBICA',
        'attachment://migdrp-icon.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setThumbnail('attachment://bb-logo.png')

      .setDescription(
        `
\u200B 
**Nᴜᴇsᴛʀᴀ ɪɴɪᴄɪᴀᴛɪᴠᴀ**
\u200B
𝖫𝖺 𝖢𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽 𝖡𝗈𝗇𝗈́𝖻𝗂𝖼𝖺 𝖾𝗌 𝗎𝗇 𝗉𝗋𝗈𝗒𝖾𝖼𝗍𝗈 𝖾𝗇𝖿𝗈𝖼𝖺𝖽𝗈 𝖾𝗇 𝖼𝗋𝖾𝖺𝗋 𝗎𝗇 𝖾𝗌𝗉𝖺𝖼𝗂𝗈 𝖽𝖾 𝖼𝗋𝖾𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝗈, 𝖺𝖻𝗂𝖾𝗋𝗍𝗈 𝖺𝗅 𝖽𝗂𝖺́𝗅𝗈𝗀𝗈, 𝗊𝗎𝖾 𝖺𝖻𝗋𝖺𝖼𝖾 𝗅𝖺 𝖽𝗂𝗏𝖾𝗋𝗌𝗂𝖽𝖺𝖽 𝗒 𝗅𝖺 𝖼𝗈𝗆𝗉𝗅𝖾𝗃𝗂𝖽𝖺𝖽 𝖽𝖾𝗅 𝗉𝖾𝗇𝗌𝖺𝗆𝗂𝖾𝗇𝗍𝗈, 𝗒 𝗊𝗎𝖾 𝖺 𝗍𝗋𝖺𝗏𝖾́𝗌 𝖽𝖾 𝗅𝖺 𝖼𝗈𝗈𝗉𝖾𝗋𝖺𝖼𝗂𝗈́𝗇 𝗒 𝗅𝖺 𝗂𝗇𝗍𝖾𝗋𝖺𝖼𝖼𝗂𝗈́𝗇 𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝖾 𝗎𝗇 𝖺́𝗋𝖾𝖺 𝖽𝖾 𝖽𝗂𝗏𝗎𝗅𝗀𝖺𝖼𝗂𝗈́𝗇 𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝖼𝗂𝗈́𝗇 𝖽𝖾 𝖼𝗈𝗇𝗈𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝗈, 𝗉𝗋𝗈𝗆𝗈𝗏𝗂𝖾𝗇𝖽𝗈 𝗅𝖺 𝗏𝗂𝗌𝗂𝗈́𝗇 𝖽𝖾 𝖼𝗈𝗅𝖺𝖻𝗈𝗋𝖺𝖼𝗂𝗈́𝗇, 𝗋𝖾𝗌𝗉𝖾𝗍𝗈 𝗒 𝗋𝖾𝗍𝗋𝗈𝖺𝗅𝗂𝗆𝖾𝗇𝗍𝖺𝖼𝗂𝗈́𝗇, 𝖾𝗇𝗍𝖾𝗇𝖽𝗂𝖾𝗇𝖽𝗈 𝖺 𝗅𝗈𝗌 𝗈𝗍𝗋𝗈𝗌 𝖽𝖾𝗌𝖽𝖾 𝗅𝖺 𝖾𝗆𝗉𝖺𝗍𝗂́𝖺 𝗒 𝗅𝖺 𝖼𝗋𝗂́𝗍𝗂𝖼𝖺; 𝗌𝗂𝖾𝗇𝖽𝗈 𝖺𝗌𝗂́ 𝗎𝗇 𝗉𝗎𝗇𝗍𝗈 𝖽𝖾 𝖾𝗇𝖼𝗎𝖾𝗇𝗍𝗋𝗈 𝗉𝖺𝗋𝖺 𝗅𝖺𝗌 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗌 𝗊𝗎𝖾 𝖽𝖾𝗌𝖾𝖾𝗇 𝖼𝗈𝗆𝗉𝖺𝗋𝗍𝗂𝗋 𝗌𝗎𝗌 𝗂𝖽𝖾𝖺𝗌 𝗒 𝖽𝖾𝗌𝖺𝗋𝗋𝗈𝗅𝗅𝖺𝗋 𝗌𝗎𝗌 𝗁𝖺𝖻𝗂𝗅𝗂𝖽𝖺𝖽𝖾𝗌 𝖾𝗇 𝗎𝗇 𝖺𝗆𝖻𝗂𝖾𝗇𝗍𝖾 𝖽𝖾 𝗋𝖾𝗌𝗉𝖾𝗍𝗈, 𝖼𝗈𝗇𝗍𝗋𝗂𝖻𝗎𝖼𝗂𝗈́𝗇 𝖾 𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝖾𝗌 𝗏𝖺𝗋𝗂𝖺𝖽𝗈𝗌.
\u200B
\u200B
        `
      )
      .addFields({
        name: `:scroll: \u200B **ʟᴇᴇ ᴄᴏɴ ᴀᴛᴇɴᴄɪᴏ́ɴ ɴᴜᴇsᴛʀᴏ ʀᴇɢʟᴀᴍᴇɴᴛᴏ**
\u200B`,
        value: `
Rᴇɢʟᴀ **#1** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 ℎ𝑎𝑐𝑒𝑟 𝑠𝑝𝑎𝑚.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#2** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑛𝑖𝑛𝑔𝑢𝑛𝑎 𝑐𝑙𝑎𝑠𝑒 𝑑𝑒 𝑟𝑢𝑖𝑑𝑜 𝑚𝑜𝑙𝑒𝑠𝑡𝑜 𝑚𝑎𝑙𝑖𝑛𝑡𝑒𝑛𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑒𝑛 𝑙𝑜𝑠 𝑐𝑎𝑛𝑎𝑙𝑒𝑠 𝑑𝑒 𝑣𝑜𝑧, 𝑑𝑒𝑏𝑒𝑛 𝑠𝑖𝑙𝑒𝑛𝑐𝑖𝑎𝑟 𝑠𝑢 𝑚𝑖𝑐𝑟𝑜́𝑓𝑜𝑛𝑜 𝑠𝑖 𝑛𝑜 𝑒𝑠𝑡𝑎́𝑛 ℎ𝑎𝑏𝑙𝑎𝑛𝑑𝑜.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#3** 
${'```𝑆𝑒 𝑑𝑒𝑏𝑒𝑛 𝑙𝑒𝑒𝑟 𝑙𝑎𝑠 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑐𝑎𝑑𝑎 𝑐𝑎𝑛𝑎𝑙, 𝑛𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑖𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑓𝑢𝑒𝑟𝑎 𝑑𝑒𝑙 𝑐𝑎𝑛𝑎𝑙 𝑐𝑜𝑟𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑒𝑛𝑡𝑒.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#4** 
${'```𝐸𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑁𝑆𝐹𝑊 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑢́𝑛𝑖𝑐𝑎𝑚𝑒𝑛𝑡𝑒 𝑒𝑛 🍆・canal_de_sexo. 𝑆𝑒 𝑝𝑟𝑜ℎ𝑖́𝑏𝑒 𝑒𝑙 𝐶ℎ𝑖𝑙𝑑𝑃𝑜𝑟𝑛 𝑦 𝑒𝑙 𝑔𝑜𝑟𝑒.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#5** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑙𝑎 𝑝𝑟𝑜𝑝𝑎𝑔𝑎𝑛𝑑𝑎, 𝑙𝑎 𝑝𝑢𝑏𝑙𝑖𝑐𝑖𝑑𝑎𝑑 𝑑𝑒𝑏𝑒 𝑠𝑒𝑟 𝑎𝑢𝑡𝑜𝑟𝑖𝑧𝑎𝑑𝑎 𝑝𝑜𝑟 𝑙𝑎 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑐𝑖𝑜́𝑛.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#6** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑎𝑏𝑢𝑠𝑎𝑟 𝑑𝑒 𝑙𝑜𝑠 𝑒𝑚𝑜𝑗𝑖𝑠, ℎ𝑎𝑦 𝑢𝑛 𝑙𝑖́𝑚𝑖𝑡𝑒 𝑑𝑒 20 𝑒𝑚𝑜𝑗𝑖𝑠 𝑝𝑜𝑟 𝑚𝑒𝑛𝑠𝑎𝑗𝑒.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#7** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑛𝑜𝑚𝑏𝑟𝑒𝑠 𝑐𝑜𝑛 𝑠𝑖́𝑚𝑏𝑜𝑙𝑜𝑠 𝑒𝑥𝑡𝑟𝑎𝑣𝑎𝑔𝑎𝑛𝑡𝑒𝑠 𝑛𝑖 𝑓𝑜𝑡𝑜𝑠 𝑑𝑒 𝑝𝑒𝑟𝑓𝑖𝑙 𝑁𝑆𝐹𝑊.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#8** 
${'```𝑆𝑜𝑙𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑑𝑜𝑠 𝑐𝑢𝑒𝑛𝑡𝑎𝑠 𝑝𝑜𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#9** 
${'```𝑃𝑟𝑖𝑜𝑟𝑖𝑧𝑎𝑚𝑜𝑠 𝑒𝑙 𝑟𝑒𝑠𝑝𝑒𝑡𝑜 𝑚𝑢𝑡𝑢𝑜, 𝑑𝑒𝑏𝑒𝑛 𝑐𝑢𝑖𝑑𝑎𝑟 𝑙𝑎 𝑓𝑜𝑟𝑚𝑎 𝑑𝑒 𝑒𝑥𝑝𝑟𝑒𝑠𝑎𝑟𝑠𝑒, 𝑛𝑜 𝑖𝑚𝑝𝑜𝑛𝑔𝑎𝑛 𝑖𝑑𝑒𝑎𝑠 𝑦 𝑙𝑙𝑒𝑣𝑒𝑛 𝑙𝑎𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑚𝑎𝑛𝑒𝑟𝑎 𝑡𝑟𝑎𝑛𝑞𝑢𝑖𝑙𝑎.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#10** 
${'```𝑁𝑜 𝑠𝑒 𝑡𝑜𝑙𝑒𝑟𝑎 𝑒𝑙 𝑎𝑐𝑜𝑠𝑜 𝑎 𝑜𝑡𝑟𝑜𝑠 𝑚𝑖𝑒𝑚𝑏𝑟𝑜𝑠 𝑑𝑒𝑙 𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟, 𝑎𝑛𝑡𝑒 𝑢𝑛 𝑐𝑎𝑠𝑜 𝑐𝑜𝑚𝑝𝑟𝑜𝑏𝑎𝑑𝑜 𝑠𝑒 𝑜𝑝𝑡𝑎𝑟𝑎́ 𝑝𝑜𝑟 𝑒𝑙 𝑏𝑎𝑛 𝑖𝑛𝑚𝑒𝑑𝑖𝑎𝑡𝑜 𝑦 𝑠𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑟𝑎́ 𝑎𝑙 𝑒𝑞𝑢𝑖𝑝𝑜 𝑑𝑒 𝑑𝑖𝑠𝑐𝑜𝑟𝑑.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#11** 
${'```𝐴𝑏𝑠𝑡𝑒́𝑛𝑔𝑎𝑛𝑠𝑒 𝑑𝑒 𝑠𝑒𝑟 𝑜𝑏𝑠𝑡𝑖𝑛𝑎𝑑𝑜𝑠 𝑐𝑢𝑎𝑛𝑑𝑜 𝑠𝑒 𝑙𝑒𝑠 𝑎𝑑𝑣𝑖𝑒𝑟𝑡𝑎 𝑠𝑜𝑏𝑟𝑒 𝑎𝑙𝑔𝑢𝑛𝑎 𝑎𝑐𝑐𝑖𝑜́𝑛, 𝑚𝑎𝑛𝑡𝑒𝑛𝑒𝑟 𝑒𝑙 𝑜𝑟𝑑𝑒𝑛 𝑑𝑒 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑 𝑒𝑠 𝑢𝑛𝑎 𝑙𝑎𝑏𝑜𝑟 𝑑𝑒 𝑡𝑜𝑑𝑜𝑠 𝑙𝑜𝑠 𝑏𝑜𝑛𝑜𝑏𝑜𝑠.```'}
        `,
      })
      .addFields({ name: '\u200B', value: '\u200B' })
      .addFields({
        name: `:pushpin: **¿Qᴜᴇ́ sᴇ ʜᴀᴄᴇ ᴇɴ ʟᴀ Cᴏᴍᴜɴɪᴅᴀᴅ Bᴏɴᴏ́ʙɪᴄᴀ?**
\u200B`,
        value: `
𝖤𝗑𝗂𝗌𝗍𝖾𝗇 𝖾𝗌𝗉𝖺𝖼𝗂𝗈𝗌 𝖽𝖾 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝖼𝗂𝗈́𝗇 𝖼𝖺𝗌𝗎𝖺𝗅 𝖾𝗇 ${'``🍺TABERNA BONÓBICA🍺``'} 𝗒 𝖾𝗌𝗉𝖺𝖼𝗂𝗈𝗌 𝖽𝖾𝗌𝗍𝗂𝗇𝖺𝖽𝗈𝗌 𝖺 𝗍𝖾𝗆𝖺𝗌 𝗆𝖺́𝗌 𝖾𝗌𝗉𝖾𝖼𝗂́𝖿𝗂𝖼𝗈𝗌.
\u200B
\u200B \u200B :microphone2: \u200B <@&${this.roles['parla sabatina'].id}>
${'```𝐹𝑜𝑟𝑜𝑠 𝑠𝑎𝑏𝑎𝑡𝑖𝑛𝑜𝑠 𝑐𝑎𝑑𝑎 𝑑𝑜𝑠 𝑠𝑒𝑚𝑎𝑛𝑎𝑠 𝑠𝑜𝑏𝑟𝑒 𝑢𝑛 𝑡𝑒𝑚𝑎 𝑒𝑠𝑐𝑜𝑔𝑖𝑑𝑜 𝑝𝑜𝑟 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑.```'}
\u200B \u200B :book: \u200B <@&${this.roles['lector avispado'].id}>
${'```𝐿𝑒𝑐𝑡𝑢𝑟𝑎 𝑑𝑒 𝑙𝑖𝑏𝑟𝑜𝑠, 𝑐𝑢𝑒𝑛𝑡𝑜𝑠, 𝑝𝑜𝑒𝑚𝑎𝑠 𝑜 𝑎𝑟𝑡𝑖́𝑐𝑢𝑙𝑜𝑠.```'}
\u200B \u200B :film_frames: \u200B <@&${this.roles.lumierista.id}>
${'```𝑇𝑟𝑎𝑛𝑠𝑚𝑖𝑠𝑖𝑜́𝑛 𝑑𝑒 𝑠𝑒𝑟𝑖𝑒𝑠, 𝑝𝑒𝑙𝑖́𝑐𝑢𝑙𝑎𝑠 𝑜 𝑐𝑢𝑎𝑙𝑞𝑢𝑖𝑒𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑚𝑢𝑙𝑡𝑖𝑚𝑒𝑑𝑖𝑎.```'}
\u200B :postbox: \u200B  𝖳𝗈𝖽𝗈𝗌 𝗅𝗈𝗌 𝖻𝗈𝗇𝗈𝖻𝗈𝗌 𝗉𝗎𝖾𝖽𝖾𝗇 𝗉𝗋𝗈𝗉𝗈𝗇𝖾𝗋 𝖺𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽𝖾𝗌 𝖼𝗈𝗇 𝖾𝗅 𝖿𝗈𝗋𝗆𝖺𝗍𝗈 𝖼𝗈𝗋𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗂𝖾𝗇𝗍𝖾 𝖾𝗇 𝖾𝗅 𝖼𝖺𝗇𝖺𝗅 𝖽𝖾 <#759558927498084377>
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B
**Cɪ́ʀᴄᴜʟᴏs ᴅᴇ ᴀᴘʀᴇɴᴅɪᴢᴀᴊᴇ ᴄᴏɴ ᴍᴜ́ʟᴛɪᴘʟᴇs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs:**
\u200B
\u200B \u200B :pencil: \u200B <@&${this.roles['bonobo literario'].id}>
${'```𝗖𝗶́𝗿𝗰𝘂𝗹𝗼 𝗟𝗶𝘁𝗲𝗿𝗮𝗿𝗶𝗼 𝗕𝗼𝗻𝗼́𝗯𝗶𝗰𝗼: 𝑃𝑎𝑟𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑠 𝑞𝑢𝑒 𝑡𝑒𝑛𝑔𝑎𝑛 𝑖𝑛𝑡𝑒𝑟𝑒́𝑠 𝑝𝑜𝑟 𝑒𝑠𝑐𝑟𝑖𝑏𝑖𝑟 𝑜 𝑒𝑠𝑐𝑟𝑖𝑡𝑜𝑟𝑒𝑠 𝑎𝑓𝑖𝑐𝑖𝑜𝑛𝑎𝑑𝑜𝑠.```'}
\u200B \u200B :crown: \u200B <@&${this.roles.chaturanga.id}>
${'```𝗖𝗹𝘂𝗯 𝗱𝗲 𝗮𝗷𝗲𝗱𝗿𝗲𝘇: 𝑇𝑎𝑙𝑙𝑒𝑟𝑒𝑠 𝑑𝑒 𝑎𝑝𝑟𝑒𝑛𝑑𝑖𝑧𝑎𝑗𝑒, 𝑡𝑜𝑟𝑛𝑒𝑜𝑠 𝑦 𝑝𝑎𝑟𝑡𝑖𝑑𝑎𝑠 𝑐𝑎𝑠𝑢𝑎𝑙𝑒𝑠 𝑒𝑛 𝑙𝑖́𝑛𝑒𝑎.```'}
\u200B \u200B :herb: \u200B <@&${this.roles['eco bonobo'].id}>
${'```𝗘𝗰𝗼 𝗕𝗼𝗻𝗼𝗯𝗼: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑎 𝑡𝑜𝑑𝑜 𝑙𝑜 𝑟𝑒𝑙𝑎𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑎 𝑙𝑎 𝑒𝑐𝑜𝑙𝑜𝑔𝑖́𝑎 𝑦 𝑙𝑎 𝑎𝑔𝑟𝑖𝑐𝑢𝑙𝑡𝑢𝑟𝑎.```'}
\u200B \u200B :tongue: \u200B <@&${this.roles.políglota.id}>
${'```𝗟𝗲𝗻𝗴𝘂𝗮𝘀 𝗛𝗼𝗺𝗶́𝗻𝗶𝗱𝗮𝘀: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑒𝑛 𝑒𝑙 𝑎𝑝𝑟𝑒𝑛𝑑𝑖𝑧𝑎𝑗𝑒 𝑑𝑒 𝑖𝑑𝑖𝑜𝑚𝑎𝑠.```'}
\u200B \u200B :clapper: \u200B <@&${this.roles.cinéfilo.id}>
${'```𝗖𝗹𝘂𝗯 𝗱𝗲 𝗰𝗶𝗻𝗲: 𝑇𝑟𝑎𝑛𝑠𝑚𝑖𝑠𝑖𝑜́𝑛 𝑑𝑒 𝑝𝑒𝑙𝑖́𝑐𝑢𝑙𝑎𝑠, 𝑐𝑟𝑖́𝑡𝑖𝑐𝑎 𝑦 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜́𝑛 𝑠𝑜𝑏𝑟𝑒 𝑐𝑖𝑛𝑒.```'} 
\u200B \u200B :bread: \u200B <@&${this.roles.sabronobo.id}>
${'```𝗝𝗮𝗿𝗱𝗶́𝗻 𝗱𝗲 𝗹𝗮𝘀 𝗱𝗲𝗹𝗶𝗰𝗶𝗮𝘀: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑎 𝑡𝑜𝑑𝑜 𝑙𝑜 𝑟𝑒𝑙𝑎𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑐𝑜𝑛 𝑙𝑎 𝑔𝑎𝑠𝑡𝑟𝑜𝑛𝑜𝑚𝑖́𝑎, 𝑠𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑒𝑛 𝑟𝑒𝑐𝑒𝑡𝑎𝑠 𝑦 𝑠𝑒 𝑡𝑟𝑎𝑛𝑠𝑚𝑖𝑡𝑒𝑛 𝑒𝑛 𝑣𝑖𝑣𝑜.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B
**Dɪᴠᴇʀsᴀs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs ᴇᴅᴜᴄᴀᴛɪᴠᴀs, ᴄᴜʀsᴏs ᴏ ᴛᴀʟʟᴇʀᴇs ᴄᴏɴ ᴍᴀᴇsᴛʀᴏs ᴠᴏʟᴜɴᴛᴀʀɪᴏs:**
\u200B
\u200B \u200B :money_with_wings: <@&${this.roles['homo economicus'].id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑒𝑐𝑜𝑛𝑜𝑚𝑖́𝑎.```'}
\u200B \u200B :computer: \u200B <@&${this.roles['photo shoppers'].id}>
${'```𝑇𝑎𝑙𝑙𝑒𝑟 𝑑𝑒 𝑃ℎ𝑜𝑡𝑜𝑠ℎ𝑜𝑝.```'}
\u200B \u200B :amphora: \u200B <@&${this.roles['homo artem'].id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 ℎ𝑖𝑠𝑡𝑜𝑟𝑖𝑎 𝑑𝑒𝑙 𝑎𝑟𝑡𝑒.```'}
\u200B \u200B :cricket: \u200B <@&${this.roles.entomófagos.id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑒𝑛𝑡𝑜𝑚𝑜𝑙𝑜𝑔𝑖́𝑎.```'}
\u200B \u200B :man_mage: \u200B <@&${this.roles['homo sonitus'].id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑑𝑖𝑠𝑒𝑛̃𝑜 𝑑𝑒 𝑠𝑜𝑛𝑖𝑑𝑜 𝑐𝑜𝑛 𝐷𝐴𝑊.```'}
\u200B \u200B :flag_de: \u200B <@&${this.roles["Deutsche Primat"].id}>
${'```𝘊𝘭𝘢𝘴𝘦𝘴 𝘥𝘦 𝘢𝘭𝘦𝘮𝘢́𝘯.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B
**¿Dᴇsᴇᴀs ᴘᴀʀᴛɪᴄɪᴘᴀʀ? 
\u200B
:white_check_mark: \u200B Pʀɪᴍᴇʀᴏ ᴇsᴄᴏɢᴇ ᴇʟ ʀᴏʟ ᴅᴇ ʟᴀs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs ᴏ̨ᴜᴇ ᴍᴀ́s ᴛᴇ ɪɴᴛᴇʀᴇsᴇɴ ᴘᴀʀᴀ ɴᴏ ᴘᴇʀᴅᴇʀᴛᴇ ᴅᴇ ɴᴀᴅᴀ ʜᴀᴄɪᴇɴᴅᴏ ᴄʟɪᴄᴋ ᴇɴ ʟᴏs ɪ́ᴄᴏɴᴏs ᴅᴇ ʟᴀ ᴘᴀʀᴛᴇ ɪɴғᴇʀɪᴏʀ ᴅᴇ ᴇsᴛᴇ ᴍᴇɴsᴀᴊᴇ.
\u200B
:white_check_mark: \u200B Pᴀʀᴀ ᴠᴇʀɪғɪᴄᴀʀᴛᴇ ᴇsᴄʀɪʙᴇ** ${'``quiero ser chimpancé``'} **, ᴀʟ ʜᴀᴄᴇʀʟᴏ ᴀᴄᴇᴘᴛᴀs ᴇsᴛᴀʀ ᴅᴇ ᴀᴄᴜᴇʀᴅᴏ ᴄᴏɴ ᴇʟ ʀᴇɢʟᴀᴍᴇɴᴛᴏ ᴅᴇʟ sᴇʀᴠɪᴅᴏʀ. ¡Bɪᴇɴᴠᴇɴɪᴅᴏ!**
\u200B`,
      })

      .setTimestamp()
      .setFooter('Bienvenido Bonobo!!', 'attachment://migdrp-icon.png');

    return template;
  }

  private crearEmbedVerificador2(): MessageEmbed {
    const template = new MessageEmbed()
      .attachFiles(this.migdrplogo as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#a956bd')
      .setAuthor(
        'REGLAMENTO Y ROLES',
        'attachment://migdrp-icon.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setThumbnail('attachment://bb-logo.png')

      .setDescription(
        `
\u200B 
**Nᴜᴇsᴛʀᴀ ɪɴɪᴄɪᴀᴛɪᴠᴀ**
\u200B
𝖫𝖺 𝖢𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽 𝖡𝗈𝗇𝗈́𝖻𝗂𝖼𝖺 𝖾𝗌 𝗎𝗇 𝗉𝗋𝗈𝗒𝖾𝖼𝗍𝗈 𝖾𝗇𝖿𝗈𝖼𝖺𝖽𝗈 𝖾𝗇 𝖼𝗋𝖾𝖺𝗋 𝗎𝗇 𝖾𝗌𝗉𝖺𝖼𝗂𝗈 𝖽𝖾 𝖼𝗋𝖾𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝗈, 𝖺𝖻𝗂𝖾𝗋𝗍𝗈 𝖺𝗅 𝖽𝗂𝖺́𝗅𝗈𝗀𝗈, 𝗊𝗎𝖾 𝖺𝖻𝗋𝖺𝖼𝖾 𝗅𝖺 𝖽𝗂𝗏𝖾𝗋𝗌𝗂𝖽𝖺𝖽 𝗒 𝗅𝖺 𝖼𝗈𝗆𝗉𝗅𝖾𝗃𝗂𝖽𝖺𝖽 𝖽𝖾𝗅 𝗉𝖾𝗇𝗌𝖺𝗆𝗂𝖾𝗇𝗍𝗈, 𝗒 𝗊𝗎𝖾 𝖺 𝗍𝗋𝖺𝗏𝖾́𝗌 𝖽𝖾 𝗅𝖺 𝖼𝗈𝗈𝗉𝖾𝗋𝖺𝖼𝗂𝗈́𝗇 𝗒 𝗅𝖺 𝗂𝗇𝗍𝖾𝗋𝖺𝖼𝖼𝗂𝗈́𝗇 𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝖾 𝗎𝗇 𝖺́𝗋𝖾𝖺 𝖽𝖾 𝖽𝗂𝗏𝗎𝗅𝗀𝖺𝖼𝗂𝗈́𝗇 𝗒 𝗀𝖾𝗇𝖾𝗋𝖺𝖼𝗂𝗈́𝗇 𝖽𝖾 𝖼𝗈𝗇𝗈𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝗈, 𝗉𝗋𝗈𝗆𝗈𝗏𝗂𝖾𝗇𝖽𝗈 𝗅𝖺 𝗏𝗂𝗌𝗂𝗈́𝗇 𝖽𝖾 𝖼𝗈𝗅𝖺𝖻𝗈𝗋𝖺𝖼𝗂𝗈́𝗇, 𝗋𝖾𝗌𝗉𝖾𝗍𝗈 𝗒 𝗋𝖾𝗍𝗋𝗈𝖺𝗅𝗂𝗆𝖾𝗇𝗍𝖺𝖼𝗂𝗈́𝗇, 𝖾𝗇𝗍𝖾𝗇𝖽𝗂𝖾𝗇𝖽𝗈 𝖺 𝗅𝗈𝗌 𝗈𝗍𝗋𝗈𝗌 𝖽𝖾𝗌𝖽𝖾 𝗅𝖺 𝖾𝗆𝗉𝖺𝗍𝗂́𝖺 𝗒 𝗅𝖺 𝖼𝗋𝗂́𝗍𝗂𝖼𝖺; 𝗌𝗂𝖾𝗇𝖽𝗈 𝖺𝗌𝗂́ 𝗎𝗇 𝗉𝗎𝗇𝗍𝗈 𝖽𝖾 𝖾𝗇𝖼𝗎𝖾𝗇𝗍𝗋𝗈 𝗉𝖺𝗋𝖺 𝗅𝖺𝗌 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗌 𝗊𝗎𝖾 𝖽𝖾𝗌𝖾𝖾𝗇 𝖼𝗈𝗆𝗉𝖺𝗋𝗍𝗂𝗋 𝗌𝗎𝗌 𝗂𝖽𝖾𝖺𝗌 𝗒 𝖽𝖾𝗌𝖺𝗋𝗋𝗈𝗅𝗅𝖺𝗋 𝗌𝗎𝗌 𝗁𝖺𝖻𝗂𝗅𝗂𝖽𝖺𝖽𝖾𝗌 𝖾𝗇 𝗎𝗇 𝖺𝗆𝖻𝗂𝖾𝗇𝗍𝖾 𝖽𝖾 𝗋𝖾𝗌𝗉𝖾𝗍𝗈, 𝖼𝗈𝗇𝗍𝗋𝗂𝖻𝗎𝖼𝗂𝗈́𝗇 𝖾 𝗂𝗇𝗍𝖾𝗋𝖾𝗌𝖾𝗌 𝗏𝖺𝗋𝗂𝖺𝖽𝗈𝗌.
\u200B
\u200B
        `
      )
      .addFields({
        name: `:scroll: \u200B **ʟᴇᴇ ᴄᴏɴ ᴀᴛᴇɴᴄɪᴏ́ɴ ɴᴜᴇsᴛʀᴏ ʀᴇɢʟᴀᴍᴇɴᴛᴏ**
\u200B`,
        value: `
Rᴇɢʟᴀ **#1** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 ℎ𝑎𝑐𝑒𝑟 𝑠𝑝𝑎𝑚.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#2** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑛𝑖𝑛𝑔𝑢𝑛𝑎 𝑐𝑙𝑎𝑠𝑒 𝑑𝑒 𝑟𝑢𝑖𝑑𝑜 𝑚𝑜𝑙𝑒𝑠𝑡𝑜 𝑚𝑎𝑙𝑖𝑛𝑡𝑒𝑛𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑒𝑛 𝑙𝑜𝑠 𝑐𝑎𝑛𝑎𝑙𝑒𝑠 𝑑𝑒 𝑣𝑜𝑧, 𝑑𝑒𝑏𝑒𝑛 𝑠𝑖𝑙𝑒𝑛𝑐𝑖𝑎𝑟 𝑠𝑢 𝑚𝑖𝑐𝑟𝑜́𝑓𝑜𝑛𝑜 𝑠𝑖 𝑛𝑜 𝑒𝑠𝑡𝑎́𝑛 ℎ𝑎𝑏𝑙𝑎𝑛𝑑𝑜.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#3** 
${'```𝑆𝑒 𝑑𝑒𝑏𝑒𝑛 𝑙𝑒𝑒𝑟 𝑙𝑎𝑠 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑐𝑎𝑑𝑎 𝑐𝑎𝑛𝑎𝑙, 𝑛𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑖𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑓𝑢𝑒𝑟𝑎 𝑑𝑒𝑙 𝑐𝑎𝑛𝑎𝑙 𝑐𝑜𝑟𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑒𝑛𝑡𝑒.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#4** 
${'```𝐸𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑁𝑆𝐹𝑊 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑢́𝑛𝑖𝑐𝑎𝑚𝑒𝑛𝑡𝑒 𝑒𝑛 🍆・canal_de_sexo. 𝑆𝑒 𝑝𝑟𝑜ℎ𝑖́𝑏𝑒 𝑒𝑙 𝐶ℎ𝑖𝑙𝑑𝑃𝑜𝑟𝑛 𝑦 𝑒𝑙 𝑔𝑜𝑟𝑒.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#5** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑙𝑎 𝑝𝑟𝑜𝑝𝑎𝑔𝑎𝑛𝑑𝑎, 𝑙𝑎 𝑝𝑢𝑏𝑙𝑖𝑐𝑖𝑑𝑎𝑑 𝑑𝑒𝑏𝑒 𝑠𝑒𝑟 𝑎𝑢𝑡𝑜𝑟𝑖𝑧𝑎𝑑𝑎 𝑝𝑜𝑟 𝑙𝑎 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑐𝑖𝑜́𝑛.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#6** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑎𝑏𝑢𝑠𝑎𝑟 𝑑𝑒 𝑙𝑜𝑠 𝑒𝑚𝑜𝑗𝑖𝑠, ℎ𝑎𝑦 𝑢𝑛 𝑙𝑖́𝑚𝑖𝑡𝑒 𝑑𝑒 20 𝑒𝑚𝑜𝑗𝑖𝑠 𝑝𝑜𝑟 𝑚𝑒𝑛𝑠𝑎𝑗𝑒.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#7** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑛𝑜𝑚𝑏𝑟𝑒𝑠 𝑐𝑜𝑛 𝑠𝑖́𝑚𝑏𝑜𝑙𝑜𝑠 𝑒𝑥𝑡𝑟𝑎𝑣𝑎𝑔𝑎𝑛𝑡𝑒𝑠 𝑛𝑖 𝑓𝑜𝑡𝑜𝑠 𝑑𝑒 𝑝𝑒𝑟𝑓𝑖𝑙 𝑁𝑆𝐹𝑊.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#8** 
${'```𝑆𝑜𝑙𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑑𝑜𝑠 𝑐𝑢𝑒𝑛𝑡𝑎𝑠 𝑝𝑜𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#9** 
${'```𝑃𝑟𝑖𝑜𝑟𝑖𝑧𝑎𝑚𝑜𝑠 𝑒𝑙 𝑟𝑒𝑠𝑝𝑒𝑡𝑜 𝑚𝑢𝑡𝑢𝑜, 𝑑𝑒𝑏𝑒𝑛 𝑐𝑢𝑖𝑑𝑎𝑟 𝑙𝑎 𝑓𝑜𝑟𝑚𝑎 𝑑𝑒 𝑒𝑥𝑝𝑟𝑒𝑠𝑎𝑟𝑠𝑒, 𝑛𝑜 𝑖𝑚𝑝𝑜𝑛𝑔𝑎𝑛 𝑖𝑑𝑒𝑎𝑠 𝑦 𝑙𝑙𝑒𝑣𝑒𝑛 𝑙𝑎𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑚𝑎𝑛𝑒𝑟𝑎 𝑡𝑟𝑎𝑛𝑞𝑢𝑖𝑙𝑎.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#10** 
${'```𝑁𝑜 𝑠𝑒 𝑡𝑜𝑙𝑒𝑟𝑎 𝑒𝑙 𝑎𝑐𝑜𝑠𝑜 𝑎 𝑜𝑡𝑟𝑜𝑠 𝑚𝑖𝑒𝑚𝑏𝑟𝑜𝑠 𝑑𝑒𝑙 𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟, 𝑎𝑛𝑡𝑒 𝑢𝑛 𝑐𝑎𝑠𝑜 𝑐𝑜𝑚𝑝𝑟𝑜𝑏𝑎𝑑𝑜 𝑠𝑒 𝑜𝑝𝑡𝑎𝑟𝑎́ 𝑝𝑜𝑟 𝑒𝑙 𝑏𝑎𝑛 𝑖𝑛𝑚𝑒𝑑𝑖𝑎𝑡𝑜 𝑦 𝑠𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑟𝑎́ 𝑎𝑙 𝑒𝑞𝑢𝑖𝑝𝑜 𝑑𝑒 𝑑𝑖𝑠𝑐𝑜𝑟𝑑.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
Rᴇɢʟᴀ **#11** 
${'```𝐴𝑏𝑠𝑡𝑒́𝑛𝑔𝑎𝑛𝑠𝑒 𝑑𝑒 𝑠𝑒𝑟 𝑜𝑏𝑠𝑡𝑖𝑛𝑎𝑑𝑜𝑠 𝑐𝑢𝑎𝑛𝑑𝑜 𝑠𝑒 𝑙𝑒𝑠 𝑎𝑑𝑣𝑖𝑒𝑟𝑡𝑎 𝑠𝑜𝑏𝑟𝑒 𝑎𝑙𝑔𝑢𝑛𝑎 𝑎𝑐𝑐𝑖𝑜́𝑛, 𝑚𝑎𝑛𝑡𝑒𝑛𝑒𝑟 𝑒𝑙 𝑜𝑟𝑑𝑒𝑛 𝑑𝑒 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑 𝑒𝑠 𝑢𝑛𝑎 𝑙𝑎𝑏𝑜𝑟 𝑑𝑒 𝑡𝑜𝑑𝑜𝑠 𝑙𝑜𝑠 𝑏𝑜𝑛𝑜𝑏𝑜𝑠.```'}
        `,
      })
      .addFields({ name: '\u200B', value: '\u200B' })
      .addFields({
        name: `:pushpin: **¿Qᴜᴇ́ sᴇ ʜᴀᴄᴇ ᴇɴ ʟᴀ Cᴏᴍᴜɴɪᴅᴀᴅ Bᴏɴᴏ́ʙɪᴄᴀ?**
\u200B`,
        value: `
𝖤𝗑𝗂𝗌𝗍𝖾𝗇 𝖾𝗌𝗉𝖺𝖼𝗂𝗈𝗌 𝖽𝖾 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝖼𝗂𝗈́𝗇 𝖼𝖺𝗌𝗎𝖺𝗅 𝖾𝗇 ${'``🍺TABERNA BONÓBICA🍺``'} 𝗒 𝖾𝗌𝗉𝖺𝖼𝗂𝗈𝗌 𝖽𝖾𝗌𝗍𝗂𝗇𝖺𝖽𝗈𝗌 𝖺 𝗍𝖾𝗆𝖺𝗌 𝗆𝖺́𝗌 𝖾𝗌𝗉𝖾𝖼𝗂́𝖿𝗂𝖼𝗈𝗌.
\u200B
\u200B \u200B :microphone2: \u200B <@&${this.roles['parla sabatina'].id}>
${'```𝐹𝑜𝑟𝑜𝑠 𝑠𝑎𝑏𝑎𝑡𝑖𝑛𝑜𝑠 𝑐𝑎𝑑𝑎 𝑑𝑜𝑠 𝑠𝑒𝑚𝑎𝑛𝑎𝑠 𝑠𝑜𝑏𝑟𝑒 𝑢𝑛 𝑡𝑒𝑚𝑎 𝑒𝑠𝑐𝑜𝑔𝑖𝑑𝑜 𝑝𝑜𝑟 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑.```'}
\u200B \u200B :book: \u200B <@&${this.roles['lector avispado'].id}>
${'```𝐿𝑒𝑐𝑡𝑢𝑟𝑎 𝑑𝑒 𝑙𝑖𝑏𝑟𝑜𝑠, 𝑐𝑢𝑒𝑛𝑡𝑜𝑠, 𝑝𝑜𝑒𝑚𝑎𝑠 𝑜 𝑎𝑟𝑡𝑖́𝑐𝑢𝑙𝑜𝑠.```'}
\u200B \u200B :film_frames: \u200B <@&${this.roles.lumierista.id}>
${'```𝑇𝑟𝑎𝑛𝑠𝑚𝑖𝑠𝑖𝑜́𝑛 𝑑𝑒 𝑠𝑒𝑟𝑖𝑒𝑠, 𝑝𝑒𝑙𝑖́𝑐𝑢𝑙𝑎𝑠 𝑜 𝑐𝑢𝑎𝑙𝑞𝑢𝑖𝑒𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑚𝑢𝑙𝑡𝑖𝑚𝑒𝑑𝑖𝑎.```'}
\u200B :postbox: \u200B  𝖳𝗈𝖽𝗈𝗌 𝗅𝗈𝗌 𝖻𝗈𝗇𝗈𝖻𝗈𝗌 𝗉𝗎𝖾𝖽𝖾𝗇 𝗉𝗋𝗈𝗉𝗈𝗇𝖾𝗋 𝖺𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽𝖾𝗌 𝖼𝗈𝗇 𝖾𝗅 𝖿𝗈𝗋𝗆𝖺𝗍𝗈 𝖼𝗈𝗋𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗂𝖾𝗇𝗍𝖾 𝖾𝗇 𝖾𝗅 𝖼𝖺𝗇𝖺𝗅 𝖽𝖾 <#759558927498084377>
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B
**Cɪ́ʀᴄᴜʟᴏs ᴅᴇ ᴀᴘʀᴇɴᴅɪᴢᴀᴊᴇ ᴄᴏɴ ᴍᴜ́ʟᴛɪᴘʟᴇs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs:**
\u200B
\u200B \u200B :pencil: \u200B <@&${this.roles['bonobo literario'].id}>
${'```𝗖𝗶́𝗿𝗰𝘂𝗹𝗼 𝗟𝗶𝘁𝗲𝗿𝗮𝗿𝗶𝗼 𝗕𝗼𝗻𝗼́𝗯𝗶𝗰𝗼: 𝑃𝑎𝑟𝑎 𝑝𝑒𝑟𝑠𝑜𝑛𝑎𝑠 𝑞𝑢𝑒 𝑡𝑒𝑛𝑔𝑎𝑛 𝑖𝑛𝑡𝑒𝑟𝑒́𝑠 𝑝𝑜𝑟 𝑒𝑠𝑐𝑟𝑖𝑏𝑖𝑟 𝑜 𝑒𝑠𝑐𝑟𝑖𝑡𝑜𝑟𝑒𝑠 𝑎𝑓𝑖𝑐𝑖𝑜𝑛𝑎𝑑𝑜𝑠.```'}
\u200B \u200B :crown: \u200B <@&${this.roles.chaturanga.id}>
${'```𝗖𝗹𝘂𝗯 𝗱𝗲 𝗮𝗷𝗲𝗱𝗿𝗲𝘇: 𝑇𝑎𝑙𝑙𝑒𝑟𝑒𝑠 𝑑𝑒 𝑎𝑝𝑟𝑒𝑛𝑑𝑖𝑧𝑎𝑗𝑒, 𝑡𝑜𝑟𝑛𝑒𝑜𝑠 𝑦 𝑝𝑎𝑟𝑡𝑖𝑑𝑎𝑠 𝑐𝑎𝑠𝑢𝑎𝑙𝑒𝑠 𝑒𝑛 𝑙𝑖́𝑛𝑒𝑎.```'}
\u200B \u200B :herb: \u200B <@&${this.roles['eco bonobo'].id}>
${'```𝗘𝗰𝗼 𝗕𝗼𝗻𝗼𝗯𝗼: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑎 𝑡𝑜𝑑𝑜 𝑙𝑜 𝑟𝑒𝑙𝑎𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑎 𝑙𝑎 𝑒𝑐𝑜𝑙𝑜𝑔𝑖́𝑎 𝑦 𝑙𝑎 𝑎𝑔𝑟𝑖𝑐𝑢𝑙𝑡𝑢𝑟𝑎.```'}
\u200B \u200B :tongue: \u200B <@&${this.roles.políglota.id}>
${'```𝗟𝗲𝗻𝗴𝘂𝗮𝘀 𝗛𝗼𝗺𝗶́𝗻𝗶𝗱𝗮𝘀: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑒𝑛 𝑒𝑙 𝑎𝑝𝑟𝑒𝑛𝑑𝑖𝑧𝑎𝑗𝑒 𝑑𝑒 𝑖𝑑𝑖𝑜𝑚𝑎𝑠.```'}
\u200B \u200B :clapper: \u200B <@&${this.roles.cinéfilo.id}>
${'```𝗖𝗹𝘂𝗯 𝗱𝗲 𝗰𝗶𝗻𝗲: 𝑇𝑟𝑎𝑛𝑠𝑚𝑖𝑠𝑖𝑜́𝑛 𝑑𝑒 𝑝𝑒𝑙𝑖́𝑐𝑢𝑙𝑎𝑠, 𝑐𝑟𝑖́𝑡𝑖𝑐𝑎 𝑦 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜́𝑛 𝑠𝑜𝑏𝑟𝑒 𝑐𝑖𝑛𝑒.```'} 
\u200B \u200B :bread: \u200B <@&${this.roles.sabronobo.id}>
${'```𝗝𝗮𝗿𝗱𝗶́𝗻 𝗱𝗲 𝗹𝗮𝘀 𝗱𝗲𝗹𝗶𝗰𝗶𝗮𝘀: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑎 𝑡𝑜𝑑𝑜 𝑙𝑜 𝑟𝑒𝑙𝑎𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑐𝑜𝑛 𝑙𝑎 𝑔𝑎𝑠𝑡𝑟𝑜𝑛𝑜𝑚𝑖́𝑎, 𝑠𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑒𝑛 𝑟𝑒𝑐𝑒𝑡𝑎𝑠 𝑦 𝑠𝑒 𝑡𝑟𝑎𝑛𝑠𝑚𝑖𝑡𝑒𝑛 𝑒𝑛 𝑣𝑖𝑣𝑜.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B
**Dɪᴠᴇʀsᴀs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs ᴇᴅᴜᴄᴀᴛɪᴠᴀs, ᴄᴜʀsᴏs ᴏ ᴛᴀʟʟᴇʀᴇs ᴄᴏɴ ᴍᴀᴇsᴛʀᴏs ᴠᴏʟᴜɴᴛᴀʀɪᴏs:**
\u200B
\u200B \u200B :money_with_wings: <@&${this.roles['homo economicus'].id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑒𝑐𝑜𝑛𝑜𝑚𝑖́𝑎.```'}
\u200B \u200B :computer: \u200B <@&${this.roles['photo shoppers'].id}>
${'```𝑇𝑎𝑙𝑙𝑒𝑟 𝑑𝑒 𝑃ℎ𝑜𝑡𝑜𝑠ℎ𝑜𝑝.```'}
\u200B \u200B :amphora: \u200B <@&${this.roles['homo artem'].id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 ℎ𝑖𝑠𝑡𝑜𝑟𝑖𝑎 𝑑𝑒𝑙 𝑎𝑟𝑡𝑒.```'}
\u200B \u200B :cricket: \u200B <@&${this.roles.entomófagos.id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑒𝑛𝑡𝑜𝑚𝑜𝑙𝑜𝑔𝑖́𝑎.```'}
\u200B \u200B :man_mage: \u200B <@&${this.roles['homo sonitus'].id}>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑑𝑖𝑠𝑒𝑛̃𝑜 𝑑𝑒 𝑠𝑜𝑛𝑖𝑑𝑜 𝑐𝑜𝑛 𝐷𝐴𝑊.```'}
\u200B \u200B :flag_de: \u200B <@&${this.roles["Deutsche Primat"].id}>
${'```𝘊𝘭𝘢𝘴𝘦𝘴 𝘥𝘦 𝘢𝘭𝘦𝘮𝘢́𝘯.```'}
        `,
      })
      .addFields({
        name: `\u200B`,
        value: `
\u200B
**¿Dᴇsᴇᴀs ᴘᴀʀᴛɪᴄɪᴘᴀʀ? 
\u200B
:white_check_mark: \u200B Pʀɪᴍᴇʀᴏ ᴇsᴄᴏɢᴇ ᴇʟ ʀᴏʟ ᴅᴇ ʟᴀs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs ᴏ̨ᴜᴇ ᴍᴀ́s ᴛᴇ ɪɴᴛᴇʀᴇsᴇɴ ᴘᴀʀᴀ ɴᴏ ᴘᴇʀᴅᴇʀᴛᴇ ᴅᴇ ɴᴀᴅᴀ ʜᴀᴄɪᴇɴᴅᴏ ᴄʟɪᴄᴋ ᴇɴ ʟᴏs ɪ́ᴄᴏɴᴏs ᴅᴇ ʟᴀ ᴘᴀʀᴛᴇ ɪɴғᴇʀɪᴏʀ ᴅᴇ ᴇsᴛᴇ ᴍᴇɴsᴀᴊᴇ.
\u200B`,
      })

      .setTimestamp()
      .setFooter(
        '!Los bonobos apreciamos mucho la participación!',
        'attachment://migdrp-icon.png'
      );

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
    msgObject: Message,
    client: Client
  ) {
    console.log('command verificador ejecutado');

    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }

    if (!this.free) {
      msgObject.author.send(
        'Espérate bónobo, Ya me encuentro ejecutando este comando.'
      );
      return;
    }

    this.free = false;

    if (args.length > 0) {
      if (args[0] === 'here') {
        const channel_Verificar_ID = await this.checkSelectedChannel(msgObject);
        const channel_Roles_ID = await this.checkSelectedChannel2(msgObject);

        if (channel_Verificar_ID === null) {
          msgObject.author.send(
            'No encuentro el canal de verificación, no puedo postear el mensaje de verificación.'
          );
          this.free = true;
          return;
        }

        if (channel_Roles_ID === null) {
          msgObject.author.send(
            'No encuentro el canal de roles, no puedo postear el mensaje de verificación.'
          );
          this.free = true;

          return;
        }

        if (args[1] !== null && args[1] !== undefined) {
          msgObject.author.send('Este comando no lleva esos argumentos');
          this.free = true;
          return;
        }

        const channelVerificar = (await this.getSelectedChannel(
          msgObject.client,
          channel_Verificar_ID
        )) as TextChannel;
        const channelRoles = (await this.getSelectedChannel(
          msgObject.client,
          channel_Roles_ID
        )) as TextChannel;

        const embedVerificar = this.crearEmbedVerificador();
        const embedRoles = this.crearEmbedVerificador2();

        //Deletes the old embed message if exist
        if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
          await this.currentEmbedMessage.delete();
        }

        if (this.currentEmbedMessage2 && !this.currentEmbedMessage2.deleted) {
          await this.currentEmbedMessage2.delete();
        }

        this.currentEmbedMessage = await channelVerificar.send(embedVerificar);

        await this.currentEmbedMessage.react('🎙️');
        await this.currentEmbedMessage.react('📖');
        await this.currentEmbedMessage.react('🎞️');
        await this.currentEmbedMessage.react('📝');
        await this.currentEmbedMessage.react('👑');
        await this.currentEmbedMessage.react('🌿');
        await this.currentEmbedMessage.react('👅');
        await this.currentEmbedMessage.react('🎬');
        await this.currentEmbedMessage.react('🍞');
        await this.currentEmbedMessage.react('💸');
        await this.currentEmbedMessage.react('💻');
        await this.currentEmbedMessage.react('🏺');
        await this.currentEmbedMessage.react('🦗');
        await this.currentEmbedMessage.react('🧙‍♂️');

        this.currentEmbedMessage2 = await channelRoles.send(embedRoles);

        await this.currentEmbedMessage2.react('🎙️');
        await this.currentEmbedMessage2.react('📖');
        await this.currentEmbedMessage2.react('🎞️');
        await this.currentEmbedMessage2.react('📝');
        await this.currentEmbedMessage2.react('👑');
        await this.currentEmbedMessage2.react('🌿');
        await this.currentEmbedMessage2.react('👅');
        await this.currentEmbedMessage2.react('🎬');
        await this.currentEmbedMessage2.react('🍞');
        await this.currentEmbedMessage2.react('💸');
        await this.currentEmbedMessage2.react('💻');
        await this.currentEmbedMessage2.react('🏺');
        await this.currentEmbedMessage2.react('🦗');
        await this.currentEmbedMessage2.react('🧙‍♂️');
        await this.currentEmbedMessage2.react('🇩🇪');

        console.log('Verificador here called....');

        this.free = true;

        const emojis = [
          { emoji: '🎙️', role: roles.cb_real['parla sabatina'].id },
          { emoji: '📖', role: roles.cb_real['lector avispado'].id },
          { emoji: '🎞️', role: roles.cb_real.lumierista.id },
          { emoji: '📝', role: roles.cb_real['bonobo literario'].id },
          { emoji: '👑', role: roles.cb_real.chaturanga.id },
          { emoji: '🌿', role: roles.cb_real['eco bonobo'].id },
          { emoji: '👅', role: roles.cb_real.políglota.id },
          { emoji: '🎬', role: roles.cb_real.cinéfilo.id },
          { emoji: '🍞', role: roles.cb_real.sabronobo.id },
          { emoji: '💸', role: roles.cb_real['homo economicus'].id },
          { emoji: '💻', role: roles.cb_real['photo shoppers'].id },
          { emoji: '🏺', role: roles.cb_real['homo artem'].id },
          { emoji: '🦗', role: roles.cb_real.entomófagos.id },
          { emoji: '🧙‍♂️', role: roles.cb_real['homo sonitus'].id },
          { emoji: '🇩🇪', role: roles.cb_real["Deutsche Primat"].id }
        ];

        /*
                const emojis = [
                    {   emoji:'🎙️',  role:'705975181688045598' },
                    {   emoji:'📖',  role:'727351251041386526' },
                    {   emoji:'🎞️',  role:'727357766561431552' },
                    {   emoji:'📝',  role:'754532026366951434' },
                    {   emoji:'👑',  role:'754825942701965342' },
                    {   emoji:'🌿',  role:'' },
                    {   emoji:'👅',  role:'' },
                    {   emoji:'🎬',  role:'' },
                    {   emoji:'🍞',  role:'' },
                    {   emoji:'💸',  role:'746149379790078025' },
                    {   emoji:'💻',  role:'754531018404528229' },
                    {   emoji:'🏺',   role:'' },
                    {   emoji:'🦗',  role:'' }
                ];*/

        const filter = (reaction: MessageReaction) => {
          const currentEmoji = emojis.filter(
            (value) => value.emoji === reaction.emoji.name
          );

          if (currentEmoji) {
            return true;
          } else {
            return false;
          }
        };

        this.reactionCollector = this.currentEmbedMessage.createReactionCollector(
          filter
        );

        this.reactionCollector.options.dispose = true;

        this.reactionCollector2 = this.currentEmbedMessage2.createReactionCollector(
          filter
        );

        this.reactionCollector2.options.dispose = true;

        this.reactionCollector.on('collect', async (reaction, user) => {
          console.log(`Reaction added: `, reaction.emoji.name);
          console.log('User: ', user.username);

          const reactionExist = emojis.filter(
            (value) => value.emoji === reaction.emoji.name
          );

          if (reactionExist) {
            const userId = user.id;
            const member = await msgObject.guild.members.fetch(userId);
            member.roles.add(reactionExist[0].role);
          } else {
            console.log('Error VERIFICADOR, role not found on emojis array..');
          }
        });

        this.reactionCollector.on('remove', async (reaction, user) => {
          console.log(`Reaction removed: `, reaction.emoji.name);
          console.log('User: ', user.username);

          const reactionExist = emojis.filter(
            (value) => value.emoji === reaction.emoji.name
          );

          if (reactionExist) {
            const userId = user.id;
            const member = await msgObject.guild.members.fetch(userId);
            member.roles.remove(reactionExist[0].role);
          } else {
            console.log('Error VERIFICADOR, role not found on emojis array..');
          }
        });

        this.reactionCollector2.on('collect', async (reaction, user) => {
          console.log(`Reaction added: `, reaction.emoji.name);
          console.log('User: ', user.username);

          const reactionExist = emojis.filter(
            (value) => value.emoji === reaction.emoji.name
          );

          if (reactionExist) {
            const userId = user.id;
            const member = await msgObject.guild.members.fetch(userId);
            member.roles.add(reactionExist[0].role);
          } else {
            console.log('Error VERIFICADOR, role not found on emojis array..');
          }
        });

        this.reactionCollector2.on('remove', async (reaction, user) => {
          console.log(`Reaction removed: `, reaction.emoji.name);
          console.log('User: ', user.username);

          const reactionExist = emojis.filter(
            (value) => value.emoji === reaction.emoji.name
          );

          if (reactionExist) {
            const userId = user.id;
            const member = await msgObject.guild.members.fetch(userId);
            member.roles.remove(reactionExist[0].role);
          } else {
            console.log('Error VERIFICADOR, role not found on emojis array..');
          }
        });

        channelVerificar.client.on('message', (message) => {
          if (
            (message.channel as TextChannel).name ===
            channelVerificar.name
          ) {
            console.log('Nuevo intento de verificación: ', message.content);

            if (
              message.content.toLocaleLowerCase() === 'quiero ser chimpancé' ||
              message.content.toLocaleLowerCase() === 'quiero ser chimpance' ||
              message.content.toLocaleLowerCase() === 'quiero ser chimpancè'
            ) {
              if (
                !message.member.roles.cache.has(this.roles.austalopitecus.id)
              ) {
                message.author.send(
                  'Tienes que ser Australopitécus para que te otorgue chimpancé. '
                );
                message.delete();
                return;
              }

              if (message.member.roles.cache.has(this.roles.chimpancé.id)) {
                message.author.send(
                  'Ya eres chimpancé, no pidas incongruencias. '
                );
                message.delete();
                return;
              }

              message.member.roles.add(this.roles.chimpancé.id);
              message.member.roles.remove(this.roles.austalopitecus.id);
              message.author.send(
                'Bienvenido a la comunidad bonóbica :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz '
              );
              message.delete();
              return;
            }

            if (message.content.toLocaleLowerCase() === 'quiero ser bonobo') {
              if (
                !message.member.roles.cache.has(this.roles.austalopitecus.id)
              ) {
                message.author.send(
                  'Tienes que ser Australopitécus para que te otorgue bonobo. Espera... ¿Qué? '
                );
                message.delete();
                return;
              }

              if (message.member.roles.cache.has(this.roles.bonobo.id)) {
                message.author.send(
                  'Ya eres bonobo, no pidas incongruencias. Espera... ¿Qué?'
                );
                message.delete();
                return;
              }

              message.member.roles.add(this.roles.bonobo.id);
              message.member.roles.remove(this.roles.austalopitecus.id);
              message.author.send(
                'Bienvenido Bonobo a la comunidad :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz '
              );
              message.delete();
              return;
            }

            if (
              message.content.toLocaleLowerCase() === 'quiero ser admin' ||
              message.content.toLocaleLowerCase() === 'quiero ser mod'
            ) {
              if (
                !message.member.roles.cache.has(this.roles.austalopitecus.id)
              ) {
                message.author.send(
                  'Tienes que ser Australopitécus para que te otorgue admin. Espera... ¿Qué? '
                );
                message.delete();
                return;
              }

              const winner = Math.random() * (10 - 0) + 0;

              if (winner === 5) {
                message.member.roles.add(this.roles.bonoboDeLaSuerte.id);
                message.member.roles.add(this.roles.bonobo.id);
                message.member.roles.remove(this.roles.austalopitecus.id);
                message.author.send(
                  'Bienvenido Bonobo a la comunidad :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz '
                );
                message.delete();
                return;
              } else {
                message.member.roles.add(this.roles.mamandril.id);
                message.member.roles.add(this.roles.chimpancé.id);
                message.member.roles.remove(this.roles.austalopitecus.id);
                message.author.send(
                  'Bienvenido Bonobo a la comunidad :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz '
                );
                message.delete();
                return;
              }
            }

            message.delete();
            return;
          }
        });
      }
    }
  }
}

