import { Id } from './CuidUtil';
import { MigdrpDb } from './MigdrpDb';
import { MongosOptions, MapReduceOptions } from 'mongodb';

export class MigdrpDbAdapter {
  private DB: MigdrpDb;

  public constructor(dbType: string) {
    this.DB = new MigdrpDb(dbType);
  }

  public async findAll(collection: string) {
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

  public async findById({ id: _id }: { id: string }, collection: string) {
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
      throw new Error(
        `Error finding id ${_id} on ${collection} collection: ${error}`
      );
    }
  }

  public async findByName(
    { name: name }: { name: string },
    collection: string
  ) {
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
      throw new Error(
        `Error finding name ${name} on ${collection} collection: ${error}`
      );
    }
  }

  public async findMany({ ...query }, collection: string) {
    try {
      const db = await this.DB.initDb();
      const result = db.collection(collection).find({ ...query });
      return (await result.toArray()).map(({ _id: id, ...found }: any) => ({
        id,
        ...found,
      }));
    } catch (error) {
      throw new Error(
        `Error finding ${query} on ${collection} collection: ${error}`
      );
    }
  }

  public async insertOne(
    { id: _id = Id.makeId(), ...data },
    collection: string
  ) {
    try {
      const db = await this.DB.initDb();
      const result = await db
        .collection(collection)
        .insertOne({ _id, ...data });
      const { _id: id, ...insertedInfo } = result.ops[0];
      return { id, ...insertedInfo };
    } catch (error) {
      throw new Error(
        `Error inserting ${_id} on ${collection} collection: ${error}`
      );
    }
  }

  public async updateOne(
    { id: _id, ...data }: { id: string },
    collection: string
  ) {
    try {
      const db = await this.DB.initDb();
      const result = await db
        .collection(collection)
        .updateOne({ _id }, { $set: { ...data } });
      return result.modifiedCount > 0 ? { id: _id, ...data } : null;
    } catch (error) {
      throw new Error(
        `Error updating ${_id} on ${collection} collection: ${error}`
      );
    }
  }

  public async removeById({ id: _id }: { id: string }, collection: string) {
    try {
      const db = await this.DB.initDb();
      const result = await db.collection(collection).deleteOne({ _id });
      return result.deletedCount;
    } catch (error) {
      throw new Error(
        `Error removing ${_id} on ${collection} collection: ${error}`
      );
    }
  }

  public async removeByQuery({ ...query }, collection: string) {
    try {
      const db = await this.DB.initDb();
      const newQuery = { ...query };
      const result = await db.collection(collection).deleteMany(newQuery);
      return result.deletedCount;
    } catch (error) {
      throw new Error(
        `Error removing ${query} on ${collection} collection: ${error}`
      );
    }
  }

  public async findByQuery({ ...query }, collection: string) {
    try {
      const db = await this.DB.initDb();
      const newQuery = { ...query };
      const result = db.collection(collection).find(newQuery);
      return (await result.toArray()).map(({ _id: id, ...found }: any) => ({
        id,
        ...found,
      }));
    } catch (error) {
      throw new Error(
        `Error finding ${query} on ${collection} collection: ${error}`
      );
    }
  }
}
