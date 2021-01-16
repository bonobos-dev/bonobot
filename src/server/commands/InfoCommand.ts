import { Message, MessageEmbed, MessageEmbedOptions } from 'discord.js';

import { ArgumentData, RuleData } from '../interfaces';
import { memberRolesHaveCommandPermission } from '../utils';
import { RuleUseCases } from '../usecases';

import { Command } from '.';

interface InfoStaticData {
  embedData?: {
    iniciativa?: MessageEmbedOptions;
    reglas?: MessageEmbedOptions;
    invitación?: MessageEmbedOptions;
  };
}

export class InfoCommand extends Command {
  private readonly commandName = 'Información';
  private ruleData: RuleData[];
  private ruleUseCases = new RuleUseCases();
  private staticData: InfoStaticData = {};

  private currentEmbedMessage: Message;

  constructor() {
    super();
    //console.log('Info Command Instantiated');
    this.start();
  }

  private async start(): Promise<void> {
    try {
      this.data = await this.getCommandData(this.commandName);
      this.commandHealth.started = true;
      if (this.data.staticData.aviable && this.data.staticData.data) this.staticData = this.data.staticData.data;
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (start()). `, exception);
      throw new Error(exception);
    }
  }

  public async runCommand(commandContent: string, message: Message): Promise<void> {
    try {
      if (!(await memberRolesHaveCommandPermission(this.data.prefix, message))) return;
      this.data = await this.getCommandData(this.commandName);

      if (!this.commandHealth.hasData) {
        this.commandHealth.started = false;

        const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo ejecutar el comando. No encuentro los datos de configuración en la base de datos. Cómunicate con un moderador.`;

        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }

      const argumentData = this.collectCommandArguments(commandContent, this.data);

      for (let n = 0; n < argumentData.length; n++) {
        const argument = argumentData[n];

        if (argument.error) {
          const messageString = `⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, haz utilizado mal el comando. ${argument.errorMessage}`;
          this.sendTemporalTextMessage(messageString, message.channel, 4000);
          return;
        }

        if (argument.prefix === this.data.prefix) {
          if (argument.params.length === 0) {
            await this.argumentHandler(argument, message);
            return;
          } else continue;
        }
        await this.argumentHandler(argument, message);
      }
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (runCommand). `, exception.message);
    }
  }

  private async argumentHandler(argumentData: ArgumentData, message: Message) {
    try {
      if (argumentData.prefix === this.data.prefix) {
        await message.delete();
        const messageString = `Bienvenido ${message.member.nickname ? message.member.nickname : message.author.username} al comando (información). Para mas informacion utiliza el argumento help seguido del comando.`;
        this.sendTemporalTextMessage(messageString, message.channel, 4000);
        return;
      }

      if (argumentData.prefix === 'reglas') {
        await this.executeRulesArgument(message);
      }
    } catch (exception) {
      console.info(`BONOBOT ERROR at command (${this.commandName}) executing (argumentHandler). `, exception);
      throw new Error(exception);
    }
  }

  private async executeRulesArgument(message: Message) {
    await message.delete();
    if (this.data.staticData.aviable && this.data.staticData.data) this.staticData = this.data.staticData.data;
    const ruleDataAdquired = await this.getRulesData(message);
    if (!ruleDataAdquired) {
      const messageString = `⚠️ ⚠️ Lo siento ${message.member.nickname ? message.member.nickname : message.author.username}, no puedo encontrar las reglas dentro de la base de datos.`;
      this.sendTemporalTextMessage(messageString, message.channel, 4000);
      return;
    }

    const init = this.generateEmbedInitiative(this.staticData);
    const rules = this.generateEmbedRules(this.staticData, this.ruleData);
    const invite = this.generateEmbedInvite(this.staticData);

    await message.channel.send(init);
    await message.channel.send(rules);
    await message.channel.send(invite);

    return;
  }

  private async getRulesData(message: Message): Promise<boolean> {
    const guildRulesInDb = await this.ruleUseCases.findByQuery({ guild: message.guild.id });
    if (guildRulesInDb.length === 0) return false;
    else {
      this.ruleData = guildRulesInDb;
      //console.log('ROLES FOUND AND SAVED');
      return true;
    }
  }

  private generateEmbedInitiative(staticData: InfoStaticData): MessageEmbed {
    const embedData: MessageEmbedOptions = staticData.embedData.iniciativa;
    const embed = new MessageEmbed(embedData).setTimestamp();
    return embed;
  }

  private generateEmbedInvite(staticData: InfoStaticData): MessageEmbed {
    const embedData: MessageEmbedOptions = staticData.embedData.invitación;
    const embed = new MessageEmbed(embedData).setTimestamp();
    return embed;
  }

  private generateEmbedRules(staticData: InfoStaticData, ruleData: RuleData[]): MessageEmbed {
    const embedData: MessageEmbedOptions = staticData.embedData.reglas;

    const Fields = ruleData.map((rule: RuleData) => {
      //console.log('MAPING ROLE: ', role);

      const name = `\u200B\n**${rule.name}**`;
      const value = '```' + rule.rule + '```';

      return {
        name: name,
        value: value,
        inline: false,
      };
    });

    const embed = new MessageEmbed({
      title: embedData.title,
      color: embedData.color,
      author: {
        name: embedData.author.name,
        url: embedData.author.url,
        icon_url: embedData.author.icon_url,
      },
      thumbnail: {
        url: embedData.thumbnail.url,
      },
      fields: Fields,
      image: embedData.image,
      footer: {
        icon_url: embedData.footer.icon_url,
        text: embedData.footer.text,
      },
    }).setTimestamp();
    return embed;
  }
}
