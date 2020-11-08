import * as Discord from 'discord.js';

import { MigBotCommand } from '../botApi';
import { validateCommandRestrictions } from '../utils/botValidation';

export default class Cleanroles implements MigBotCommand {
  private readonly _command = 'cleanroles';

  private currentEmbedMessage: Discord.Message;

  constructor() {
    console.log('Cleanroles Command Instantiated');
  }

  help(): string {
    return 'Este comando es el sitema de tickets de la comunidad bonóbica';
  }

  isThisCommand(command: string): boolean {
    return command === this._command;
  }

  public async runCommand(
    args: string[],
    msgObject: Discord.Message,
    client: Discord.Client
  ) {
    console.log('cleanroles executed');

    if (!validateCommandRestrictions(this._command, msgObject)) {
      return;
    }
    console.log('clean roles called');

    /*
        function getRoles( rolesList: Discord.RoleManager | Discord.GuildMemberRoleManager ){
            let rolesForServer:any = [];

            rolesList.cache.forEach( role => {
                let roleFound = {
                    roleName: role.name,
                    //roleId: role.id,
                    //rolePermissions:JSON.stringify(role.permissions.toArray())
                }
    
                //rolesForServer.push(roleFound);
                rolesForServer.push(role.name);
    
            });

            return rolesForServer;

        }
      
   
        var members = await msgObject.guild.members.fetch()

        let membersFromServer:any = []

        members.forEach(member => {

            if(!member.roles.cache.has('684255900323938324')){
                return;
            }

            let memberFound = {
                //id: member.id,
                username: member.user.username,
                roles:JSON.stringify( getRoles(member.roles))
            }

            if(member.roles.cache.has('684255900323938324') && member.roles.cache.has('710650474877157397') ){
                console.log(`(Eliminar 1)  chimp  + bonobo  ${JSON.stringify( getRoles(member.roles))}`);
                //member.roles.remove(['742860718650425395','684255900323938324']);
                //member.roles.remove('684255900323938324');

                return;
            }

            /*
            else if(!member.roles.cache.has('742860718650425395') && member.roles.cache.has('710650474877157397') ){
                console.log(`(Eliminar 0) Bonobo  ${JSON.stringify( getRoles(member.roles))}`);
                //member.roles.remove('742860718650425395');
                return;
            }

          
            
            
            
            membersFromServer.push(memberFound)
        })

        console.log(membersFromServer)

        */
  }
}

