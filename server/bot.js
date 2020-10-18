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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBot = void 0;
const Discord = __importStar(require("discord.js"));
const BotConfig = __importStar(require("./botConfig"));
const botValidation_1 = require("./utils/botValidation");
const denuncia_1 = __importDefault(require("./bot-commands/denuncia"));
const mensajes_1 = __importDefault(require("./bot-commands/mensajes"));
const temario_1 = __importDefault(require("./bot-commands/temario"));
const turnos_1 = __importDefault(require("./bot-commands/turnos"));
const verificador_1 = __importDefault(require("./bot-commands/verificador"));
const server_1 = __importDefault(require("./bot-commands/server"));
const client = new Discord.Client({ fetchAllMembers: true });
let commands = [];
/*old
const LoadCommands = ( commandsPath:string ): void => {

    if( !BotConfig.config || (BotConfig.config.commands).length === 0 ) {    return    }

    for (const commandObj of BotConfig.config.commands){

        const commandClass =  require(`${commandsPath}/${commandObj.command}`).default;

        const command =  new commandClass() as MigBotCommand;

        commands.push(command);

    }
    //console.log('Commands loaded: ', commands);
}
*/
const LoadCommands = () => {
    const denunciaCmd = new denuncia_1.default();
    const mensajesCmd = new mensajes_1.default();
    const temarioCmd = new temario_1.default();
    const turnosCmd = new turnos_1.default();
    const verificadorCmd = new verificador_1.default();
    const serverCmd = new server_1.default();
    //const cleanrolesCmd = new cleanroles() as MigBotCommand;
    const comandosClases = [denunciaCmd, mensajesCmd, temarioCmd, turnosCmd, verificadorCmd, serverCmd];
    if (!BotConfig.config || (BotConfig.config.commands).length === 0) {
        return;
    }
    for (const commandClass of comandosClases) {
        commands.push(commandClass);
    }
};
const handleCommand = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    let command = msg.content.split(" ")[0].replace(BotConfig.config.prefix, "");
    let args = msg.content.split(" ").slice(1);
    console.log('Hnadle cmd: ', command);
    console.log('Hnadle args: ', args);
    for (const commandClass of commands) {
        try {
            if (!commandClass.isThisCommand(command)) {
                continue;
            }
            commandClass.runCommand(args, msg, client);
        }
        catch (exception) {
            console.log("ERROR EN handle Command");
            throw new Error(exception);
        }
    }
});
const initBot = () => {
    LoadCommands();
    var newClient = client.on('ready', () => {
        console.log('Bot is ready on discord!!');
    });
    client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
        //sconsole.log( 'Message content: ', message );
        if (!message.content.startsWith(BotConfig.config.prefix)) {
            return;
        }
        if (botValidation_1.isBot(message)) {
            return;
        }
        if (!botValidation_1.isInvalidUser(message)) {
            return;
        }
        if (botValidation_1.GuildInWhitelist(message) === null) {
            return;
        }
        let roles = [];
        message.member.roles.cache.forEach(role => {
            let roleFound = {
                roleName: role.name,
                roleId: role.id
            };
            roles.push(roleFound);
        });
        let messageJson = {
            server: {
                name: message.guild.name,
                id: message.guild.id
            },
            channel: {
                name: message.channel.name,
                id: message.channel.id
            },
            user: {
                username: message.author.username,
                id: message.author.id
            },
            message: message.content,
            roles: roles
        };
        console.log(`New message recibed: `, messageJson);
        if (message.channel.type === 'dm') {
            console.log(`El usuario ${message.author.username} mando un mensaje al bonobot`);
            return;
        }
        console.log('New message recived from');
        handleCommand(message);
    }));
    ///console.log('TOKEN : ', process.env.DISCORD_TOKEN )
    client.login(process.env.DISCORD_TOKEN);
};
exports.initBot = initBot;
