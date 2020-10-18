import * as Discord from 'discord.js';
import { CommandConfig, config } from '../botConfig';

export function isBot(message:Discord.Message){
    if(!message.author.bot){
        return false;
    }
    
    return true;
}


export function isInvalidUser(message:Discord.Message){
    const ignoredUsers = config.ignored_users;

    for(var i = 0; i < ignoredUsers.length; i++){
        if(ignoredUsers[i].id === message.author.id){
            console.log(`The User (${message.author.username}) with id (${message.author.id}) will be ignored..`);
            return false;
        }
    }
    return true;

}

export function GuildInWhitelist (message:Discord.Message): Discord.Guild{

    const validGuilds = config.valid_guilds;

    for(var i = 0; i < validGuilds.length; i++){
        if(validGuilds[i].guildId === message.guild.id){
            return message.guild;
        }
    }
    console.log(`The Guild (${message.guild.name}) with id (${message.guild.id}) is not in the whitelist, your message will be ignored..`);
    message.channel.send(`Lo siento, tu servidor no es digno de mis habilidades`);
    return null;

}


export function RoleInWhitelist ( message: Discord.Message ) {
    
    const validGuilds = config.valid_guilds;

   

    for(var i = 0; i < validGuilds.length; i++){
        if(validGuilds[i].guildId === message.guild.id){
            for(var n = 0; n < validGuilds[i].roles.length; n++){
                if(message.member.roles.cache.has(validGuilds[i].roles[n].roleId)){
                    return true;
                }
            }
            console.log(`No whitelist roles found on user (${message.author.username}) with id (${message.author.id}), your messages will be ignored`);
            return false;
        }
    }
    console.log(`The Guild (${message.guild.name}) with id (${message.guild.id}) is not in the whitelist, your message will be ignored..`)
    return false;
}


export function validateCommandRestrictions ( command:string , message:Discord.Message){
    const commands =  config.commands;

    const guild = GuildInWhitelist(message);

    if(guild === null){
        return;
    }
    
    for(var n = 0; n < commands.length;  n++){
        if(commands[n].command === command){
            const commandRestrictions = commands[n].restrictions;

            for ( var i = 0; i < commandRestrictions.length; i++){
                if(commandRestrictions[i].guildId === guild.id){

                    const guildRolesRestrictions = commandRestrictions[i].roles;
                    if(guildRolesRestrictions.length < 1){

                        return true;
                    }

                    for(const role of guildRolesRestrictions){
                        if(message.member.roles.cache.has(role.roleId)){
                            
                            return true;
                        }
                    }
                    console.log(`Restricted command (${command}) for user (${message.author.username}) with id (${message.author.id})`);
                    message.channel.send(`>>> :no_entry_sign: Lo siento **${message.member.nickname}**, no tienes permisos para ejecutar el comando :no_entry_sign:`);
                    return false;
                }
            }


        }
    }
    console.log(`Command not found (${command}) `);
    return false;
}