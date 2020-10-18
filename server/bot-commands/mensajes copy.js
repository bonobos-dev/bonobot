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
const temarioDataTest = {
    titulo: '¿Qué pedo con la poesía? ',
    temas: [
        {
            titulo: '¿Qué es la poesía?',
            subtemas: [
                {
                    titulo: 'Perspectiva histórica'
                },
                {
                    titulo: 'Perspectiva personal'
                }
            ]
        },
        {
            titulo: 'La necesidad de la poesía'
        },
        {
            titulo: 'Recados Sabatinos Bonóbicos'
        },
        {
            titulo: 'Corrientes literarias de la poesía',
            subtemas: [
                {
                    titulo: 'Griega'
                },
                {
                    titulo: 'Edad media'
                },
                {
                    titulo: 'Renacimiento'
                },
                {
                    titulo: 'Modernismo'
                },
                {
                    titulo: 'Postmodernismo'
                }
            ]
        },
        {
            titulo: '¿Cómo hacer poesía?',
            subtemas: [
                {
                    titulo: 'Técnicas'
                },
                {
                    titulo: '¿Qué no es la poesía?'
                }
            ]
        },
        {
            titulo: 'Lectura e interpretación',
            subtemas: [
                {
                    titulo: '"A cargo del bonobo promedio"'
                }
            ]
        },
    ]
};
class Mensajes {
    constructor() {
        this._command = "mensajes";
        this.migdrplogo = new Discord.MessageAttachment('./server/assets/img/migdrp-logo-small-red.png', 'migdrp-icon.png');
        this.migdrplogoGreen = new Discord.MessageAttachment('./server/assets/img/migdrp-logo-small-green.png', 'migdrp-icon-green.png');
        this.bonobotlogo = new Discord.MessageAttachment('./server/assets/img/LOGO_bb_dsicordback.png', 'bb-logo.png');
        console.log('Mensajes Command Instantiated');
    }
    createTemarioEmbed() {
        const fieldsForEmbed = () => {
            let fields = [];
            for (var n = 0; n < temarioDataTest.temas.length; n++) {
                let field = {};
                let fieldValues = [];
                if (!temarioDataTest.temas[n].subtemas) {
                    field = {
                        name: temarioDataTest.temas[n].titulo,
                        value: ['\u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b'],
                        inline: false
                    };
                    fields.push(field);
                    continue;
                }
                for (var i = 0; i < temarioDataTest.temas[n].subtemas.length; i++) {
                    if (i === 0) {
                        fieldValues.push('\u200b \u200b \u200b \u200b ');
                    }
                    fieldValues.push(`\u200b \u200b \u200b \u200b   •  ${temarioDataTest.temas[n].subtemas[i].titulo} `);
                    if (i === temarioDataTest.temas[n].subtemas.length - 1) {
                        fieldValues.push('\u200b \u200b \u200b \u200b ');
                    }
                }
                field = {
                    name: temarioDataTest.temas[n].titulo,
                    value: fieldValues,
                    inline: false
                };
                fields.push(field);
            }
            return fields;
        };
        let template = new Discord.MessageEmbed()
            .attachFiles(this.migdrplogo)
            .attachFiles(this.bonobotlogo)
            .setColor('#7ed130')
            .setAuthor('TEMARIO DEL FORO SABATINO', 'attachment://migdrp-icon.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
            .setThumbnail('attachment://bb-logo.png')
            .setDescription(`

            :radio:  \u200B \u200B \u200B ***__ Sobre la charla sabatina __***  \u200B \u200B \u200B :radio:

            El tema ganador de esta semana es: 
            
            ***__ ${temarioDataTest.titulo} __***

        `)
            .addFields({ name: '\u200B', value: '\u200B' })
            .addFields(fieldsForEmbed())
            .addFields({
            name: '\u200b \u200b \u200b \u200b',
            value: '\u200b \u200b \u200b \u200b',
            inline: false
        })
            .setTimestamp()
            .addFields({
            name: 'Horario de las charlas',
            value: [
                '\u200b',
                ' 8:10 PM :flag_mx:  (CDMX)',
                ' 8:10 PM :flag_co:  /  :flag_pe: / :flag_ec:',
                ' 7:10 PM :flag_bo:  /  :flag_ve:',
                ' 10:10 PM :flag_ar:  /  :flag_uy:',
                ' 9:10 PM :flag_cl:',
                ' 2:10 AM :flag_ea:',
                '\u200b',
            ]
        })
            .setFooter('Los bonobos apreciamos mucho la participación!!', 'attachment://migdrp-icon.png');
        return template;
    }
    createEmbed() {
        let template = new Discord.MessageEmbed()
            .attachFiles(this.migdrplogoGreen)
            .attachFiles(this.bonobotlogo)
            .setColor('#80ab1d')
            .setAuthor('COMUNICADO BONÓBICO OFICIAL', 'attachment://migdrp-icon-green.png', 'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg')
            .setDescription(`

        \u200B 
        :warning:  \u200B \u200B \u200B ***_Sobre la charla sabatina_***  \u200B \u200B \u200B :warning:

            ¡Hey bonobos! ¿Qué tal? ¿Cómo les trata la vida? Luego de unas conversaciones en administración se decidió que para tener más calidad en los foros sabatinos, este será cada dos semanas, así que… **¡Nos vemos el sábado 19 de septiembre para el próximo foro!**  Mientras tanto, sigamos con las actividades habituales.
            
            \u200B
        `)
            .setThumbnail('attachment://bb-logo.png')
            .setTimestamp()
            .setFooter('Para comentarios, inquietudes o sugerencias contacte a su esencial más cercano', 'attachment://migdrp-icon-green.png');
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
            if (args.length > 0) {
                if (args[0] === 'rollback') {
                }
                else if (args[0] === 'skip') {
                }
            }
            ;
            //Deletes the old embed message if exist
            if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
                yield this.currentEmbedMessage.delete();
            }
            let TurnsEmbed = this.createEmbed();
            /*
            await msgObject.channel.send(`<@&705975181688045598>
    
    Aqui tienen el temario para la parla sabatina, recuerden que cualquier informacion respecto al tema la pueden postear en <#698202549697773610>
    
    `);
            */
            yield msgObject.channel.send(`@everyone`);
            yield msgObject.channel.send(TurnsEmbed);
        });
    }
}
exports.default = Mensajes;
