import { RoleEntity } from '../entities';
import { RoleData } from '../interfaces';
import { mongoDbAdapter } from '../utils/mongoDbAdapter';
import { GuildUseCases } from './';

export class RoleUseCases {
  private guildUseCase = new GuildUseCases();
  private adaptador = new mongoDbAdapter();
  private collection = 'roles';

  public async add(data: RoleData | Array<RoleData>): Promise<RoleData | RoleData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Role with id ${data.id} already exist on database`);

        const newRoleData = new RoleEntity(data).data();
        newRoleData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const guildExists = await this.adaptador.findById({ id: newRoleData.guild }, 'guilds');

        if (!guildExists) throw new Error(`Guild id of role with id ${data.id} do not exists on database`);
        const roleInserted: RoleData = await this.adaptador.insertOne({ id: newRoleData.id, ...newRoleData }, this.collection);

        guildExists.roles.push(roleInserted.id);
        await this.guildUseCase.editRoles(guildExists);

        return roleInserted;
      } else {
        const newRolesData: RoleData[] = [];
        let sharedGuildId: string;

        for (let i = 0; i < data.length; i++) {
          const currentGuildId = data[i].guild;
          sharedGuildId = currentGuildId;
          if (i < data.length - 1) {
            const nextGuildId = data[i + 1].guild;
            //console.log(`Comparing ids: ${currentGuildId} -- ${nextGuildId}`);
            if (currentGuildId !== nextGuildId) throw new Error(`Posting multiple roles is only allowed if they have the same guild id.`);
          }
        }

        const guildExists = await this.adaptador.findById({ id: sharedGuildId }, 'guilds');
        if (!guildExists) throw new Error(`Guild id do not exists on database. You can only register roles with an existing guild id`);

        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Role with id ${data[n].id} already exist on database`);

          const newRoleData = new RoleEntity(data[n]).data();
          newRoleData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newRolesData.push(newRoleData);
        }

        const rolesInserted = await this.adaptador.insertMany(newRolesData, this.collection);

        if (guildExists.roles.length > 0) {
          const rolesIds = [];
          for (let x = 0; x < rolesInserted.length; x++) rolesIds.push(rolesInserted[x].id);
          let mergedIds = guildExists.roles.concat(rolesIds);
          mergedIds = mergedIds.filter((item: any, index: any) => mergedIds.indexOf(item) == index);
          guildExists.roles = mergedIds;
        } else {
          for (let x = 0; x < rolesInserted.length; x++) {
            console.log('check inserted', rolesInserted[x]);
            guildExists.roles.push(rolesInserted[x].id);
          }
        }

        await this.guildUseCase.editRoles(guildExists);

        return rolesInserted as RoleData[];
      }
    } catch (exception) {
      console.log('Error adding role  (add Role): ', exception.message);
      throw new Error(`Error adding role (add Role): ${exception.message}`);
    }
  }

  public async edit(data: RoleData | Array<RoleData>): Promise<RoleData | RoleData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: RoleData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Role with id ${data[n].id} does not exist on database, please try again.`);

        const mergeWithOldData = { ...idExist, ...data[n] };
        const newRoleData = new RoleEntity(mergeWithOldData).data();
        newRoleData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
        const insertOne = await this.adaptador.updateOne({ id: newRoleData.id, ...newRoleData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as RoleData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Role): ', exception.message);
      throw new Error(`Error updating the database (edit Role): ${exception.message}`);
    }
  }

  public async list(): Promise<RoleData[]> {
    try {
      const roles = await this.adaptador.findAll(this.collection);
      if (roles.length <= 0) {
        throw new Error('No roles found on database.');
      }
      return roles as RoleData[];
    } catch (exception) {
      console.log('Error listing the database  (list Role): ', exception.message);
      throw new Error(`Error listing the database (list Role): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<RoleData[]> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Role not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding role (findById Role): ', exception.message);
      throw new Error(`Error finding role: ${exception.message}`);
    }
  }

  public async findByQuery(query: RoleData): Promise<RoleData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Role not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding role (findByQuery Role): ', exception.message);
      throw new Error(`Error finding role: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<RoleData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Role not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding role (findByName Role): ', exception.message);
      throw new Error(`Error finding role: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const roleForDelet: RoleData = await this.adaptador.findById({ id: id }, this.collection);
      if (!roleForDelet) return deleteNothing();
      const deletedItem = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Role deleted: ', deletedItem);

      const guildExists = await this.adaptador.findById({ id: roleForDelet.guild }, 'guilds');

      if (guildExists) {
        const newGuildList = guildExists.roles.filter((categorie: string) => categorie !== roleForDelet.id);
        guildExists.roles = newGuildList;
        await this.guildUseCase.editRoles(guildExists);
      }
      return deletedItem;
    } catch (exception) {
      console.log('Error deleting role (deleteById Role): ', exception.message);
      throw new Error(`Error deleting role.`);
    }
  }
}
