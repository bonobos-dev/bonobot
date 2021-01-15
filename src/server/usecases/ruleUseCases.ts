import { mongoDbAdapter } from '../utils';
import { RuleEntity } from '../entities';
import { RuleData } from '../interfaces';

export class RuleUseCases {
  private adaptador = new mongoDbAdapter();
  private collection = 'rules';

  public async add(data: RuleData | Array<RuleData>): Promise<RuleData | RuleData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Rule with id ${data.id} already exist on database`);

        const newData = new RuleEntity(data).data();
        newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const dataInserted = await this.adaptador.insertOne({ id: newData.id, ...newData }, this.collection);
        return dataInserted as RuleData;
      } else {
        const newItemsData: RuleData[] = [];

        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Rule with id ${data[n].id} already exist on database`);

          const newData = new RuleEntity(data[n]).data();
          newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newItemsData.push(newData);
        }
        const dataInserted = await this.adaptador.insertMany(newItemsData, this.collection);
        return dataInserted as RuleData[];
      }
    } catch (exception) {
      console.log('Error adding rule  (add Rule): ', exception.message);
      throw new Error(`Error adding rule (add Rule): ${exception.message}`);
    }
  }

  public async edit(data: RuleData | Array<RuleData>): Promise<RuleData | RuleData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: RuleData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Rule with id ${data[n].id} do not exist on database, please try again.`);

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newData = new RuleEntity(mergedWithOldData).data();
        newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newData.id, ...newData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as RuleData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Rule): ', exception.message);
      throw new Error(`Error updating the database (edit Rule): ${exception.message}`);
    }
  }

  public async list(): Promise<RuleData[]> {
    try {
      const rules = await this.adaptador.findAll(this.collection);
      if (rules.length <= 0) {
        throw new Error('No rules found on database.');
      }
      return rules as RuleData[];
    } catch (exception) {
      console.log('Error listing the database  (list Rule): ', exception.message);
      throw new Error(`Error listing the database (list Rule): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<RuleData[]> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Rule not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding rule (findById Rule): ', exception.message);
      throw new Error(`Error finding rule: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<RuleData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Rule not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding rule (findByName Rule): ', exception.message);
      throw new Error(`Error finding rule: ${exception.message}`);
    }
  }

  public async findByQuery(query: RuleData): Promise<RuleData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Rule not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding rule (findByName Rule): ', exception.message);
      throw new Error(`Error finding rule: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const ruleForDelete: RuleData = await this.adaptador.findById({ id: id }, this.collection);
      if (!ruleForDelete) return deleteNothing();
      const deletedRule = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Rule deleted: ', deletedRule);
      return deletedRule;
    } catch (exception) {
      console.log('Error deleting rule (deleteById Rule): ', exception.message);
      throw new Error(`Error deleting rule.`);
    }
  }
}
