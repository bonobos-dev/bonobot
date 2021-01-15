import { mongoDbAdapter } from '../utils';
import { CommandEntity } from '../entities';
import { CommandData } from '../interfaces';

export class CommandUseCases {
  private adaptador = new mongoDbAdapter();
  private collection = 'commands';

  public async add(data: CommandData | Array<CommandData>): Promise<CommandData | CommandData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Command with id ${data.id} already exist on database`);

        const nameExist = await this.adaptador.findByName({ name: data.name }, this.collection);
        if (nameExist) throw new Error(`Command with name ${data.name} already exist on database`);

        const newData = new CommandEntity(data).data();
        newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const dataInserted = await this.adaptador.insertOne({ id: newData.id, ...newData }, this.collection);
        return dataInserted as CommandData;
      } else {
        const newItemsData: CommandData[] = [];

        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Command with id ${data[n].id} already exist on database`);

          const nameExist = await this.adaptador.findByName({ name: data[n].name }, this.collection);
          if (nameExist) throw new Error(`Command with name ${data[n].name} already exist on database`);

          const newData = new CommandEntity(data[n]).data();
          newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newItemsData.push(newData);
        }
        const dataInserted = await this.adaptador.insertMany(newItemsData, this.collection);
        return dataInserted as CommandData[];
      }
    } catch (exception) {
      console.log('Error adding command  (add Command): ', exception.message);
      throw new Error(`Error adding command (add Command): ${exception.message}`);
    }
  }

  public async edit(data: CommandData | Array<CommandData>): Promise<CommandData | CommandData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: CommandData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Command with id ${data[n].id} do not exist on database, please try again.`);

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newData = new CommandEntity(mergedWithOldData).data();
        newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newData.id, ...newData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as CommandData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Command): ', exception.message);
      throw new Error(`Error updating the database (edit Command): ${exception.message}`);
    }
  }

  public async list(): Promise<CommandData[]> {
    try {
      const commands = await this.adaptador.findAll(this.collection);
      if (commands.length <= 0) {
        throw new Error('No commands found on database.');
      }
      return commands as CommandData[];
    } catch (exception) {
      console.log('Error listing the dataset (list Command): ', exception.message);
      throw new Error(`Error listing the dataset (list Command): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<CommandData[]> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Command not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding command (findById Command): ', exception.message);
      throw new Error(`Error finding command: ${exception.message}`);
    }
  }

  public async findByQuery(query: CommandData): Promise<CommandData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Command not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding command (findByQuery Command): ', exception.message);
      throw new Error(`Error finding command: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<CommandData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Command not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding command (findByName Command): ', exception.message);
      throw new Error(`Error finding command: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const commandForDelete: CommandData = await this.adaptador.findById({ id: id }, this.collection);
      if (!commandForDelete) return deleteNothing();
      const deletedCommand = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Command deleted: ', deletedCommand);
      return deletedCommand;
    } catch (exception) {
      console.log('Error deleting command (deleteById Command): ', exception.message);
      throw new Error(`Error deleting command.`);
    }
  }
}
