"use strict";
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
const botValidation_1 = require("../utils/botValidation");
class Cleanroles {
    constructor() {
        this._command = "cleanroles";
        console.log('Cleanroles Command Instantiated');
    }
    help() {
        return 'Este comando es el sitema de tickets de la comunidad bonóbica';
    }
    isThisCommand(command) {
        return command === this._command;
    }
    runCommand(args, msgObject, client) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('cleanroles executed');
            if (!botValidation_1.validateCommandRestrictions(this._command, msgObject)) {
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
        });
    }
}
exports.default = Cleanroles;
