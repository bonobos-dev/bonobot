import { mongoDbAdapter } from '../utils';
import { AdEntity } from '../entities';
import { AdData, CategoryData } from '../interfaces';

export class AdUseCases {
  private adaptador = new mongoDbAdapter();
  private collection = 'ads';

  public async add(data: AdData | Array<AdData>): Promise<AdData | AdData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Ad with id ${data.id} already exist on database`);

        const nameExist = await this.adaptador.findByName({ name: data.name }, this.collection);
        if (nameExist) throw new Error(`Ad with name ${data.name} already exist on database`);

        const roleExist = await this.adaptador.findById({ id: data.role }, 'roles');
        if (!roleExist) throw new Error(`Role with id ${data.role} do not exist on database. You can only register ads with existing role ids`);

        const categoryExist: CategoryData = await this.adaptador.findById({ id: data.category }, 'categories');
        if (!categoryExist) throw new Error(`Categorie with id ${data.role} do not exist on database. You can only register ads with existing category ids`);

        const filteredCategoryChannel = categoryExist.channels.filter((channel) => channel.id === data.defaultChannel);
        if (filteredCategoryChannel.length === 0) throw new Error(`Default channel with id ${data.defaultChannel} do not exist on category ${categoryExist.name}. You can only register ads with an existing category channel`);

        const newData = new AdEntity(data).data();
        newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const dataInserted = await this.adaptador.insertOne({ id: newData.id, ...newData }, this.collection);
        return dataInserted as AdData;
      } else {
        const newItemsData: AdData[] = [];

        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Ad with id ${data[n].id} already exist on database`);

          const nameExist = await this.adaptador.findByName({ name: data[n].name }, this.collection);
          if (nameExist) throw new Error(`Ad with name ${data[n].name} already exist on database`);

          const roleExist = await this.adaptador.findById({ id: data[n].role }, 'roles');
          if (!roleExist) throw new Error(`Role with id ${data[n].role} do not exist on database. You can only register ads with existing role ids`);

          const categoryExist: CategoryData = await this.adaptador.findById({ id: data[n].category }, 'categories');
          if (!categoryExist) throw new Error(`Categorie with id ${data[n].role} do not exist on database. You can only register ads with existing category ids`);

          const filteredCategoryChannel = categoryExist.channels.filter((channel) => channel.id === data[n].defaultChannel);
          if (filteredCategoryChannel.length === 0) throw new Error(`Default channel with id ${data[n].defaultChannel} do not exist on category ${categoryExist.name}. You can only register ads with an existing category channel`);

          const newData = new AdEntity(data[n]).data();
          newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newItemsData.push(newData);
        }
        const dataInserted = await this.adaptador.insertMany(newItemsData, this.collection);
        return dataInserted as AdData[];
      }
    } catch (exception) {
      console.log('Error adding ad  (add Ad): ', exception.message);
      throw new Error(`Error adding ad (add Ad): ${exception.message}`);
    }
  }

  public async edit(data: AdData | Array<AdData>): Promise<AdData | AdData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: AdData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Ad with id ${data[n].id} do not exist on database, please try again.`);

        if (idExist.role !== data[n].role) {
          const roleExist = await this.adaptador.findById({ id: data[n].role }, 'roles');
          if (!roleExist) throw new Error(`Role with id ${data[n].role} do not exist on database. You can only register existing role ids`);
        }
        if (idExist.category !== data[n].category || idExist.defaultChannel !== data[n].defaultChannel) {
          const categoryExist: CategoryData = await this.adaptador.findById({ id: data[n].category }, 'categories');
          if (!categoryExist) throw new Error(`Categorie with id ${data[n].role} do not exist on database. You can only register existing category ids`);

          const filteredCategoryChannel = categoryExist.channels.filter((channel) => channel.id === data[n].defaultChannel);
          if (filteredCategoryChannel.length === 0) throw new Error(`Default channel with id ${data[n].defaultChannel} do not exist on category ${categoryExist.name}. You can only register ads with an existing category channel`);
        }

        const mergedWithOldData = { ...idExist, ...data[n] };
        const newData = new AdEntity(mergedWithOldData).data();
        newData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const insertOne = await this.adaptador.updateOne({ id: newData.id, ...newData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as AdData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Ad): ', exception.message);
      throw new Error(`Error updating the database (edit Ad): ${exception.message}`);
    }
  }

  public async list(): Promise<AdData[]> {
    try {
      const ads = await this.adaptador.findAll(this.collection);
      if (ads.length <= 0) {
        throw new Error('No ads found on database.');
      }
      return ads as AdData[];
    } catch (exception) {
      console.log('Error listing the dataset (list Ad): ', exception.message);
      throw new Error(`Error listing the dataset (list Ad): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<AdData[]> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Ad not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding ad (findById Ad): ', exception.message);
      throw new Error(`Error finding ad: ${exception.message}`);
    }
  }

  public async findByQuery(query: AdData): Promise<AdData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Ad not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding ad (findByQuery Ad): ', exception.message);
      throw new Error(`Error finding ad: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<AdData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Ad not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding ad (findByName Ad): ', exception.message);
      throw new Error(`Error finding ad: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const adForDelete: AdData = await this.adaptador.findById({ id: id }, this.collection);
      if (!adForDelete) return deleteNothing();
      const deletedAd = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Ad deleted: ', deletedAd);
      return deletedAd;
    } catch (exception) {
      console.log('Error deleting ad (deleteById Ad): ', exception.message);
      throw new Error(`Error deleting ad.`);
    }
  }
}
