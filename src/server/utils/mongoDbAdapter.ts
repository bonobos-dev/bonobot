import { Database } from './database';

export class mongoDbAdapter {
  private DB: Database;

  public constructor() {
    this.DB = new Database('mongodb');
  }

  public async findAll(collection: string): Promise<any[]> {
    try {
      const db = await this.DB.initDb();
      const query = {};
      const result = db.collection(collection).find(query);
      return (await result.toArray()).map(({ _id: id, ...found }) => ({
        id,
        ...found,
      }));
    } catch (error) {
      throw new Error(`Error finding all on ${collection}: ${error}`);
    }
  }

  public async findById({ id: _id }: { id: string }, collection: string): Promise<any> {
    try {
      const db = await this.DB.initDb();
      const result = db.collection(collection).find({ _id });
      const found = await result.toArray();
      if (found.length === 0) {
        return null;
      }
      const { _id: id, ...info } = found[0];
      return { id, ...info };
    } catch (error) {
      throw new Error(`Error finding id ${_id} on ${collection} collection: ${error}`);
    }
  }

  public async findByName({ name: name }: { name: string }, collection: string): Promise<any> {
    try {
      const db = await this.DB.initDb();
      const result = db.collection(collection).find({ name });
      const found = await result.toArray();
      if (found.length === 0) {
        return null;
      }
      const { _id: id, ...info } = found[0];
      return { id, ...info };
    } catch (error) {
      throw new Error(`Error finding name ${name} on ${collection} collection: ${error}`);
    }
  }

  public async findMany({ ...query }: { [x: string]: any }, collection: string): Promise<any> {
    try {
      const db = await this.DB.initDb();
      const result = db.collection(collection).find({ ...query });
      return (await result.toArray()).map(({ _id: id, ...found }: any) => ({
        id,
        ...found,
      }));
    } catch (error) {
      throw new Error(`Error finding ${query} on ${collection} collection: ${error}`);
    }
  }

  public async insertOne({ id: _id, ...data }: { id: string; [x: string]: any }, collection: string): Promise<any> {
    try {
      const db = await this.DB.initDb();
      const result = await db.collection(collection).insertOne({ _id, ...data });
      const { _id: id, ...insertedInfo } = result.ops[0];
      return { id, ...insertedInfo };
    } catch (error) {
      throw new Error(`Error inserting ${_id} on ${collection} collection: ${error}`);
    }
  }

  public async insertMany(data: any[], collection: string): Promise<any> {
    try {
      const mongoData: any = [];
      for (let n = 0; n < data.length; n++) {
        const currentData = data[n];
        const { id: _id, ...changedData } = currentData;
        mongoData.push({ _id, ...changedData });
      }

      const db = await this.DB.initDb();
      const result = await db.collection(collection).insertMany(mongoData);

      const mongoInsertedDataReturn: any = [];

      for (let n = 0; n < result.ops.length; n++) {
        const currentData = result.ops[n];
        const { _id: id, ...changedData } = currentData;
        mongoInsertedDataReturn.push({ id, ...changedData });
      }
      //const { _id: id, ...insertedInfo } = result.ops[0]
      return mongoInsertedDataReturn;
    } catch (error) {
      throw new Error(`Error inserting items on ${collection} collection: ${error}`);
    }
  }

  public async updateOne({ id: _id, ...data }: { id: string }, collection: string): Promise<any> {
    try {
      const db = await this.DB.initDb();

      const result = await db.collection(collection).updateOne({ _id: _id }, { $set: { ...data } }, { upsert: true });
      return result.modifiedCount > 0 ? { id: _id, ...data } : null;
    } catch (error) {
      throw new Error(`Error updating ${_id} on ${collection} collection: ${error}`);
    }
  }

  public async updateAll(data: any[], collection: string): Promise<any> {
    try {
      const db = await this.DB.initDb();

      const updateQueryObject: any[] = [];

      for (let i = 0; i < data.length; i++) {
        updateQueryObject.push({ $set: { ...data[i] } });
      }

      const result = await db.collection(collection).updateMany({}, updateQueryObject, { upsert: true });
      return result.modifiedCount > 0 ? data : null;
    } catch (error) {
      throw new Error(`Error updating items on ${collection} collection: ${error}`);
    }
  }

  public async removeById({ id: _id }: { id: string }, collection: string): Promise<number> {
    try {
      const db = await this.DB.initDb();
      const result = await db.collection(collection).deleteOne({ _id });
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error removing ${_id} on ${collection} collection: ${error}`);
    }
  }

  public async removeByQuery({ ...query }: { [x: string]: any }, collection: string): Promise<number> {
    try {
      const db = await this.DB.initDb();
      const newQuery = { ...query };
      const result = await db.collection(collection).deleteMany(newQuery);
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error removing ${query} on ${collection} collection: ${error}`);
    }
  }

  public async findByQuery({ ...query }: { [x: string]: any }, collection: string): Promise<any[]> {
    try {
      const db = await this.DB.initDb();
      const newQuery = { ...query };
      const result = db.collection(collection).find(newQuery);
      return (await result.toArray()).map(({ _id: id, ...found }: any) => ({
        id,
        ...found,
      }));
    } catch (error) {
      throw new Error(`Error finding ${query} on ${collection} collection: ${error}`);
    }
  }
}
