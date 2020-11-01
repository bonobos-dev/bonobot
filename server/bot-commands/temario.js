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
const temarioDataTest = {
    titulo: '',
    temas: [
        {
            titulo: '***__SALUD PERSONAL__*** ',
            subtemas: [
                {
                    titulo: '*¿Qué es la salud?*'
                },
                {
                    titulo: '*Higiene*'
                },
                {
                    titulo: '*Ambiente*'
                },
                {
                    titulo: '*Actividades Recreativas*'
                },
                {
                    titulo: '*Sexualidad*'
                }
            ]
        }
    ]
};
const temarioDataTestFull = {
    titulo: `
Salud Personal 
\u200B
    `,
    temas: [
        {
            titulo: '¿Qué es la salud?'
        },
        {
            titulo: 'Alimentación',
            subtemas: [
                {
                    titulo: 'Aspecto biológico.'
                },
                {
                    titulo: 'Aspecto psicológico.'
                },
                {
                    titulo: 'Aspecto social.'
                }
            ]
        },
        {
            titulo: 'Higiene',
            subtemas: [
                {
                    titulo: 'Aspecto biológico.'
                },
                {
                    titulo: 'Aspecto psicológico.'
                },
                {
                    titulo: 'Aspecto social.'
                }
            ]
        },
        {
            titulo: 'Ambiente',
            subtemas: [
                {
                    titulo: 'Aspecto biológico.'
                },
                {
                    titulo: 'Aspecto psicológico.'
                },
                {
                    titulo: 'Aspecto social.'
                }
            ]
        },
        {
            titulo: 'Actividades Recreativas',
            subtemas: [
                {
                    titulo: 'Aspecto biológico.'
                },
                {
                    titulo: 'Aspecto psicológico.'
                },
                {
                    titulo: 'Aspecto social.'
                }
            ]
        },
        {
            titulo: 'Sexualidad',
            subtemas: [
                {
                    titulo: 'Aspecto biológico.'
                },
                {
                    titulo: 'Aspecto psicológico.'
                },
                {
                    titulo: 'Aspecto social.'
                }
            ]
        }
    ]
};
class Temario {
    constructor() {
        this._command = "temario";
        this.migdrplogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/migdrp-logo-small-parla_sabatina.png`, 'migdrp-icon.png');
        this.bonobotlogo = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/LOGO_bb_dsicordback.png`, 'bb-logo.png');
        this.imgParla = new Discord.MessageAttachment(`${networkUtil_1.getHostUrl()}/img/foro-img.jpg`, 'foro-img.jpg');
        console.log('Temario Command Instantiated');
    }
    crearEmbedTemario(aviso, data) {
        const temarioData = data;
        const fieldsForEmbed = () => {
            let fields = [];
            //Para todos los temas en el temario
            for (var n = 0; n < temarioData.temas.length; n++) {
                let field = {};
                let fieldValues = [];
                //Si no hay subtemas el valord será un espacio en blanco
                if (!temarioData.temas[n].subtemas) {
                    field = {
                        name: temarioData.temas[n].titulo,
                        value: ['\u200b'],
                        inline: false
                    };
                    fields.push(field);
                    continue;
                }
                //Si hay subtemas se agregarán al array 'value'
                for (var i = 0; i < temarioData.temas[n].subtemas.length; i++) {
                    //if(i === 0){ fieldValues.push('\u200b \u200b \u200b \u200b ') }
                    fieldValues.push(`\u200b \u200b  ${aviso ? '' : '-'} ${temarioData.temas[n].subtemas[i].titulo}`);
                    if (i === temarioData.temas[n].subtemas.length - 1) {
                        fieldValues.push('\u200b \u200b \u200b \u200b ');
                        //fieldValues.push('\u200b \u200b \u200b \u200b ') 
                    }
                }
                field = {
                    name: temarioData.temas[n].titulo,
                    value: fieldValues,
                    inline: false
                };
                fields.push(field);
            }
            return fields;
        };
        if (aviso) {
            let template = new Discord.MessageEmbed()
                .attachFiles(this.migdrplogo)
                .attachFiles(this.bonobotlogo)
                .attachFiles(this.imgParla)
                .setColor('#a956bd')
                .setAuthor('TEMARIO DEL FORO SABATINO', 'attachment://migdrp-icon.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
                .setThumbnail('attachment://bb-logo.png')
                .setDescription(`
                :microphone2:  \u200B \u200B \u200B ***__ Sobre el foro sabatino __***  \u200B \u200B \u200B :microphone2: 
        
                El tema para esta charla es: 
                \u200B     
            `)
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
                ]
            })
                .setFooter('¡Los bonobos apreciamos mucho la participación!', 'attachment://migdrp-icon.png');
            return template;
        }
        else {
            let template = new Discord.MessageEmbed()
                .attachFiles(this.migdrplogo)
                .attachFiles(this.bonobotlogo)
                .setColor('#a956bd')
                .setAuthor('TEMARIO DEL FORO SABATINO', 'attachment://migdrp-icon.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
                .setThumbnail('attachment://bb-logo.png')
                .setDescription(`
                
                ***__ ${temarioData.titulo} __***
    
            `)
                .addFields(fieldsForEmbed())
                .setTimestamp()
                .setFooter('Los bonobos apreciamos mucho la participación!!', 'attachment://migdrp-icon.png');
            return template;
        }
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
            let mention = '<@&697314419868172298>';
            if (args.length > 0) {
                if (args[0] === 'aviso') {
                    if (args[1] !== null && args[1] !== undefined) {
                        mention = args[1];
                        console.log(args[1]);
                    }
                    if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
                        yield this.currentEmbedMessage.delete();
                    }
                    let TurnsEmbed = this.crearEmbedTemario(true, temarioDataTest);
                    yield msgObject.channel.send(`${mention} Aquí tienen el temario para la parla sabatina, recuerden que cualquier información respecto al tema la pueden postear en <#698202549697773610>`);
                    yield msgObject.channel.send(TurnsEmbed);
                }
                return;
            }
            if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
                yield this.currentEmbedMessage.delete();
            }
            let TurnsEmbed = this.crearEmbedTemario(false, temarioDataTestFull);
            yield msgObject.channel.send(TurnsEmbed);
        });
    }
}
exports.default = Temario;
