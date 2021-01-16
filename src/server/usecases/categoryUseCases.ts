import { mongoDbAdapter } from '../utils';
import { CategoryEntity } from '../entities';
import { CategoryData } from '../interfaces';
import { GuildUseCases } from './';

export class CategoryUseCases {
  private guildUseCase = new GuildUseCases();
  private adaptador = new mongoDbAdapter();
  private collection = 'categories';

  public async add(data: CategoryData | Array<CategoryData>): Promise<CategoryData | CategoryData[]> {
    try {
      if (!Array.isArray(data)) {
        const idExist = await this.adaptador.findById({ id: data.id }, this.collection);
        if (idExist) throw new Error(`Category with id ${data.id} already exist on database`);

        const newCategoryData = new CategoryEntity(data).data();
        newCategoryData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');

        const guildExists = await this.adaptador.findById({ id: newCategoryData.guild }, 'guilds');

        if (!guildExists) throw new Error(`Guild id of category with id ${data.id} do not exists on database`);
        const categoryInserted: CategoryData = await this.adaptador.insertOne({ id: newCategoryData.id, ...newCategoryData }, this.collection);

        guildExists.categories.push(categoryInserted.id);
        await this.guildUseCase.editCategories(guildExists);

        return categoryInserted;
      } else {
        const newCategoriesData: CategoryData[] = [];
        let sharedGuildId: string;

        for (let i = 0; i < data.length; i++) {
          const currentGuildId = data[i].guild;
          sharedGuildId = currentGuildId;
          if (i < data.length - 1) {
            const nextGuildId = data[i + 1].guild;
            //console.log(`Comparing ids: ${currentGuildId} -- ${nextGuildId}`);
            if (currentGuildId !== nextGuildId) throw new Error(`Posting multiple categories is only allowed if they have the same guild id.`);
          }
        }

        const guildExists = await this.adaptador.findById({ id: sharedGuildId }, 'guilds');
        if (!guildExists) throw new Error(`Guild id do not exists on database. You can only register categories with an existing guild id`);

        for (let n = 0; n < data.length; n++) {
          const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
          if (idExist) throw new Error(`Category with id ${data[n].id} already exist on database`);

          const newCategoryData = new CategoryEntity(data[n]).data();
          newCategoryData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
          newCategoriesData.push(newCategoryData);
        }

        const categoriesInserted = await this.adaptador.insertMany(newCategoriesData, this.collection);

        if (guildExists.categories.length > 0) {
          const categoriesIds = [];
          for (let x = 0; x < categoriesInserted.length; x++) categoriesIds.push(categoriesInserted[x].id);
          let mergedIds = guildExists.categories.concat(categoriesIds);
          mergedIds = mergedIds.filter((item: any, index: any) => mergedIds.indexOf(item) == index);
          guildExists.categories = mergedIds;
        } else {
          for (let x = 0; x < categoriesInserted.length; x++) {
            console.log('check inserted', categoriesInserted[x]);
            guildExists.categories.push(categoriesInserted[x].id);
          }
        }

        await this.guildUseCase.editCategories(guildExists);

        return categoriesInserted as CategoryData[];
      }
    } catch (exception) {
      console.log('Error adding category  (add Category): ', exception.message);
      throw new Error(`Error adding category (add Category): ${exception.message}`);
    }
  }

  public async edit(data: CategoryData | Array<CategoryData>): Promise<CategoryData | CategoryData[]> {
    try {
      if (!Array.isArray(data)) data = [data];
      const allDataInserted: CategoryData[] = [];

      for (let n = 0; n < data.length; n++) {
        const idExist = await this.adaptador.findById({ id: data[n].id }, this.collection);
        if (!idExist) throw new Error(`Category with id ${data[n].id} does not exist on database, please try again.`);

        const mergeWithOldData = { ...idExist, ...data[n] };
        const newCategoryData = new CategoryEntity(mergeWithOldData).data();
        newCategoryData.modifiedAt = new Date(Date.now()).toLocaleString('en-US');
        const insertOne = await this.adaptador.updateOne({ id: newCategoryData.id, ...newCategoryData }, this.collection);
        allDataInserted.push(insertOne);
      }

      return allDataInserted as CategoryData[];
    } catch (exception) {
      console.log('Error updating the database  (edit Category): ', exception.message);
      throw new Error(`Error updating the database (edit Category): ${exception.message}`);
    }
  }

  public async list(): Promise<CategoryData[]> {
    try {
      const categories = await this.adaptador.findAll(this.collection);
      if (categories.length <= 0) {
        throw new Error('No categories found on database.');
      }
      return categories as CategoryData[];
    } catch (exception) {
      console.log('Error listing the database  (list Category): ', exception.message);
      throw new Error(`Error listing the database (list Category): ${exception.message}`);
    }
  }

  public async findById(id: string): Promise<CategoryData[]> {
    try {
      const idExist = await this.adaptador.findById({ id: id }, this.collection);
      if (!idExist) throw new Error('Category not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding category (findById Category): ', exception.message);
      throw new Error(`Error finding category: ${exception.message}`);
    }
  }

  public async findByName(name: string): Promise<CategoryData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ name: name }, this.collection);
      if (!idExist) throw new Error('Category not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding category (findByName Category): ', exception.message);
      throw new Error(`Error finding category: ${exception.message}`);
    }
  }

  public async findByQuery(query: CategoryData): Promise<CategoryData[]> {
    try {
      const idExist = await this.adaptador.findByQuery({ ...query }, this.collection);
      if (!idExist) throw new Error('Category not found.');

      return idExist;
    } catch (exception) {
      console.log('Error finding category (findByName Category): ', exception.message);
      throw new Error(`Error finding category: ${exception.message}`);
    }
  }

  public async deleteById({ id }: { id: string }): Promise<number> {
    function deleteNothing(): number {
      return 0;
    }

    try {
      if (!id) throw new Error('You must provide an id poperty.');
      const categoryForDelete: CategoryData = await this.adaptador.findById({ id: id }, this.collection);
      if (!categoryForDelete) return deleteNothing();
      const deletedTemary = await this.adaptador.removeById({ id: id }, this.collection);
      console.log('Category deleted: ', deletedTemary);

      const guildExists = await this.adaptador.findById({ id: categoryForDelete.guild }, 'guilds');

      if (guildExists) {
        const newGuildList = guildExists.categories.filter((categorie: string) => categorie !== categoryForDelete.id);
        guildExists.categories = newGuildList;
        await this.guildUseCase.editCategories(guildExists);
      }
      return deletedTemary;
    } catch (exception) {
      console.log('Error deleting category (deleteById Category): ', exception.message);
      throw new Error(`Error deleting category.`);
    }
  }
}
