import { arraysEqual } from '../utils';
import { GuildEntity } from '../entities';
import { GuildData } from '../interfaces';
import { mongoDbAdapter } from '../utils/mongoDbAdapter';

export class GuildUseCases {
  private adaptador = new mongoDbAdapter();
  private collection = 'guilds';

  public async add(data: GuildData | Array<GuildData>): Promise<GuildData | GuildData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Guild with id ${data.id} already exist on database`);

        const newGuildData = new GuildEntity(data).data();
        newGuildData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const guildInserted = await this.adaptador.insertOne({ id: newGuildData.id, ...newGuildData }, this.collection);
        return guildInserted as GuildData;
      } else {
        const newGuildsData: GuildData[] = [];
        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Guild with id ${data[n].id} already exist on database`);

          const newGuildData = new GuildEntity(data[n]).data();
          newGuildData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newGuildsData.push(newGuildData);
        }
        const guildsInserted = await this.adaptador.insertMany(newGuildsData, this.collection);
        return guildsInserted as GuildData[];
      }
    } catch (exception) {
      console.log('Error adding guild  (add Guild): ', exception.message);
      throw new Error(`Error adding guild (add Guild): ${exception.message}`);
    }
  }

  public async edit(data: GuildData | Array<GuildData>): Promise<GuildData | GuildData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: GuildData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Guild with id ${data[n].id} do not exist on database, please try again.`);

        if (!arraysEqual(data[n].roles, idExist.roles)) throw new Error(`Roles attribute can not be modified on the guild API.`);
        if (!arraysEqual(data[n].categories, idExist.categories)) throw new Error(`Categories attribute can not be modified on the guild API.`);

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newGuildData = new GuildEntity(mergedWithOldData).data();
        newGuildData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newGuildData.id, ...newGuildData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as GuildData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Guild): ', exception.message);
      throw new Error(`Error updating the database (edit Guild): ${exception.message}`);
    }
  }

  public async editRoles(data: GuildData | Array<GuildData>): Promise<GuildData | GuildData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: GuildData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Guild with id ${data[n].id} do not exist on database, please try again.`);

        //console.log(`Test roles from data..`, data[n].roles)
        //console.log(`Test roles from idexist..`, idExist.roles)
        if (!arraysEqual(data[n].categories, idExist.categories)) throw new Error(`Categories attribute on guilds can only be modified on the categories API.`);

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newGuildData = new GuildEntity(mergedWithOldData).data();
        newGuildData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newGuildData.id, ...newGuildData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as GuildData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Guild): ', exception.message);
      throw new Error(`Error updating the database (edit Guild): ${exception.message}`);
    }
  }

  public async editCategories(data: GuildData | Array<GuildData>): Promise<GuildData | GuildData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: GuildData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Guild with id ${data[n].id} do not exist on database, please try again.`);

        if (!arraysEqual(data[n].roles, idExist.roles)) throw new Error(`Roles attribute on guilds can only be modified on the roles API.`);

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newGuildData = new GuildEntity(mergedWithOldData).data();
        newGuildData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newGuildData.id, ...newGuildData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as GuildData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Guild): ', exception.message);
      throw new Error(`Error updating the database (edit Guild): ${exception.message}`);
    }
  }

  public async list(): Promise<GuildData[]> {
    try {
      const guilds = await this.adaptador.findAll(this.collection);
      if (guilds.length <= 0) {
        throw new Error('No guilds found on database.');
      }
      return guilds as GuildData[];
    } catch (exception) {
      console.log('Error listing the database  (list Guild): ', exception.message);
      throw new Error(`Error listing the database (list Guild): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<GuildData> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Guild not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding guild (findById Guild): ', exception.message);
      throw new Error(`Error finding guild: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<GuildData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Guild not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding guild (findByName Guild): ', exception.message);
      throw new Error(`Error finding guild: ${exception.message}`);
    }
  }

  public async findByQuery(query: GuildData): Promise<GuildData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Guild not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding guild (findByName Guild): ', exception.message);
      throw new Error(`Error finding guild: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const guildForDelete: GuildData = await this.adaptador.findById({ id: id }, this.collection);
      if (!guildForDelete) return deleteNothing();

      if (guildForDelete.categories.length > 0) throw new Error('You cant delete a guild with categories. Please delete all categories first.');
      if (guildForDelete.roles.length > 0) throw new Error('You cant delete a guild with roles. Please delete all roles first.');

      const deletedGuild = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Guild deleted. Do not forget to remove or edit de roles and the categories for this guild: ', deletedGuild);
      return deletedGuild;
    } catch (exception) {
      console.log('Error deleting guild (deleteById Guild): ', exception.message);
      throw new Error(`Error deleting guild. ${exception.message}`);
    }
  }
}
