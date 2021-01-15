import { Message } from 'discord.js';
import { RoleUseCases } from '../usecases';
import { RoleData } from '../interfaces';
import { newBotConfigurationObject } from '../botConfig';

const roleCases = new RoleUseCases();

export function isBot(message: Message): boolean {
  if (!message.author.bot) return false;
  return true;
}

export function ignoreUser(message: Message, ignoredUsers: string[]): boolean {
  if (ignoredUsers.length === 0) return false;
  for (let i = 0; i < ignoredUsers.length; i++) {
    if (ignoredUsers[i] === message.author.id) {
      console.log(`The User (${message.author.username}) with id (${message.author.id}) will be ignored. Change the ignored users list.`);
      return true;
    }
  }
  return false;
}

export function ignoreUserId(id: string): boolean {
  if (newBotConfigurationObject.ignoredUsers.length === 0) return false;
  for (let i = 0; i < newBotConfigurationObject.ignoredUsers.length; i++) {
    if (newBotConfigurationObject.ignoredUsers[i] === id) {
      console.log(`The User with id (${id}) will be ignored. Change the ignored users list.`);
      return true;
    }
  }
  return false;
}

export function ignoreGuild(message: Message, ignoredGuilds: string[]): boolean {
  if (ignoredGuilds.length === 0) return false;
  for (let i = 0; i < ignoredGuilds.length; i++) {
    if (ignoredGuilds[i] === message.guild.id) {
      console.log(`The Guild (${message.guild.name}) with id (${message.guild.id}) will be ignored. Change the ignored guilds list.`);
      return true;
    }
  }
  message.channel.send('```Si quieres utilizar todo el poder del Bonobot en tu servidor comunicate con los desarrolladores.```');
  return false;
}

export function ignoreRoles(message: Message, ignoredRoles: string[]): boolean {
  if (ignoredRoles.length === 0) return false;
  return !message.member.roles.cache.some((role) => ignoredRoles.includes(role.id));
}

export async function memberRolesHaveCommandPermission(command: string, message: Message): Promise<boolean> {
  const guildId = message.guild.id;
  const query: RoleData = { guild: guildId };

  let guildRolesInDb = await roleCases.findByQuery(query);
  //console.log('Guild Roles in db, ', guildRolesInDb);
  guildRolesInDb = guildRolesInDb.filter((roleInDb) => roleInDb.commandsCount > 0);

  if (guildRolesInDb.length === 0) {
    const messageString = `⚠️ Ningún rol de este servidor tiene permisos para utilizar el comando ${command}`;
    (await message.channel.send('```' + messageString + '```')).delete({ timeout: 10000 });
    return false;
  }

  const memberHasPermissions = message.member.roles.cache.map((role) => {
    for (let n = 0; n < guildRolesInDb.length; n++) {
      const currentGuildRole = guildRolesInDb[n];
      if (role.id === currentGuildRole.id) {
        for (let i = 0; i < currentGuildRole.commands.length; i++) {
          const currentCommandInRole = guildRolesInDb[n].commands[i];
          if (currentCommandInRole === command) return true;
        }
      }
    }
  });

  if (memberHasPermissions.indexOf(true) !== -1) return true;
  else {
    const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}. No tienes permisos para utilizar el comando ${command}`;
    (await message.channel.send('```' + messageString + '```')).delete({ timeout: 10000 });

    return false;
  }
}
