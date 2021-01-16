import { Message, MessageEmbed, TextChannel } from 'discord.js';
import { CommandData, CommandHealth, ArgumentData, CommandArgs } from '../interfaces';
import { CommandUseCases } from '../usecases';
import { isNormalInteger } from '../utils';

export class Command {
  protected data: CommandData;
  protected useCases = new CommandUseCases();
  protected commandHealth: CommandHealth = {
    started: false,
    hasData: false,
    lastTimeUsed: {
      by: {
        id: '',
        username: '',
        nickname: '',
        discriminator: '',
      },
      in: {
        guildId: '',
        guildName: '',
        channelId: '',
        channelName: '',
      },
      at: null,
    },
  };

  public isThisCommand(command: string): boolean {
    return command === this.data.prefix;
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    //console.log('Original runCommand implementation');
  }

  protected collectCommandArguments(content: string, commandData: CommandData): ArgumentData[] {
    const commandAsArgumentDataArray: ArgumentData = this.findCommandArgumentDataOnString(content, commandData);

    const validatedCommand = this.validateCommandParams(content, commandAsArgumentDataArray);
    let commandArgumentData = [validatedCommand];
    if (commandArgumentData[0].error) return commandArgumentData;
    const indexedArgs = this.indexingArgumentsOnString(content, commandData.args);
    const sortedArgs = this.sortingIndexedArguments(indexedArgs);
    commandArgumentData = commandArgumentData.concat(this.getValidatedArgumentDataOnContent(content, sortedArgs));
    return commandArgumentData;
  }

  protected helpRequested(commandData: CommandData): MessageEmbed {
    const embedData = commandData.helpEmbedData;

    const generatedFields = this.generateHelpFields(commandData.args);

    return new MessageEmbed({
      title: `${embedData.title} ${commandData.prefix}?`,
      description: `${commandData.description}\n\n\u200B`,
      url: embedData.url,
      color: embedData.color,
      author: {
        name: embedData.author.name,
        url: embedData.author.url,
        icon_url: embedData.author.icon_url,
      },
      thumbnail: {
        url: embedData.thumbnail.url,
      },
      fields: generatedFields,
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();
  }

  protected healthRequested(commandData: CommandData): MessageEmbed {
    const embedData = commandData.healthEmbedData;

    const health = JSON.stringify(this.commandHealth, null, 2);
    return new MessageEmbed({
      title: `${embedData.title} ${commandData.prefix}`,
      description: `${'```json\n' + health + '```'}`,
      url: embedData.url,
      color: embedData.color,
      author: {
        name: embedData.author.name,
        url: embedData.author.url,
        icon_url: embedData.author.icon_url,
      },
      thumbnail: {
        url: embedData.thumbnail.url,
      },
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();
  }

  protected lastTimeUsed(message: Message): CommandHealth['lastTimeUsed'] {
    const by = {
      id: message.author.id,
      username: message.author.username,
      nickname: message.member.nickname,
      discriminator: message.author.discriminator,
    };

    const inside = {
      guildId: message.guild.id,
      guildName: message.guild.name,
      channelId: message.channel.id,
      channelName: (message.channel as TextChannel).name,
    };

    return {
      by: by,
      in: inside,
      at: new Date(Date.now()).toUTCString(),
    };
  }

  protected async getCommandData(name: string): Promise<CommandData> {
    try {
      const commandData = await this.useCases.findByName(name);
      if (commandData.length === 0) this.commandHealth.hasData = false;
      else this.commandHealth.hasData = true;
      return commandData[0];
    } catch (exception) {
      console.info(`Exception getting command ${name} data`);
    }
  }

  protected async sendTextMessage(text: string, channel: Message['channel']): Promise<void> {
    try {
      channel.send('```' + text + '```');
    } catch (exception) {
      console.info(`BONOBOT ERROR AT COMMAND (${this.data.prefix}). `, exception.message);
    }
  }

  protected async sendTemporalTextMessage(text: string, channel: Message['channel'], timeout: number): Promise<void> {
    try {
      (await channel.send('```' + text + '```')).delete({ timeout: timeout });
    } catch (exception) {
      console.info(`BONOBOT ERROR AT COMMAND (${this.data.prefix}). `, exception.message);
    }
  }

  private generateHelpFields(commandArgs: CommandArgs[]) {
    const fields = [];
    for (let i = 0; i < commandArgs.length; i++) {
      const newField = {
        name: `${commandArgs[i].name}`,
        value: `*${commandArgs[i].description}*\n\u200B`,
        inline: false,
      };
      fields.push(newField);
    }
    return fields;
  }

  protected findItemsInsideSymbols(string: string, firstSymbol: string, secondSymbol: string): string[] {
    let argumentContent = string;
    let firstBracketsIndex = argumentContent.indexOf(firstSymbol);
    let secondBracketsIndex = argumentContent.indexOf(secondSymbol);
    const itemsWithBrackets: string[] = [];
    const itemsWithoutBrackets: string[] = [];

    while (firstBracketsIndex !== -1 && secondBracketsIndex !== -1 && firstBracketsIndex < secondBracketsIndex) {
      const contentWithBrackets = argumentContent.substring(firstBracketsIndex, secondBracketsIndex + 1);
      const contentWithoutBrackets = argumentContent.substring(firstBracketsIndex + 1, secondBracketsIndex);
      itemsWithBrackets.push(contentWithBrackets);
      itemsWithoutBrackets.push(contentWithoutBrackets);
      argumentContent = argumentContent.replace(contentWithBrackets, '');
      firstBracketsIndex = argumentContent.indexOf(firstSymbol);
      secondBracketsIndex = argumentContent.indexOf(secondSymbol);
    }
    return itemsWithoutBrackets;
  }

  private findCommandArgumentDataOnString(contentString: string, commandData: CommandData): ArgumentData {
    const commandAsArgumentDataArray: ArgumentData = {
      prefix: commandData.prefix,
      type: commandData.type,
      params: [],
      error: false,
      errorMessage: 'No errors found yet',
      argsContent: '',
      stringIndex: 0,
    };

    if (commandData.args.length > 0) {
      for (let i = 0; i < commandData.args.length; i++) {
        const argIndexOnString = contentString.indexOf(commandData.args[i].prefix);

        if (argIndexOnString === -1) {
          continue;
        }

        commandAsArgumentDataArray.params.push(commandData.args[i].prefix);
      }

      return commandAsArgumentDataArray;
    }
  }

  private indexingArgumentsOnString(contentString: string, args: CommandArgs[]): ArgumentData[] {
    let argsFoundInContentString: ArgumentData[] = [];
    if (args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        const argIndexOnString = contentString.indexOf(args[i].prefix);

        if (argIndexOnString === -1) {
          continue;
        }
        if (args[i].args.length > 0) argsFoundInContentString = argsFoundInContentString.concat(this.indexingArgumentsOnString(contentString, args[i].args));
        argsFoundInContentString.push({
          stringIndex: argIndexOnString,
          prefix: args[i].prefix,
          type: args[i].type,
          error: false,
          errorMessage: 'No errors detected yet',
          params: [],
          argsContent: '',
        });
      }
    }
    return argsFoundInContentString;
  }

  private sortingIndexedArguments(indexedArgs: ArgumentData[]): ArgumentData[] {
    const sorted = indexedArgs.sort((argsA, argsB) => argsA.stringIndex - argsB.stringIndex);
    return sorted;
  }

  private setArgumentError(arg: ArgumentData, message: string): ArgumentData {
    arg.error = true;
    arg.errorMessage = message;
    return arg;
  }

  private validateCommandParams(stringContent: string, command: ArgumentData): ArgumentData {
    if (command.type === 'simple') {
      if (command.params.length !== 0) {
        const errorMesage = `El comando ${command.prefix} no debe contener parámetros.`;
        return this.setArgumentError(command, errorMesage);
      }
    }

    if (command.type === 'singleArg') {
      if (command.params.length > 1) {
        const errorMesage = `El comando ${command.prefix} debe contener solo un parámetro de texto seguido de un espacio.`;
        return this.setArgumentError(command, errorMesage);
      }
    }

    return command;
  }

  private getValidatedArgumentDataOnContent(stringContent: string, args: ArgumentData[]): ArgumentData[] {
    const validatedArgumentDataArray: ArgumentData[] = [];
    for (let i = 0; i < args.length; i++) {
      const currentStringIndex = stringContent.indexOf(args[i].prefix);

      let nextStringIndex: number;
      if (i === args.length - 1) nextStringIndex = stringContent.length;
      else nextStringIndex = stringContent.indexOf(args[i + 1].prefix);

      let argContent = stringContent.substring(currentStringIndex, nextStringIndex);
      argContent = argContent.replace(args[i].prefix, '').trim();

      let params = argContent.split(' ');
      const paramsWithoutSpaces = [];

      for (let n = 0; n < params.length; n++) if (params[n] !== '') paramsWithoutSpaces.push(params[n]);

      params = paramsWithoutSpaces;

      args[i].argsContent = argContent;

      if (args[i].type === 'simple') {
        if (argContent.length !== 0) {
          const errorMesage = `El argumento ${args[i].prefix} no debe contener parámetros.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }
      }

      if (args[i].type === 'number') {
        if (argContent.length === 0) {
          const errorMesage = `El argumento ${args[i].prefix} debe contener un parámetro numérico seguido de un espacio.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }

        if (params.length > 1) {
          const errorMesage = `El argumento ${args[i].prefix} no puede contener más de un parámetro.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }

        const numberParam = params[0];
        if (!isNormalInteger(numberParam)) {
          const errorMesage = `El parámetro de argumento ${args[i].prefix} solo acepta valores numéricos enteros.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }
      }

      if (args[i].type === 'singleArg') {
        if (argContent.length === 0) {
          const errorMesage = `El argumento ${args[i].prefix} debe contener un parámetro de texto seguido de un espacio.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }

        if (params.length > 1) {
          const errorMesage = `El argumento ${args[i].prefix} debe contener solo un parámetro de texto seguido de un espacio.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }
      }

      if (args[i].type === 'multiple') {
        if (argContent.length === 0) {
          const errorMesage = `El argumento ${args[i].prefix} debe contener uno o más parámetros de texto separados por espacios.`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }
      }

      if (args[i].type === 'items') {
        if (argContent.length === 0) {
          const errorMesage = `El argumento ${args[i].prefix} espera una serie de elementos. ej. [Elemento 1] [Elemento 2]...`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }
        const curlyBracketsContent = this.findItemsInsideSymbols(argContent, '{', '}').join(' ');
        if (curlyBracketsContent.length > 0) args[i].params.push(curlyBracketsContent);

        const boxBracketsItems = this.findItemsInsideSymbols(argContent, '[', ']');

        if (boxBracketsItems.length === 0) {
          const errorMesage = `El argumento ${args[i].prefix} espera una serie de elementos. ej. [Elemento 1] [Elemento 2] [Elemento 3] [Elemento 4]...`;
          //console.info(errorMesage);
          validatedArgumentDataArray.push(this.setArgumentError(args[i], errorMesage));
          return validatedArgumentDataArray;
        }

        if (args[i].params.length === 0) args[i].params = boxBracketsItems;
        else if (args[i].params.length === 1) args[i].params = args[i].params.concat(boxBracketsItems);
        validatedArgumentDataArray.push(args[i]);
        continue;
      }

      args[i].params = params;
      validatedArgumentDataArray.push(args[i]);
    }

    //console.log(args);
    return args;
  }
}
