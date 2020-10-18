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
class Denuncia {
    constructor() {
        this._command = "denuncia";
        this.channel = '🔴・usuarios_denunciados';
        this.usuarios = [];
        console.log('Denuncia Command Instantiated');
        console.log('hosturl', networkUtil_1.getHostUrl());
        this.attachFiles();
        console.log('Attached logo files: ', this.migdrplogo);
        console.log('Attached logo files: ', this.bonobotlogo);
    }
    attachFiles() {
        this.migdrplogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/migdrp-logo-small-red.png`, 'migdrp-icon.png');
        this.bonobotlogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/LOGO_bb_dsicordback.png`, 'bb-logo.png');
    }
    getRule(rule) {
        const rules = [
            `**Regla 1** 
            \u200B
            ${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 ℎ𝑎𝑐𝑒𝑟 𝑠𝑝𝑎𝑚.```'}`,
            `**Regla 2** 
            \u200B
            ${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑛𝑖𝑛𝑔𝑢𝑛𝑎 𝑐𝑙𝑎𝑠𝑒 𝑑𝑒 𝑟𝑢𝑖𝑑𝑜 𝑚𝑜𝑙𝑒𝑠𝑡𝑜 𝑚𝑎𝑙𝑖𝑛𝑡𝑒𝑛𝑐𝑖𝑜𝑛𝑎𝑑𝑜 𝑒𝑛 𝑙𝑜𝑠 𝑐𝑎𝑛𝑎𝑙𝑒𝑠 𝑑𝑒 𝑣𝑜𝑧, 𝑑𝑒𝑏𝑒𝑛 𝑠𝑖𝑙𝑒𝑛𝑐𝑖𝑎𝑟 𝑠𝑢 𝑚𝑖𝑐𝑟𝑜́𝑓𝑜𝑛𝑜 𝑠𝑖 𝑛𝑜 𝑒𝑠𝑡𝑎́𝑛 ℎ𝑎𝑏𝑙𝑎𝑛𝑑𝑜.```'}`,
            `**Regla 3** 
            \u200B
            ${'```𝑆𝑒 𝑑𝑒𝑏𝑒𝑛 𝑙𝑒𝑒𝑟 𝑙𝑎𝑠 𝑑𝑒𝑠𝑐𝑟𝑖𝑝𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑐𝑎𝑑𝑎 𝑐𝑎𝑛𝑎𝑙, 𝑛𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑐𝑜𝑚𝑝𝑎𝑟𝑡𝑖𝑟 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑓𝑢𝑒𝑟𝑎 𝑑𝑒𝑙 𝑐𝑎𝑛𝑎𝑙 𝑐𝑜𝑟𝑟𝑒𝑠𝑝𝑜𝑛𝑑𝑖𝑒𝑛𝑡𝑒.```'}`,
            `**Regla 4** 
            \u200B
            ${'```𝐸𝑙 𝑐𝑜𝑛𝑡𝑒𝑛𝑖𝑑𝑜 𝑁𝑆𝐹𝑊 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑢́𝑛𝑖𝑐𝑎𝑚𝑒𝑛𝑡𝑒 𝑒𝑛 🍆・canal_de_sexo. 𝑆𝑒 𝑝𝑟𝑜ℎ𝑖́𝑏𝑒 𝑒𝑙 𝐶ℎ𝑖𝑙𝑑𝑃𝑜𝑟𝑛 𝑦 𝑒𝑙 𝑔𝑜𝑟𝑒.```'}`,
            `**Regla 5** 
            \u200B
            ${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑙𝑎 𝑝𝑟𝑜𝑝𝑎𝑔𝑎𝑛𝑑𝑎, 𝑙𝑎 𝑝𝑢𝑏𝑙𝑖𝑐𝑖𝑑𝑎𝑑 𝑑𝑒𝑏𝑒 𝑠𝑒𝑟 𝑎𝑢𝑡𝑜𝑟𝑖𝑧𝑎𝑑𝑎 𝑝𝑜𝑟 𝑙𝑎 𝑎𝑑𝑚𝑖𝑛𝑖𝑠𝑡𝑟𝑎𝑐𝑖𝑜́𝑛.```'}`,
            `**Regla 6** 
            \u200B
            ${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒 𝑎𝑏𝑢𝑠𝑎𝑟 𝑑𝑒 𝑙𝑜𝑠 𝑒𝑚𝑜𝑗𝑖𝑠, ℎ𝑎𝑦 𝑢𝑛 𝑙𝑖́𝑚𝑖𝑡𝑒 𝑑𝑒 20 𝑒𝑚𝑜𝑗𝑖𝑠 𝑝𝑜𝑟 𝑚𝑒𝑛𝑠𝑎𝑗𝑒.```'}`,
            `**Regla 7** 
            \u200B
            ${'```𝑁𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑛𝑜𝑚𝑏𝑟𝑒𝑠 𝑐𝑜𝑛 𝑠𝑖́𝑚𝑏𝑜𝑙𝑜𝑠 𝑒𝑥𝑡𝑟𝑎𝑣𝑎𝑔𝑎𝑛𝑡𝑒𝑠 𝑛𝑖 𝑓𝑜𝑡𝑜𝑠 𝑑𝑒 𝑝𝑒𝑟𝑓𝑖𝑙 𝑁𝑆𝐹𝑊.```'}`,
            `**Regla 8** 
            \u200B
            ${'```𝑆𝑜𝑙𝑜 𝑠𝑒 𝑝𝑒𝑟𝑚𝑖𝑡𝑒𝑛 𝑑𝑜𝑠 𝑐𝑢𝑒𝑛𝑡𝑎𝑠 𝑝𝑜𝑟 𝑝𝑒𝑟𝑠𝑜𝑛𝑎.```'}`,
            `**Regla 9** 
            \u200B
            ${'```𝑃𝑟𝑖𝑜𝑟𝑖𝑧𝑎𝑚𝑜𝑠 𝑒𝑙 𝑟𝑒𝑠𝑝𝑒𝑡𝑜 𝑚𝑢𝑡𝑢𝑜, 𝑑𝑒𝑏𝑒𝑛 𝑐𝑢𝑖𝑑𝑎𝑟 𝑙𝑎 𝑓𝑜𝑟𝑚𝑎 𝑑𝑒 𝑒𝑥𝑝𝑟𝑒𝑠𝑎𝑟𝑠𝑒, 𝑛𝑜 𝑖𝑚𝑝𝑜𝑛𝑔𝑎𝑛 𝑖𝑑𝑒𝑎𝑠 𝑦 𝑙𝑙𝑒𝑣𝑒𝑛 𝑙𝑎𝑠 𝑐𝑜𝑛𝑣𝑒𝑟𝑠𝑎𝑐𝑖𝑜𝑛𝑒𝑠 𝑑𝑒 𝑚𝑎𝑛𝑒𝑟𝑎 𝑡𝑟𝑎𝑛𝑞𝑢𝑖𝑙𝑎.```'}`,
            `**Regla 10** 
            \u200B
            ${'```𝑁𝑜 𝑠𝑒 𝑡𝑜𝑙𝑒𝑟𝑎 𝑒𝑙 𝑎𝑐𝑜𝑠𝑜 𝑎 𝑜𝑡𝑟𝑜𝑠 𝑚𝑖𝑒𝑚𝑏𝑟𝑜𝑠 𝑑𝑒𝑙 𝑠𝑒𝑟𝑣𝑖𝑑𝑜𝑟, 𝑎𝑛𝑡𝑒 𝑢𝑛 𝑐𝑎𝑠𝑜 𝑐𝑜𝑚𝑝𝑟𝑜𝑏𝑎𝑑𝑜 𝑠𝑒 𝑜𝑝𝑡𝑎𝑟𝑎́ 𝑝𝑜𝑟 𝑒𝑙 𝑏𝑎𝑛 𝑖𝑛𝑚𝑒𝑑𝑖𝑎𝑡𝑜 𝑦 𝑠𝑒 𝑛𝑜𝑡𝑖𝑓𝑖𝑐𝑎𝑟𝑎́ 𝑎𝑙 𝑒𝑞𝑢𝑖𝑝𝑜 𝑑𝑒 𝑑𝑖𝑠𝑐𝑜𝑟𝑑.```'}`,
            `**Regla 11** 
            \u200B
            ${'```𝐴𝑏𝑠𝑡𝑒́𝑛𝑔𝑎𝑛𝑠𝑒 𝑑𝑒 𝑠𝑒𝑟 𝑜𝑏𝑠𝑡𝑖𝑛𝑎𝑑𝑜𝑠 𝑐𝑢𝑎𝑛𝑑𝑜 𝑠𝑒 𝑙𝑒𝑠 𝑎𝑑𝑣𝑖𝑒𝑟𝑡𝑎 𝑠𝑜𝑏𝑟𝑒 𝑎𝑙𝑔𝑢𝑛𝑎 𝑎𝑐𝑐𝑖𝑜́𝑛, 𝑚𝑎𝑛𝑡𝑒𝑛𝑒𝑟 𝑒𝑙 𝑜𝑟𝑑𝑒𝑛 𝑑𝑒 𝑙𝑎 𝑐𝑜𝑚𝑢𝑛𝑖𝑑𝑎𝑑 𝑒𝑠 𝑢𝑛𝑎 𝑙𝑎𝑏𝑜𝑟 𝑑𝑒 𝑡𝑜𝑑𝑜𝑠 𝑙𝑜𝑠 𝑏𝑜𝑛𝑜𝑏𝑜𝑠.```'}`,
        ];
        const selectedRule = rules[rule - 1];
        return selectedRule;
    }
    crearEmbedDenuncia(message, denunciado, canal, regla) {
        let template = new Discord.MessageEmbed()
            .attachFiles(this.migdrplogo)
            .attachFiles(this.bonobotlogo)
            .setColor('#e31452')
            .setAuthor('DENUNCIA BONÓBICA', 'attachment://migdrp-icon.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
            .setThumbnail('attachment://bb-logo.png')
            .setDescription(`El usuario **${message.author.username}** con ID **${message.author.id}** ha levantado una denuncia anónima`)
            .addFields({ name: '\u200B', value: `
**Usuario denunciado:** ${denunciado}
\u200B
**Canal de los sucesos:** ${canal}
\u200B
**El usuario incumplió la** ${regla}
\u200B
        ` })
            .setTimestamp()
            .setFooter('Fecha y hora de la denuncia:', 'attachment://migdrp-icon.png');
        return template;
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
                console.log("Error on checkSelectedChannel().. ", e);
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
    cleanUsers() {
        this.usuarios = [];
    }
    compareUserDates(user, msgObject) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUserId = msgObject.author.id;
                const actualDate = new Date(Date.now());
                const usersRegistered = yield this.usuarios.find(user => {
                    if (user.user_id === currentUserId) {
                        return user;
                    }
                });
                if (usersRegistered) {
                    console.log('User FOUND comparing dates... ');
                    const userDate = new Date(usersRegistered.last_call);
                    var diffMs = (actualDate - userDate);
                    var diffDays = Math.floor(diffMs / 86400000);
                    var diffHrs = Math.floor((diffMs % 86400000) / 3600000);
                    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                    console.log(diffDays + " days, " + diffHrs + " hours, " + diffMins + " difference");
                    if (diffMins > 1) {
                        this.usuarios = this.usuarios.filter(user => user.user_id !== currentUserId);
                        console.log('Filtered: ', this.usuarios);
                        this.usuarios.push({ user_id: currentUserId, last_call: Date.now() });
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    console.log('User NOT found pushing user.. ');
                    this.usuarios.push(user);
                    console.log("Usuarios: ", this.usuarios);
                    return true;
                }
            }
            catch (e) {
                console.log("Error on getSelectedChannel().. ", e);
            }
        });
    }
    help() {
        return 'Comando de generación de temarios de la Comunidad Bonóbica';
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!botValidation_1.validateCommandRestrictions(this._command, msgObject)) {
                return;
            }
            if (!(yield this.compareUserDates({ user_id: msgObject.author.id, last_call: Date.now() }, msgObject))) {
                msgObject.author.send('No puedes levantar denuncias tan rápido...');
                return;
            }
            const channel_ID = yield this.checkSelectedChannel(msgObject);
            if (channel_ID === null) {
                msgObject.author.send('No encuentro el canal de denuncias, no puedo postear tu denuncia.');
                return;
            }
            const channelDenuncias = yield this.getSelectedChannel(msgObject.client, channel_ID);
            if (args.length > 0) {
                if (args[0] === '') {
                    msgObject.author.send('Faltan argumentos (denunciado)');
                    console.log(`Args: `, args);
                    return;
                }
                else if (args[1] === '') {
                    msgObject.author.send('Faltan argumentos (canal)');
                    console.log(`Args: `, args);
                    return;
                }
                else if (args[2] === '') {
                    msgObject.author.send('Faltan argumentos (regla)');
                    console.log(`Args: `, args);
                    return;
                }
                else {
                    if (args[2] !== '1' && args[2] !== '2' && args[2] !== '3' && args[2] !== '4' && args[2] !== '5' && args[2] !== '6' && args[2] !== '7' && args[2] !== '8' && args[2] !== '9') {
                        msgObject.author.send('Lo siento Bonobo, esa regla no existe');
                        return;
                    }
                    const rule = this.getRule(parseInt(args[2]));
                    channelDenuncias.send(this.crearEmbedDenuncia(msgObject, args[0], args[1], rule));
                    msgObject.author.send('He mandado tu denuncia. Gracias por hablar conmigo, me siento solo y me aburro :C');
                }
            }
        });
    }
}
exports.default = Denuncia;
