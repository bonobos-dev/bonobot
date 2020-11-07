import { Db, MongoClient } from 'mongodb';

enum MigdrpDbType {
  MongoDb = 'mongodb',
}

export class MigdrpDb {
  private type: MigdrpDbType;

  public constructor(type: string) {
    this.setType(type);
  }

  private setType(type: string) {
    if (type === 'mongo') {
      this.type = MigdrpDbType.MongoDb;
    } else {
      throw new Error('Invalid type for MigdrpDb');
    }
  }

  public async initDb(): Promise<Db> {
    if (this.type === MigdrpDbType.MongoDb) {
      const url: string = process.env.MONGODB_OIDC_URI;
      //console.log( 'url is: ', url);
      const client: MongoClient = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      if (!client.isConnected()) {
        await client.connect();
      }

      return client.db(client.db.name);
    }
  }
}
