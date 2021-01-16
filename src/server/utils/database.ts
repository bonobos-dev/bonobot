import { Db, MongoClient } from 'mongodb';

enum DatabaseType {
  mongodb = 'mongodb',
}

export class Database {
  private type: DatabaseType;

  public constructor(type: string) {
    this.setType(type);
  }

  private setType(type: string) {
    if (!DatabaseType[type]) throw new Error('Invalid type for database type');
    this.type = DatabaseType[type];
  }

  public async initDb(): Promise<Db> {
    if (this.type === DatabaseType.mongodb) {
      const url: string = process.env.MONGODB_URI;
      //console.log(url);
      const client: MongoClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
      if (!client.isConnected()) {
        await client.connect();
      }
      return client.db(client.db.name);
    }
  }
}
