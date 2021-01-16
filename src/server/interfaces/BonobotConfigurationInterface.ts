import { Guild } from 'discord.js';
import { GuildData } from '.';
import { Command } from '../commands';

export interface BonobotConfiguration {
  prefix: string;
  mainGuildId: string;
  mainGuild?: Guild;
  mainGuildData?: GuildData;
  commands?: Command[];
  ignoredUsers?: string[];
  ignoredGuilds?: string[];
  ignoredRoles?: string[];
}
