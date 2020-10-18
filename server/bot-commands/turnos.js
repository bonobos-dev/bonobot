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
exports.turnos_states = void 0;
const Discord = __importStar(require("discord.js"));
const botValidation_1 = require("../utils/botValidation");
const networkUtil_1 = require("../utils/networkUtil");
var turnos_states;
(function (turnos_states) {
    turnos_states["working"] = "working";
    turnos_states["free"] = " free";
})(turnos_states = exports.turnos_states || (exports.turnos_states = {}));
class Turnos {
    constructor() {
        this._command = "turnos";
        this.users = ['\u200B'];
        this.currentUser = ['\u200B', 'No hay nadie en la lista'];
        this.lastUser = 'No hay nadie en la lista';
        this.migdrplogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/migdrp-logo-small-red.png`, 'migdrp-icon.png');
        this.bonobotlogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/LOGO_bb_dsicordback.png`, 'bb-logo.png');
        this.state = turnos_states.free;
        console.log('Turns Command Instantiated');
    }
    createEmbed() {
        let template = new Discord.MessageEmbed()
            .attachFiles(this.migdrplogo)
            .attachFiles(this.bonobotlogo)
            .setColor('#e31452')
            .setAuthor('TAQUILLA BONÓBICA', 'attachment://migdrp-icon.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
            .setDescription(`

            • Para solicitar su turno   :tickets:

            • Para finalizar su turno   :white_check_mark:

            • Para cancelar su turno    :no_entry:

        `)
            .setThumbnail('attachment://bb-logo.png')
            .addFields({ name: '\u200B', value: '\u200B' })
            .addFields({
            name: `Turno actual :microphone2: \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b `,
            value: this.currentUser,
            inline: true
        }, {
            name: `Turnos pendientes :stopwatch:\u200b \u200b \u200b `,
            value: this.users,
            inline: true
        }, /*
        {
            name: 'Interrupciones :mute: ' ,
            value: this.interrupt,
            inline: true
        },*/ { name: '\u200B', value: '\u200B', inline: true }, { name: '\u200B', value: '\u200B', inline: true })
            .setTimestamp()
            .setFooter('Solo se permite un turno activo por persona', 'attachment://migdrp-icon.png');
        return template;
    }
    help() {
        return 'Este comando es el sitema de tickets de la comunidad bonóbica';
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!botValidation_1.validateCommandRestrictions(this._command, msgObject)) {
                return;
            }
            if (this.state === turnos_states.working) {
                msgObject.channel.send('Espérate bónobo, me encuentro ejecutando un comando ahora mismo');
                return;
            }
            this.state = turnos_states.working;
            if (args.length > 0) {
                if (args[0] === 'rollback') {
                    if (this.users.length < 2) {
                        if (this.lastUser === 'No hay nadie en la lista') {
                            //console.log('No rollback exception')
                            return;
                        }
                        else {
                            if (this.currentUser[1] !== 'No hay nadie en la lista') {
                                this.users.push(this.currentUser[1]);
                            }
                            this.currentUser[1] = this.lastUser;
                        }
                    }
                    else {
                        let result = this.users.splice(1, 0, this.currentUser[1]);
                        //console.log('Rollback Result', result);
                        this.currentUser[1] = this.lastUser;
                    }
                }
                else if (args[0] === 'skip') {
                    if (this.users.length < 2) {
                        this.lastUser = this.currentUser[1];
                        this.currentUser[1] = 'No hay nadie en la lista';
                    }
                    else {
                        this.lastUser = this.currentUser[1];
                        this.currentUser[1] = this.users[1];
                        this.users.splice(1, 1);
                    }
                }
                else {
                    msgObject.channel.send('El comando no necesita argumentos');
                    return;
                }
            }
            ;
            //Deletes the old embed message if exist
            if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
                yield this.currentEmbedMessage.delete();
            }
            let TurnsEmbed = this.createEmbed();
            //console.log("Embed msg => ",TurnsEmbed);
            this.currentEmbedMessage = yield msgObject.channel.send(TurnsEmbed);
            //console.log("Despues de enviar el embed: ", this.currentEmbedMessage);
            yield this.currentEmbedMessage.react('🎟️');
            yield this.currentEmbedMessage.react('⛔');
            yield this.currentEmbedMessage.react('✅');
            const filter = (reaction) => reaction.emoji.name === '🎟️' || reaction.emoji.name === '⛔' || reaction.emoji.name === '✅';
            /*
            const result = await ( embedMesage as Discord.Message ).awaitReactions(filter, { time: 10000 })
            
            .then(collected => console.log(`Collected ${collected.size} reactions`))
            .catch(console.error);
    
            */
            this.reactionCollector = this.currentEmbedMessage.createReactionCollector(filter);
            this.reactionCollector.on('collect', (reaction, user) => __awaiter(this, void 0, void 0, function* () {
                //console.log(`Reaction: `, reaction.emoji.name);
                //console.log('User: ', user.username);
                //When a user reacts a ticket
                if (reaction.emoji.name === '🎟️') {
                    console.log(`New ticket for user: ${user.username}`);
                    //If user is the current user remove reaction and return
                    if (this.currentUser[1] === user.username) {
                        msgObject.channel.send(`Cuidado ${user.username}, ya estás en la lista! `);
                        this.state = turnos_states.free;
                        return;
                    }
                    if (this.currentUser[1] === 'No hay nadie en la lista') {
                        this.currentUser[1] = user.username;
                        //console.log("No hay nadie en la cola")
                        //console.log("Currnet user", this.currentUser);
                        reaction.message.edit(this.createEmbed());
                        this.state = turnos_states.free;
                        return;
                    }
                    else {
                        if (this.users.length < 2) {
                            //this.users.push(user.username);
                            this.users.push(user.username);
                            reaction.message.edit(this.createEmbed());
                            this.state = turnos_states.free;
                            return;
                        }
                        else {
                            for (var n = 1; n < this.users.length; n++) {
                                if (this.users[n] === user.username) {
                                    msgObject.channel.send(`Cuidado ${user.username}, ya estás en la lista! `);
                                    this.state = turnos_states.free;
                                    return;
                                }
                            }
                            this.users.push(user.username);
                            reaction.message.edit(this.createEmbed());
                            this.state = turnos_states.free;
                            return;
                        }
                    }
                }
                if (reaction.emoji.name === '⛔') {
                    console.log(`User ${user.username} revoked ticked`);
                    if (this.currentUser[1] === user.username) {
                        if (this.users.length < 2) {
                            this.currentUser[1] = 'No hay nadie en la lista';
                            reaction.message.edit(this.createEmbed());
                            this.state = turnos_states.free;
                            return;
                        }
                        else {
                            this.currentUser[1] = this.users[1];
                            this.users.splice(1, 1);
                            reaction.message.edit(this.createEmbed());
                            this.state = turnos_states.free;
                            return;
                        }
                    }
                    else {
                        const found = this.users.find(value => {
                            if (value === user.username)
                                return true;
                            else {
                                return false;
                            }
                        });
                        if (found) {
                            let result = this.users.filter(value => value !== user.username);
                            this.users = result;
                            reaction.message.edit(this.createEmbed());
                            this.state = turnos_states.free;
                            return;
                        }
                        if (!found) {
                            msgObject.channel.send(`Cuidado ${user.username}, tienes que estar en la lista para poder salir de ella! `);
                            this.state = turnos_states.free;
                            return;
                        }
                    }
                }
                if (reaction.emoji.name === '✅' && user.username === this.currentUser[1]) {
                    console.log(`User ${user.username} end a turn`);
                    if (this.users.length < 2) {
                        this.lastUser = this.currentUser[1];
                        this.currentUser[1] = 'No hay nadie en la lista';
                        reaction.message.edit(this.createEmbed());
                        this.state = turnos_states.free;
                        return;
                    }
                    else {
                        this.lastUser = this.currentUser[1];
                        this.currentUser[1] = this.users[1];
                        this.users.splice(1, 1);
                        reaction.message.edit(this.createEmbed());
                        this.state = turnos_states.free;
                        return;
                    }
                }
                else {
                    msgObject.channel.send(`Solo el bonobo en turno puede finalizar su turno, valga la redundancia ${user.username}! `);
                    this.state = turnos_states.free;
                }
            }));
            this.reactionCollector.on('end', collected => {
                console.log(`Collected ${collected.size} items`);
            });
            this.state = turnos_states.free;
        });
    }
}
exports.default = Turnos;
