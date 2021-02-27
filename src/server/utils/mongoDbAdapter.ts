import { MongoDatabase } from './mongoDb';

export class mongoDbAdapter {
  async findAll(collection: string): Promise<any[]> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const query = {};
      const cursor = db.collection(collection).find(query);
      const result = (await cursor.toArray()).map(({ _id: id, ...found }) => ({
        id,
        ...found,
      }));
      await mogngoDb.closeDbClient();
      return result;
    } catch (error) {
      throw new Error(`Error finding all on ${collection}: ${error}`);
    }
  }

  async findById({ id: _id }: { id: string }, collection: string): Promise<any> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const result = db.collection(collection).find({ _id });
      const found = await result.toArray();
      if (found.length === 0) {
        return null;
      }
      const { _id: id, ...info } = found[0];
      await mogngoDb.closeDbClient();
      return { id, ...info };
    } catch (error) {
      throw new Error(`Error finding id ${_id} on ${collection} collection: ${error}`);
    }
  }

  async findByName({ name: name }: { name: string }, collection: string): Promise<any> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const result = db.collection(collection).find({ name });
      const found = await result.toArray();
      if (found.length === 0) {
        return null;
      }
      const { _id: id, ...info } = found[0];
      await mogngoDb.closeDbClient();
      return { id, ...info };
    } catch (error) {
      throw new Error(`Error finding name ${name} on ${collection} collection: ${error}`);
    }
  }

  async findMany({ ...query }: { [x: string]: any }, collection: string): Promise<any> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const found = db.collection(collection).find({ ...query });
      const result = (await found.toArray()).map(({ _id: id, ...found }: any) => ({
        id,
        ...found,
      }));
      await mogngoDb.closeDbClient();
      return result;
    } catch (error) {
      throw new Error(`Error finding ${query} on ${collection} collection: ${error}`);
    }
  }

  async insertOne({ id: _id, ...data }: { id: string; [x: string]: any }, collection: string): Promise<any> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const result = await db.collection(collection).insertOne({ _id, ...data });
      const { _id: id, ...insertedInfo } = result.ops[0];
      await mogngoDb.closeDbClient();
      return { id, ...insertedInfo };
    } catch (error) {
      throw new Error(`Error inserting ${_id} on ${collection} collection: ${error}`);
    }
  }

  async insertMany(data: any[], collection: string): Promise<any> {
    try {
      const mongoData: any = [];
      for (let n = 0; n < data.length; n++) {
        const currentData = data[n];
        const { id: _id, ...changedData } = currentData;
        mongoData.push({ _id, ...changedData });
      }

      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const result = await db.collection(collection).insertMany(mongoData);

      const mongoInsertedDataReturn: any = [];

      for (let n = 0; n < result.ops.length; n++) {
        const currentData = result.ops[n];
        const { _id: id, ...changedData } = currentData;
        mongoInsertedDataReturn.push({ id, ...changedData });
      }
      await mogngoDb.closeDbClient();
      //const { _id: id, ...insertedInfo } = result.ops[0]
      return mongoInsertedDataReturn;
    } catch (error) {
      throw new Error(`Error inserting items on ${collection} collection: ${error}`);
    }
  }

  async updateOne({ id: _id, ...data }: { id: string }, collection: string): Promise<any> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();

      const result = await db.collection(collection).updateOne({ _id: _id }, { $set: { ...data } }, { upsert: true });
      await mogngoDb.closeDbClient();
      return result.modifiedCount > 0 ? { id: _id, ...data } : null;
    } catch (error) {
      throw new Error(`Error updating ${_id} on ${collection} collection: ${error}`);
    }
  }

  async updateAll(data: any[], collection: string): Promise<any> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();

      const updateQueryObject: any[] = [];

      for (let i = 0; i < data.length; i++) {
        updateQueryObject.push({ $set: { ...data[i] } });
      }

      const result = await db.collection(collection).updateMany({}, updateQueryObject, { upsert: true });
      await mogngoDb.closeDbClient();
      return result.modifiedCount > 0 ? data : null;
    } catch (error) {
      throw new Error(`Error updating items on ${collection} collection: ${error}`);
    }
  }

  async removeById({ id: _id }: { id: string }, collection: string): Promise<number> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const result = await db.collection(collection).deleteOne({ _id });
      await mogngoDb.closeDbClient();
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error removing ${_id} on ${collection} collection: ${error}`);
    }
  }

  public async removeByQuery({ ...query }: { [x: string]: any }, collection: string): Promise<number> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const newQuery = { ...query };
      const result = await db.collection(collection).deleteMany(newQuery);
      await mogngoDb.closeDbClient();
      return result.deletedCount;
    } catch (error) {
      throw new Error(`Error removing ${query} on ${collection} collection: ${error}`);
    }
  }

  public async findByQuery({ ...query }: { [x: string]: any }, collection: string): Promise<any[]> {
    try {
      const mogngoDb = new MongoDatabase('mongodb');
      const db = await mogngoDb.initDb();
      const newQuery = { ...query };
      const found = db.collection(collection).find(newQuery);
      const result = (await found.toArray()).map(({ _id: id, ...found }: any) => ({
        id,
        ...found,
      }));
      await mogngoDb.closeDbClient();
      return result;
    } catch (error) {
      throw new Error(`Error finding ${query} on ${collection} collection: ${error}`);
    }
  }
}
