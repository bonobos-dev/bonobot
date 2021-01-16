import { GuildData } from '../interfaces';
import { Id } from '../utils';

export class GuildEntity {
  private guildData: GuildData;

  constructor(data: GuildData) {
    this.validateData(data);
    this.guildData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: GuildData): void {
    if (!data.name) throw new Error('A guild name must be provided.');

    if (!data.categories) throw new Error('Categories attribute must be provided even empty.');
    data.categoriesCount = data.categories.length;

    if (!data.roles) throw new Error('Roles attribute must be provided even empty.');
    data.rolesCount = data.roles.length;

    if (!data.masters) throw new Error('Guild masters attribute must be provided even empty.');
    data.mastersCount = data.masters.length;

    if (!data.apiRoles) throw new Error('Guild api roles attribute must be provided even empty.');
    data.apiRolesCount = data.apiRoles.length;
  }

  public data(): GuildData {
    return this.guildData;
  }
}
