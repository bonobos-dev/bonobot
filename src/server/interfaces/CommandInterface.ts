import { Message, Client, MessageEmbedOptions } from 'discord.js';

export enum CommandArgumentType {
  items = 'items',
  number = 'number',
  singleArg = 'singleArg',
  simple = 'simple',
  multiple = 'multiple',
}

export enum CommandType {
  singleArg = 'singleArg',
  simple = 'simple',
  multiple = 'multiple',
}

export interface CommandArgs {
  name: string;
  prefix: string;
  type: string;
  args?: CommandArgs[];
  description: string;
}

export interface CommandData {
  id?: string;
  name: string;
  prefix: string;
  type: string;
  createdAt?: string;
  createdBy?: {
    id?: string;
    username?: string;
    discriminator?: string;
  };
  modifiedAt?: string;
  modifiedBy?: {
    id?: string;
    username?: string;
    discriminator?: string;
  };
  source?: {
    ip?: string;
    browser?: string;
    referrer?: string;
  };
  description?: string;
  args?: CommandArgs[];
  helpEmbedData?: MessageEmbedOptions;
  healthEmbedData?: MessageEmbedOptions;
  staticData?: {
    aviable?: boolean;
    data?: any;
  };
  dynamicData?: {
    aviable?: boolean;
    data?: any;
  };
}

export interface CommandInterface {
  commandInfo?(): CommandData;
  help(): string;
  isThisCommand(command: string): boolean;
  runCommand(args: string[], content: string, msgObject: Message, client: Client): void;
}

export interface CommandHealth {
  started?: boolean;
  hasData?: boolean;
  lastTimeUsed?: {
    by?: {
      id?: string;
      username?: string;
      nickname?: string;
      discriminator?: string;
    };
    in?: {
      guildId?: string;
      guildName?: string;
      channelId?: string;
      channelName?: string;
    };
    at?: string;
  };
}

export interface ArgumentData {
  stringIndex?: number;
  prefix?: string;
  type?: string;
  error?: boolean;
  errorMessage?: string;
  params?: string[];
  argsContent?: string;
}

/*
export interface ArgumentCollectorResponse {
  argDataInMessage?: ArgumentDataInMessage[];
  error?: boolean;
  errorData?: {
    prefix?: string;
    type?: string;
    errorMessage?: string;
    params?: string[];
  };
}
*/
