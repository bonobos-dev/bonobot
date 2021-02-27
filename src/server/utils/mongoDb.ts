import { Db, MongoClient } from 'mongodb';

enum DatabaseType {
  mongodb = 'mongodb',
}

export class MongoDatabase {
  private type: DatabaseType;
  private client: MongoClient;

  constructor(type: string) {
    this.setType(type);
  }

  private setType(type: string) {
    if (!DatabaseType[type]) throw new Error('Invalid type for database type');
    this.type = DatabaseType[type];
  }

  async initDb(): Promise<Db> {
    try {
      if (this.type === DatabaseType.mongodb) {
        const url: string = process.env.MONGODB_URI;
        //console.log(url);
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        if (!this.client.isConnected()) {
          await this.client.connect();
        }
        return this.client.db(this.client.db.name);
      }
    } catch (exception) {
      console.log(exception);
      throw new Error('Exception initializing mongo database instance');
    }
  }

  async closeDbClient(): Promise<void> {
    try {
      if (this.client.isConnected()) {
        await this.client.close();
      }
    } catch (exception) {
      console.log(exception);
      throw new Error('Exception closing mongo database instance');
    }
  }
}
