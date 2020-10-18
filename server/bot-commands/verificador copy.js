"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const botValidation_1 = require("../utils/botValidation");
const networkUtil_1 = require("../utils/networkUtil");
class Verificador {
    constructor() {
        this._command = 'verificador';
        this.channel = '✅・verificación';
        this.roles = {
            austra: '759558925270909001',
            chimp: '759558925270909002',
            bonobo: '759558925270909003',
            mamandril: '765126037305688064',
            winner: '765127488451510332'
        };
        this.migdrplogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/migdrp-logo-small-parla_sabatina.png`, 'migdrp-icon.png');
        this.bonobotlogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/cb-logo.png`, 'bb-logo.png');
        this.imgParla = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/foro_img_horizontal.jpeg`, 'foro-img.jpg');
        this.free = true;
        console.log('Verificador Command Instantiated');
    }
    checkSelectedChannel(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channelFound = message.guild.channels.cache.findKey(channel => channel.name === this.channel);
                if (channelFound) {
                    console.log('Channel Found: ', channelFound);
                    return channelFound;
                }
                console.log('Channel not found..');
                return null;
            }
            catch (e) {
                console.log("Error on getSelectedChannel().. ", e);
            }
        });
    }
    getSelectedChannel(client, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channelFound = client.channels.fetch(id);
                return channelFound;
            }
            catch (e) {
                console.log("Error on getSelectedChannel().. ", e);
            }
        });
    }
    crearEmbedVerificador() {
        let template = new Discord.MessageEmbed()
            .attachFiles(this.migdrplogo)
            .attachFiles(this.bonobotlogo)
            .setColor('#a956bd')
            .setAuthor('BIENVENIDO A LA COMUNIDAD BONÓBICA', 'attachment://migdrp-icon.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
            .setThumbnail('attachment://bb-logo.png')
            .setDescription(`
\u200B 
**Nᴜᴇsᴛʀᴀ ɪɴɪᴄɪᴀᴛɪᴠᴀ**
\u200B
𝖫𝖺 𝖢𝗈𝗆𝗎𝗇𝗂𝖽𝖺𝖽 𝖡𝗈𝗇𝗈́𝖻𝗂𝖼𝖺 𝗍𝗂𝖾𝗇𝖾 𝖼𝗈𝗆𝗈 𝗈𝖻𝗃𝖾𝗍𝗂𝗏𝗈 𝖻𝗋𝗂𝗇𝖽𝖺𝗋 𝗎𝗇 𝖾𝗌𝗉𝖺𝖼𝗂𝗈 𝗒 𝗅𝖺𝗌 𝗁𝖾𝗋𝗋𝖺𝗆𝗂𝖾𝗇𝗍𝖺𝗌 𝗇𝖾𝖼𝖾𝗌𝖺𝗋𝗂𝖺𝗌, 𝖺 𝗉𝖾𝗋𝗌𝗈𝗇𝖺𝗌 𝖼𝗈𝗇 𝖽𝗂𝗏𝖾𝗋𝗌𝗂𝖽𝖺𝖽 𝖽𝖾 𝗉𝖾𝗇𝗌𝖺𝗆𝗂𝖾𝗇𝗍𝗈 𝗒 𝖽𝗂𝗌𝗍𝗂𝗇𝗍𝖺𝗌 𝗁𝖺𝖻𝗂𝗅𝗂𝖽𝖺𝖽𝖾𝗌, 𝗉𝖺𝗋𝖺 𝗊𝗎𝖾 𝗉𝗎𝖾𝖽𝖺𝗇 𝗂𝗇𝗍𝖾𝗋𝖺𝖼𝗍𝗎𝖺𝗋, 𝖼𝗈𝗅𝖺𝖻𝗈𝗋𝖺𝗋, 𝖺𝗉𝗋𝖾𝗇𝖽𝖾𝗋, 𝖽𝖾𝗌𝖺𝗋𝗋𝗈𝗅𝗅𝖺𝗋, 𝖾𝗑𝗉𝗋𝖾𝗌𝖺𝗋𝗌𝖾 𝗒 𝖼𝗈𝗆𝗉𝖺𝗋𝗍𝗂𝗋 𝗌𝗎 𝖼𝗈𝗇𝗈𝖼𝗂𝗆𝗂𝖾𝗇𝗍𝗈 𝖾 𝗂𝖽𝖾𝖺𝗌.
\u200B
\u200B
        `)
            .addFields({
            name: `:scroll: \u200B **ʟᴇᴇ ᴄᴏɴ ᴀᴛᴇɴᴄɪᴏ́ɴ ɴᴜᴇsᴛʀᴏ ʀᴇɢʟᴀᴍᴇɴᴛᴏ**
\u200B`,
            value: `
Rᴇɢʟᴀ **#1** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 ℎ𝑎𝑐𝑒𝑟 𝑠𝑝𝑎𝑚.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#2** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑛𝑖𝑛𝑔𝑢𝑛𝑎 𝑐𝑙𝑎𝑠𝑒 𝑑𝑒 𝑟𝑢𝑖𝑑𝑜 𝑚𝑜𝑙𝑒𝑠𝑡𝑜 𝑚𝑎𝑙𝑖𝑛𝑡𝑒𝑛𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑒𝑛 𝑙𝑜𝑠 𝑐𝑎𝑛𝑎𝑙𝑒𝑠 𝑑𝑒 𝑣𝑜𝑧, 𝑑𝑒𝑏𝑒𝑛 𝑠𝑖𝑙𝑒𝑛𝑐𝑖𝑎𝑟 𝑠𝑢 𝑚𝑖𝑐𝑟𝑜́𝑓𝑜𝑛𝑜 𝑠𝑖 𝑛𝑜 𝑒𝑠𝑡𝑎́𝑛 ℎ𝑎𝑏𝑙𝑎𝑛𝑑𝑜.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#3** 
${'```𝑆𝑒 𝑑𝑒𝑏𝑒𝑛 𝑙𝑒𝑒𝑟 𝑙𝑎𝑠 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑐𝑎𝑑𝑎 𝑐𝑎𝑛𝑎𝑙, 𝑛𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑖𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑓𝑢𝑒𝑟𝑎 𝑑𝑒𝑙 𝑐𝑎𝑛𝑎𝑙 𝑐𝑜𝑟𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑒𝑛𝑡𝑒.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#4** 
${'```𝐸𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑁𝑆𝐹𝑊 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑢́𝑛𝑖𝑐𝑎𝑚𝑒𝑛𝑡𝑒 𝑒𝑛 #𝑒𝑙_𝑐𝑎𝑛𝑎𝑙_𝑑𝑒_𝑠𝑒𝑥𝑜. 𝑆𝑒 𝑝𝑟𝑜ℎ𝑖́𝑏𝑒 𝑒𝑙 𝐶ℎ𝑖𝑙𝑑𝑃𝑜𝑟𝑛 𝑦 𝑒𝑙 𝑔𝑜𝑟𝑒.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#5** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑙𝑎 𝑝𝑟𝑜𝑝𝑎𝑔𝑎𝑛𝑑𝑎, 𝑙𝑎 𝑝𝑢𝑏𝑙𝑖𝑐𝑖𝑑𝑎𝑑 𝑑𝑒𝑏𝑒 𝑠𝑒𝑟 𝑎𝑢𝑡𝑜𝑟𝑖𝑧𝑎𝑑𝑎 𝑝𝑜𝑟 𝑙𝑎 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑐𝑖𝑜́𝑛.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#6** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑎𝑏𝑢𝑠𝑎𝑟 𝑑𝑒 𝑙𝑜𝑠 𝑒𝑚𝑜𝑗𝑖𝑠, ℎ𝑎𝑦 𝑢𝑛 𝑙𝑖́𝑚𝑖𝑡𝑒 𝑑𝑒 20 𝑒𝑚𝑜𝑗𝑖𝑠 𝑝𝑜𝑟 𝑚𝑒𝑛𝑠𝑎𝑗𝑒.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#7** 
${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑛𝑜𝑚𝑏𝑟𝑒𝑠 𝑐𝑜𝑛 𝑠𝑖́𝑚𝑏𝑜𝑙𝑜𝑠 𝑒𝑥𝑡𝑟𝑎𝑣𝑎𝑔𝑎𝑛𝑡𝑒𝑠 𝑛𝑖 𝑓𝑜𝑡𝑜𝑠 𝑑𝑒 𝑝𝑒𝑟𝑓𝑖𝑙 𝑁𝑆𝐹𝑊.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#8** 
${'```𝑆𝑜𝑙𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑑𝑜𝑠 𝑐𝑢𝑒𝑛𝑡𝑎𝑠 𝑝𝑜𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#9** 
${'```𝑃𝑟𝑖𝑜𝑟𝑖𝑧𝑎𝑚𝑜𝑠 𝑒𝑙 𝑟𝑒𝑠𝑝𝑒𝑡𝑜 𝑚𝑢𝑡𝑢𝑜, 𝑑𝑒𝑏𝑒𝑛 𝑐𝑢𝑖𝑑𝑎𝑟 𝑙𝑎 𝑓𝑜𝑟𝑚𝑎 𝑑𝑒 𝑒𝑥𝑝𝑟𝑒𝑠𝑎𝑟𝑠𝑒, 𝑛𝑜 𝑖𝑚𝑝𝑜𝑛𝑔𝑎𝑛 𝑖𝑑𝑒𝑎𝑠 𝑦 𝑙𝑙𝑒𝑣𝑒𝑛 𝑙𝑎𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑚𝑎𝑛𝑒𝑟𝑎 𝑡𝑟𝑎𝑛𝑞𝑢𝑖𝑙𝑎.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#10** 
${'```𝑁𝑜 𝑠𝑒 𝑡𝑜𝑙𝑒𝑟𝑎 𝑒𝑙 𝑎𝑐𝑜𝑠𝑜 𝑎 𝑜𝑡𝑟𝑜𝑠 𝑚𝑖𝑒𝑚𝑏𝑟𝑜𝑠 𝑑𝑒𝑙 𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟, 𝑎𝑛𝑡𝑒 𝑢𝑛 𝑐𝑎𝑠𝑜 𝑐𝑜𝑚𝑝𝑟𝑜𝑏𝑎𝑑𝑜 𝑠𝑒 𝑜𝑝𝑡𝑎𝑟𝑎́ 𝑝𝑜𝑟 𝑒𝑙 𝑏𝑎𝑛 𝑖𝑛𝑚𝑒𝑑𝑖𝑎𝑡𝑜 𝑦 𝑠𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑟𝑎́ 𝑎𝑙 𝑒𝑞𝑢𝑖𝑝𝑜 𝑑𝑒 𝑑𝑖𝑠𝑐𝑜𝑟𝑑.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
Rᴇɢʟᴀ **#11** 
${'```𝐴𝑏𝑠𝑡𝑒́𝑛𝑔𝑎𝑛𝑠𝑒 𝑑𝑒 𝑠𝑒𝑟 𝑜𝑏𝑠𝑡𝑖𝑛𝑎𝑑𝑜𝑠 𝑐𝑢𝑎𝑛𝑑𝑜 𝑠𝑒 𝑙𝑒𝑠 𝑎𝑑𝑣𝑖𝑒𝑟𝑡𝑎 𝑠𝑜𝑏𝑟𝑒 𝑎𝑙𝑔𝑢𝑛𝑎 𝑎𝑐𝑐𝑖𝑜́𝑛, 𝑚𝑎𝑛𝑡𝑒𝑛𝑒𝑟 𝑒𝑙 𝑜𝑟𝑑𝑒𝑛 𝑑𝑒 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑 𝑒𝑠 𝑢𝑛𝑎 𝑙𝑎𝑏𝑜𝑟 𝑑𝑒 𝑡𝑜𝑑𝑜𝑠 𝑙𝑜𝑠 𝑏𝑜𝑛𝑜𝑏𝑜𝑠.```'}
        `
        })
            .addFields({ name: '\u200B', value: '\u200B' })
            .addFields({
            name: `:pushpin: **¿Qᴜᴇ́ sᴇ ʜᴀᴄᴇ ᴇɴ ʟᴀ Cᴏᴍᴜɴɪᴅᴀᴅ Bᴏɴᴏ́ʙɪᴄᴀ?**
\u200B`,
            value: `
𝖤𝗑𝗂𝗌𝗍𝖾𝗇 𝖾𝗌𝗉𝖺𝖼𝗂𝗈𝗌 𝖽𝖾 𝖼𝗈𝗇𝗏𝖾𝗋𝗌𝖺𝖼𝗂𝗈́𝗇 𝖼𝖺𝗌𝗎𝖺𝗅 𝖾𝗇 ${'``🍺TABERNA BONÓBICA🍺``'} 𝗒 𝖾𝗌𝗉𝖺𝖼𝗂𝗈𝗌 𝖽𝖾𝗌𝗍𝗂𝗇𝖺𝖽𝗈𝗌 𝖺 𝗍𝖾𝗆𝖺𝗌 𝗆𝖺́𝗌 𝖾𝗌𝗉𝖾𝖼𝗂́𝖿𝗂𝖼𝗈𝗌.
\u200B
\u200B \u200B :microphone2: \u200B <@&759558925237878813>
${'```𝐹𝑜𝑟𝑜𝑠 𝑠𝑎𝑏𝑎𝑡𝑖𝑛𝑜𝑠 𝑐𝑎𝑑𝑎 𝑑𝑜𝑠 𝑠𝑒𝑚𝑎𝑛𝑎𝑠 𝑠𝑜𝑏𝑟𝑒 𝑢𝑛 𝑡𝑒𝑚𝑎 𝑒𝑠𝑐𝑜𝑔𝑖𝑑𝑜 𝑝𝑜𝑟 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑.```'}
\u200B \u200B :book: \u200B <@&759558925237878813>
${'```𝐿𝑒𝑐𝑡𝑢𝑟𝑎 𝑑𝑒 𝑙𝑖𝑏𝑟𝑜𝑠, 𝑐𝑢𝑒𝑛𝑡𝑜𝑠, 𝑝𝑜𝑒𝑚𝑎𝑠 𝑜 𝑎𝑟𝑡𝑖́𝑐𝑢𝑙𝑜𝑠.```'}
\u200B \u200B :film_frames: \u200B <@&759558925237878813>
${'```𝑇𝑟𝑎𝑛𝑠𝑚𝑖𝑠𝑖𝑜́𝑛 𝑑𝑒 𝑠𝑒𝑟𝑖𝑒𝑠, 𝑝𝑒𝑙𝑖́𝑐𝑢𝑙𝑎𝑠 𝑜 𝑐𝑢𝑎𝑙𝑞𝑢𝑖𝑒𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑚𝑢𝑙𝑡𝑖𝑚𝑒𝑑𝑖𝑎.```'}
\u200B :postbox: \u200B  𝖳𝗈𝖽𝗈𝗌 𝗅𝗈𝗌 𝖻𝗈𝗇𝗈𝖻𝗈𝗌 𝗉𝗎𝖾𝖽𝖾𝗇 𝗉𝗋𝗈𝗉𝗈𝗇𝖾𝗋 𝖺𝖼𝗍𝗂𝗏𝗂𝖽𝖺𝖽𝖾𝗌 𝖼𝗈𝗇 𝖾𝗅 𝖿𝗈𝗋𝗆𝖺𝗍𝗈 𝖼𝗈𝗋𝗋𝖾𝗌𝗉𝗈𝗇𝖽𝗂𝖾𝗇𝗍𝖾 𝖾𝗇 𝖾𝗅 𝖼𝖺𝗇𝖺𝗅 𝖽𝖾 <#759558927498084377>
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
\u200B
**Cɪ́ʀᴄᴜʟᴏs ᴅᴇ ᴀᴘʀᴇɴᴅɪᴢᴀᴊᴇ ᴄᴏɴ ᴍᴜ́ʟᴛɪᴘʟᴇs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs:**
\u200B
\u200B \u200B :pencil: \u200B <@&759558925237878813>
${'```𝗖𝗶́𝗿𝗰𝘂𝗹𝗼 𝗟𝗶𝘁𝗲𝗿𝗮𝗿𝗶𝗼 𝗕𝗼𝗻𝗼́𝗯𝗶𝗰𝗼: 𝐹𝑜𝑟𝑜𝑠 𝑠𝑎𝑏𝑎𝑡𝑖𝑛𝑜𝑠 𝑐𝑎𝑑𝑎 𝑑𝑜𝑠 𝑠𝑒𝑚𝑎𝑛𝑎𝑠 𝑠𝑜𝑏𝑟𝑒 𝑢𝑛 𝑡𝑒𝑚𝑎 𝑒𝑠𝑐𝑜𝑔𝑖𝑑𝑜 𝑝𝑜𝑟 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑.```'}
\u200B \u200B :crown: \u200B <@&759558925237878814>
${'```𝗖𝗹𝘂𝗯 𝗱𝗲 𝗮𝗷𝗲𝗱𝗿𝗲𝘇: 𝑇𝑎𝑙𝑙𝑒𝑟𝑒𝑠 𝑑𝑒 𝑎𝑝𝑟𝑒𝑛𝑑𝑖𝑧𝑎𝑗𝑒, 𝑡𝑜𝑟𝑛𝑒𝑜𝑠 𝑦 𝑝𝑎𝑟𝑡𝑖𝑑𝑎𝑠 𝑐𝑎𝑠𝑢𝑎𝑙𝑒𝑠 𝑒𝑛 𝑙𝑖́𝑛𝑒𝑎.```'}
\u200B \u200B :herb: \u200B <@&759558925237878813>
${'```𝗘𝗰𝗼 𝗕𝗼𝗻𝗼𝗯𝗼: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑎 𝑡𝑜𝑑𝑜 𝑙𝑜 𝑟𝑒𝑙𝑎𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑎 𝑙𝑎 𝑒𝑐𝑜𝑙𝑜𝑔𝑖́𝑎 𝑦 𝑙𝑎 𝑎𝑔𝑟𝑖𝑐𝑢𝑙𝑡𝑢𝑟𝑎.```'}
\u200B \u200B :tongue: \u200B <@&759558925237878813>
${'```𝗟𝗲𝗻𝗴𝘂𝗮𝘀 𝗛𝗼𝗺𝗶́𝗻𝗶𝗱𝗮𝘀: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑒𝑛 𝑒𝑙 𝑎𝑝𝑟𝑒𝑛𝑑𝑖𝑧𝑎𝑗𝑒 𝑑𝑒 𝑖𝑑𝑖𝑜𝑚𝑎𝑠.```'}
\u200B \u200B :clapper: \u200B <@&759558925237878813>
${'```𝗖𝗹𝘂𝗯 𝗱𝗲 𝗰𝗶𝗻𝗲: 𝑇𝑟𝑎𝑛𝑠𝑚𝑖𝑠𝑖𝑜́𝑛 𝑑𝑒 𝑝𝑒𝑙𝑖́𝑐𝑢𝑙𝑎𝑠, 𝑐𝑟𝑖́𝑡𝑖𝑐𝑎 𝑦 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜́𝑛 𝑠𝑜𝑏𝑟𝑒 𝑐𝑖𝑛𝑒.```'} 
\u200B \u200B :bread: \u200B <@&759558925237878813>
${'```𝗝𝗮𝗿𝗱𝗶́𝗻 𝗱𝗲 𝗹𝗮𝘀 𝗱𝗲𝗹𝗶𝗰𝗶𝗮𝘀: 𝐴𝑐𝑡𝑖𝑣𝑖𝑑𝑎𝑑𝑒𝑠 𝑒𝑛𝑓𝑜𝑐𝑎𝑑𝑎𝑠 𝑎 𝑡𝑜𝑑𝑜 𝑙𝑜 𝑟𝑒𝑙𝑎𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑐𝑜𝑛 𝑙𝑎 𝑔𝑎𝑠𝑡𝑟𝑜𝑛𝑜𝑚𝑖́𝑎, 𝑠𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑒𝑛 𝑟𝑒𝑐𝑒𝑡𝑎𝑠 𝑦 𝑠𝑒 𝑡𝑟𝑎𝑛𝑠𝑚𝑖𝑡𝑒𝑛 𝑒𝑛 𝑣𝑖𝑣𝑜.```'}
        `
        })
            .addFields({
            name: `\u200B`,
            value: `
\u200B
**Dɪᴠᴇʀsᴀs ᴀᴄᴛɪᴠɪᴅᴀᴅᴇs ᴇᴅᴜᴄᴀᴛɪᴠᴀs, ᴄᴜʀsᴏs ᴏ ᴛᴀʟʟᴇʀᴇs ᴄᴏɴ ᴍᴀᴇsᴛʀᴏs ᴠᴏʟᴜɴᴛᴀʀɪᴏs:**
\u200B
\u200B \u200B :money_with_wings: <@&759558925237878813>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑒𝑐𝑜𝑛𝑜𝑚𝑖́𝑎.```'}
\u200B \u200B :computer: \u200B <@&759558925237878813>
${'```𝑇𝑎𝑙𝑙𝑒𝑟 𝑑𝑒 𝑃ℎ𝑜𝑡𝑜𝑠ℎ𝑜𝑝.```'}
\u200B \u200B :amphora: \u200B <@&759558925237878813>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 ℎ𝑖𝑠𝑡𝑜𝑟𝑖𝑎 𝑑𝑒𝑙 𝑎𝑟𝑡𝑒.```'}
\u200B \u200B :cricket: \u200B <@&759558925237878813>
${'```𝐶𝑙𝑎𝑠𝑒𝑠 𝑑𝑒 𝑒𝑐𝑜𝑛𝑜𝑚𝑖́𝑎.```'}
        `
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
            .setFooter('Los bonobos apreciamos mucho la participación!!', 'attachment://migdrp-icon.png');
        return template;
    }
    help() {
        return 'El comando para configurar el canal de verificación';
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('command verificador ejecutado');
            if (!botValidation_1.validateCommandRestrictions(this._command, msgObject)) {
                return;
            }
            if (!this.free) {
                msgObject.author.send('Espérate bónobo, me encuentro ejecutando una tarea de este comando.');
                return;
            }
            this.free = false;
            if (args.length > 0) {
                if (args[0] === 'here') {
                    const channel_ID = yield this.checkSelectedChannel(msgObject);
                    if (channel_ID === null) {
                        msgObject.author.send('No encuentro el canal de verificación, no puedo postear el mensaje de verificación.');
                        return;
                    }
                    if (args[1] !== null && args[1] !== undefined) {
                        msgObject.author.send('Este comando no lleva esos argumentos');
                        return;
                    }
                    const channelDenuncias = yield this.getSelectedChannel(msgObject.client, channel_ID);
                    const embedVerificar = this.crearEmbedVerificador();
                    //Deletes the old embed message if exist
                    if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
                        yield this.currentEmbedMessage.delete();
                    }
                    this.currentEmbedMessage = yield channelDenuncias.send(embedVerificar);
                    yield this.currentEmbedMessage.react('🎙️');
                    yield this.currentEmbedMessage.react('📖');
                    yield this.currentEmbedMessage.react('🎞️');
                    yield this.currentEmbedMessage.react('📝');
                    yield this.currentEmbedMessage.react('👑');
                    yield this.currentEmbedMessage.react('🌿');
                    yield this.currentEmbedMessage.react('👅');
                    yield this.currentEmbedMessage.react('🎬');
                    yield this.currentEmbedMessage.react('🍞');
                    yield this.currentEmbedMessage.react('💸');
                    yield this.currentEmbedMessage.react('💻');
                    yield this.currentEmbedMessage.react('🏺');
                    yield this.currentEmbedMessage.react('🦗');
                    console.log('Verificador here called...');
                    this.free = true;
                    const emojis = [
                        { emoji: '🎙️', role: '759558925237878813' },
                        { emoji: '📖', role: '759558925237878811' },
                        { emoji: '🎞️', role: '759558925237878812' },
                        { emoji: '📝', role: '759558925237878809' },
                        { emoji: '👑', role: '759558925237878814' },
                        { emoji: '🌿', role: '765111083874517003' },
                        { emoji: '👅', role: '765111770834010142' },
                        { emoji: '🎬', role: '765112061872439327' },
                        { emoji: '🍞', role: '765112235365498920' },
                        { emoji: '💸', role: '759558925237878816' },
                        { emoji: '💻', role: '759558925270908999' },
                        { emoji: '🏺', role: '765112537070567425' },
                        { emoji: '🦗', role: '765112699159707649' }
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
                    const filter = (reaction) => {
                        const currentEmoji = emojis.filter(value => value.emoji === reaction.emoji.name);
                        if (currentEmoji) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    };
                    this.reactionCollector = this.currentEmbedMessage.createReactionCollector(filter);
                    this.reactionCollector.options.dispose = true;
                    this.reactionCollector.on('collect', (reaction, user) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`Reaction added: `, reaction.emoji.name);
                        console.log('User: ', user.username);
                        const reactionExist = emojis.filter(value => value.emoji === reaction.emoji.name);
                        if (reactionExist) {
                            const userId = user.id;
                            const member = yield msgObject.guild.members.fetch(userId);
                            member.roles.add(reactionExist[0].role);
                        }
                        else {
                            console.log('Error VERIFICADOR, role not found on emojis array..');
                        }
                    }));
                    this.reactionCollector.on('remove', (reaction, user) => __awaiter(this, void 0, void 0, function* () {
                        console.log(`Reaction removed: `, reaction.emoji.name);
                        console.log('User: ', user.username);
                        const reactionExist = emojis.filter(value => value.emoji === reaction.emoji.name);
                        if (reactionExist) {
                            const userId = user.id;
                            const member = yield msgObject.guild.members.fetch(userId);
                            member.roles.remove(reactionExist[0].role);
                        }
                        else {
                            console.log('Error VERIFICADOR, role not found on emojis array..');
                        }
                    }));
                    channelDenuncias.client.on('message', message => {
                        if (message.channel.name === channelDenuncias.name) {
                            console.log('Nuevo intento de verificación: ', message.content);
                            if (message.content.toLocaleLowerCase() === 'quiero ser chimpancé' || message.content.toLocaleLowerCase() === 'quiero ser chimpance' || message.content.toLocaleLowerCase() === 'quiero ser chimpancè') {
                                if (!message.member.roles.cache.has(this.roles.austra)) {
                                    message.author.send('Tienes que ser Australopitécus para que te otorgue chimpancé. ');
                                    message.delete();
                                    return;
                                }
                                if (message.member.roles.cache.has(this.roles.chimp)) {
                                    message.author.send('Ya eres chimpancé, no pidas incongruencias. ');
                                    message.delete();
                                    return;
                                }
                                message.member.roles.add(this.roles.chimp);
                                message.member.roles.remove(this.roles.austra);
                                message.author.send('Bienvenido a la comunidad bonóbica :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz ');
                                message.delete();
                                return;
                            }
                            if (message.content.toLocaleLowerCase() === 'quiero ser bonobo') {
                                if (!message.member.roles.cache.has(this.roles.austra)) {
                                    message.author.send('Tienes que ser Australopitécus para que te otorgue bonobo. Espera... ¿Qué? ');
                                    message.delete();
                                    return;
                                }
                                if (message.member.roles.cache.has(this.roles.bonobo)) {
                                    message.author.send('Ya eres bonobo, no pidas incongruencias. Espera... ¿Qué?');
                                    message.delete();
                                    return;
                                }
                                message.member.roles.add(this.roles.bonobo);
                                message.member.roles.remove(this.roles.austra);
                                message.author.send('Bienvenido Bonobo a la comunidad :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz ');
                                message.delete();
                                return;
                            }
                            if (message.content.toLocaleLowerCase() === 'quiero ser admin' || message.content.toLocaleLowerCase() === 'quiero ser mod') {
                                if (!message.member.roles.cache.has(this.roles.austra)) {
                                    message.author.send('Tienes que ser Australopitécus para que te otorgue admin. Espera... ¿Qué? ');
                                    message.delete();
                                    return;
                                }
                                const winner = Math.random() * (10 - 0) + 0;
                                if (winner === 5) {
                                    message.member.roles.add(this.roles.winner);
                                    message.member.roles.add(this.roles.bonobo);
                                    message.member.roles.remove(this.roles.austra);
                                    message.author.send('Bienvenido Bonobo a la comunidad :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz ');
                                    message.delete();
                                    return;
                                }
                                else {
                                    message.member.roles.add(this.roles.mamandril);
                                    message.member.roles.add(this.roles.chimp);
                                    message.member.roles.remove(this.roles.austra);
                                    message.author.send('Bienvenido Bonobo a la comunidad :heart:, siéntete en confianza de participar en los diferentes canales de texto y voz ');
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
        });
    }
}
exports.default = Verificador;
