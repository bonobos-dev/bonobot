import { RoleData, RoleType } from '../interfaces';
import { Id, isValidColor } from '../utils';

export class RoleEntity {
  private roleData: RoleData;

  constructor(data: RoleData) {
    this.validateData(data);
    this.roleData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: RoleData): void {
    if (!data.id) throw new Error('A role id must be provided. It must be the discord role id.');
    if (!data.name) throw new Error('A role name must be provided.');
    if (!data.guild) throw new Error('A role guild must be provided.');
    if (!data.type) throw new Error('A role type must be provided.');
    if (!data.color) throw new Error('A role color must be provided.');
    if (!isValidColor(data.color)) throw new Error('A role color must be hexadecimal string.');
    if (data.active === null || data.active === undefined) throw new Error('Active attribute must be specified.');
    if (data.selectable === null || data.selectable === undefined) throw new Error('Selectable attribute must be specified.');
    if (data.selectable && !data.emoji) throw new Error('A emoji must be provided for selectable roles.');
    if (!RoleType[data.type]) throw new Error('Role type provided do not exist.');
    if (!data.description) throw new Error('A role description must be provided.');
    if (!data.commands) throw new Error('Role commands attribute must be provided even empty.');
    data.commandsCount = data.commands.length;
  }

  public data(): RoleData {
    return this.roleData;
  }
}
