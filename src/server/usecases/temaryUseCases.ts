import { mongoDbAdapter } from '../utils';
import { TemaryEntity } from '../entities';
import { TemaryData } from '../interfaces';

export class TemaryUseCases {
  private adaptador = new mongoDbAdapter();
  private collection = 'temaries';

  public async add(data: TemaryData | Array<TemaryData>): Promise<TemaryData | TemaryData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Temary with id ${data.id} already exist on database`);

        const newTemaryData = new TemaryEntity(data).data();
        newTemaryData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const temaryInserted = await this.adaptador.insertOne({ id: newTemaryData.id, ...newTemaryData }, this.collection);
        return temaryInserted as TemaryData;
      } else {
        const newTemariesData: TemaryData[] = [];
        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Temary with id ${data[n].id} already exist on database`);

          const newTemaryData = new TemaryEntity(data[n]).data();
          newTemaryData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newTemariesData.push(newTemaryData);
        }
        const temariesInserted = await this.adaptador.insertMany(newTemariesData, this.collection);
        return temariesInserted as TemaryData[];
      }
    } catch (exception) {
      console.log('Error adding temary  (add Temary): ', exception.message);
      throw new Error(`Error adding temary (add Temary): ${exception.message}`);
    }
  }

  public async edit(data: TemaryData | Array<TemaryData>): Promise<TemaryData | TemaryData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: TemaryData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Temary with id ${data[n].id} do not exist on database, please try again.`);

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newTemaryData = new TemaryEntity(mergedWithOldData).data();
        newTemaryData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newTemaryData.id, ...newTemaryData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as TemaryData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Temary): ', exception.message);
      throw new Error(`Error updating the database (edit Temary): ${exception.message}`);
    }
  }

  public async list(): Promise<TemaryData[]> {
    try {
      const temaries = await this.adaptador.findAll(this.collection);
      if (temaries.length <= 0) {
        throw new Error('No temaries found on database.');
      }
      return temaries as TemaryData[];
    } catch (exception) {
      console.log('Error listing the database  (list Temary): ', exception.message);
      throw new Error(`Error listing the database (list Temary): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<TemaryData[]> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Temary not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding temary (findById Temary): ', exception.message);
      throw new Error(`Error finding temary: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<TemaryData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Temary not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding temary (findByName Temary): ', exception.message);
      throw new Error(`Error finding temary: ${exception.message}`);
    }
  }

  public async findByQuery(query: TemaryData): Promise<TemaryData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Temaries not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding temary (findByName Temary): ', exception.message);
      throw new Error(`Error finding temary: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const temaryForDelete: TemaryData = await this.adaptador.findById({ id: id }, this.collection);
      if (!temaryForDelete) return deleteNothing();
      const deletedTemary = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Temary deleted: ', deletedTemary);
      return deletedTemary;
    } catch (exception) {
      console.log('Error deleting temary (deleteById Temary): ', exception.message);
      throw new Error(`Error deleting temary.`);
    }
  }
}
