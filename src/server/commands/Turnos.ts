import {
  MessageAttachment,
  Message,
  MessageEmbed,
  Client,
  ReactionCollector,
  MessageReaction,
} from 'discord.js';
import { MigBotCommand } from '../interfaces/botApi';
import { validateCommandRestrictions } from '../utils/botValidation';
import path from 'path';

export enum turnos_states {
  working = 'working',
  free = ' free',
}

export default class Turnos implements MigBotCommand {
  private readonly _command = 'turnos';

  private users: string[] = ['\u200B'];
  private currentUser: string[] = ['\u200B', 'No hay nadie en la lista'];
  private lastUser = 'No hay nadie en la lista';

  private reactionCollector: ReactionCollector;

  private currentEmbedMessage: Message;

  private migdrplogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/migdrp-logo-small-red.png`),
    'migdrp-icon.png'
  );
  private bonobotlogo = new MessageAttachment(
    path.join(__dirname, `../assets/img/bb_dsicordbackcolor.png`),
    'bb-logo.png'
  );

  private state: turnos_states = turnos_states.free;

  private createEmbed(): MessageEmbed {
    const template = new MessageEmbed()
      .attachFiles(this.migdrplogo as any)
      .attachFiles(this.bonobotlogo as any)
      .setColor('#e31452')
      .setAuthor(
        'TAQUILLA BONÓBICA',
        'attachment://migdrp-icon.png',
        'https://www.youtube.com/channel/UCeMZYaa2pooHfDmc3hZabmg'
      )
      .setDescription(
        `

            • Para solicitar su turno   :tickets:

            • Para finalizar su turno   :white_check_mark:

            • Para cancelar su turno    :no_entry:

        `
      )
      .setThumbnail('attachment://bb-logo.png')
      .addFields({ name: '\u200B', value: '\u200B' })
      .addFields(
        {
          name: `Turno actual :microphone2: \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b \u200b `,
          value: this.currentUser,
          inline: true,
        },
        {
          name: `Turnos pendientes :stopwatch:\u200b \u200b \u200b `,
          value: this.users,
          inline: true,
        } /*
            { 
                name: 'Interrupciones :mute: ' , 
                value: this.interrupt, 
                inline: true 
            },*/,
        { name: '\u200B', value: '\u200B', inline: true },
        { name: '\u200B', value: '\u200B', inline: true }
      )
      .setTimestamp()
      .setFooter(
        'Solo se permite un turno activo por persona',
        'attachment://migdrp-icon.png'
      );

    return template;
  }

  constructor() {
    console.log('Turns Command Instantiated');
  }

  public help(): string {
    return 'Este comando es el sitema de tickets de la comunidad bonóbica';
  }

  public isThisCommand(command: string): boolean {
    return command === this._command;
  }

  public async runCommand(args: string[], msgObject: Message, client: Client) {
    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }

    if (this.state === turnos_states.working) {
      msgObject.channel.send(
        'Espérate bónobo, me encuentro ejecutando un comando ahora mismo'
      );
      return;
    }

    this.state = turnos_states.working;

    if (args.length > 0) {
      if (args[0] === 'rollback') {
        if (this.users.length < 2) {
          if (this.lastUser === 'No hay nadie en la lista') {
            //console.log('No rollback exception')

            return;
          } else {
            if (this.currentUser[1] !== 'No hay nadie en la lista') {
              this.users.push(this.currentUser[1]);
            }
            this.currentUser[1] = this.lastUser;
          }
        } else {
          //let result = this.users.splice(1, 0, this.currentUser[1]);
          //console.log('Rollback Result', result);
          this.currentUser[1] = this.lastUser;
        }
      } else if (args[0] === 'skip') {
        if (this.users.length < 2) {
          this.lastUser = this.currentUser[1];
          this.currentUser[1] = 'No hay nadie en la lista';
        } else {
          this.lastUser = this.currentUser[1];
          this.currentUser[1] = this.users[1];
          this.users.splice(1, 1);
        }
      } else {
        msgObject.channel.send('El comando no necesita argumentos');

        return;
      }
    }

    //Deletes the old embed message if exist
    if (this.currentEmbedMessage && !this.currentEmbedMessage.deleted) {
      await this.currentEmbedMessage.delete();
    }

    const TurnsEmbed = this.createEmbed();
    //console.log("Embed msg => ",TurnsEmbed);

    this.currentEmbedMessage = await msgObject.channel.send(TurnsEmbed);
    //console.log("Despues de enviar el embed: ", this.currentEmbedMessage);
    await this.currentEmbedMessage.react('🎟️');
    await this.currentEmbedMessage.react('⛔');
    await this.currentEmbedMessage.react('✅');

    const filter = (reaction: MessageReaction) =>
      reaction.emoji.name === '🎟️' ||
      reaction.emoji.name === '⛔' ||
      reaction.emoji.name === '✅';

    /*
        const result = await ( embedMesage as Message ).awaitReactions(filter, { time: 10000 })
        
        .then(collected => console.log(`Collected ${collected.size} reactions`))
        .catch(console.error);

        */

    this.reactionCollector = this.currentEmbedMessage.createReactionCollector(
      filter
    );

    this.reactionCollector.on('collect', async (reaction, user) => {
      //console.log(`Reaction: `, reaction.emoji.name);
      //console.log('User: ', user.username);

      //When a user reacts a ticket
      if (reaction.emoji.name === '🎟️') {
        console.log(`New ticket for user: ${user.username}`);

        //If user is the current user remove reaction and return
        if (this.currentUser[1] === user.username) {
          msgObject.channel.send(
            `Cuidado ${user.username}, ya estás en la lista! `
          );
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
        } else {
          if (this.users.length < 2) {
            //this.users.push(user.username);
            this.users.push(user.username);
            reaction.message.edit(this.createEmbed());
            this.state = turnos_states.free;
            return;
          } else {
            for (let n = 1; n < this.users.length; n++) {
              if (this.users[n] === user.username) {
                msgObject.channel.send(
                  `Cuidado ${user.username}, ya estás en la lista! `
                );
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
          } else {
            this.currentUser[1] = this.users[1];
            this.users.splice(1, 1);
            reaction.message.edit(this.createEmbed());
            this.state = turnos_states.free;
            return;
          }
        } else {
          const found = this.users.find((value) => {
            if (value === user.username) return true;
            else {
              return false;
            }
          });

          if (found) {
            const result = this.users.filter(
              (value) => value !== user.username
            );
            this.users = result;
            reaction.message.edit(this.createEmbed());
            this.state = turnos_states.free;
            return;
          }

          if (!found) {
            msgObject.channel.send(
              `Cuidado ${user.username}, tienes que estar en la lista para poder salir de ella! `
            );
            this.state = turnos_states.free;
            return;
          }
        }
      }

      if (
        reaction.emoji.name === '✅' &&
        user.username === this.currentUser[1]
      ) {
        console.log(`User ${user.username} end a turn`);

        if (this.users.length < 2) {
          this.lastUser = this.currentUser[1];
          this.currentUser[1] = 'No hay nadie en la lista';
          reaction.message.edit(this.createEmbed());
          this.state = turnos_states.free;
          return;
        } else {
          this.lastUser = this.currentUser[1];
          this.currentUser[1] = this.users[1];
          this.users.splice(1, 1);
          reaction.message.edit(this.createEmbed());
          this.state = turnos_states.free;
          return;
        }
      } else {
        msgObject.channel.send(
          `Solo el bonobo en turno puede finalizar su turno, valga la redundancia ${user.username}! `
        );
        this.state = turnos_states.free;
      }
    });

    this.reactionCollector.on('end', (collected) => {
      console.log(`Collected ${collected.size} items`);
    });

    this.state = turnos_states.free;
  }
}
