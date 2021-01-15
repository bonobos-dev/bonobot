import { CategoryData, ChannelType } from '../interfaces';
import { Id } from '../utils';

export class CategoryEntity {
  private categoryData: CategoryData;

  constructor(data: CategoryData) {
    this.validateData(data);
    this.categoryData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: CategoryData): void {
    if (!data.id) throw new Error('A Category id must be provided. It must be the discord role id.');
    if (!data.name) throw new Error('A category name must be provided.');
    if (!data.guild) throw new Error('A category guild must be provided.');
    if (!data.emoji) throw new Error('A category emoji must be provided.');
    if (!data.description) throw new Error('A category description must be provided.');

    if (data.channels.length > 0) {
      data.channels.forEach((channel) => {
        if (!channel.name) throw new Error('All channels name must be provided.');
        if (channel.active === null || channel.active === undefined) throw new Error(`Active attribute must be specified on channel ${channel.name}`);
        if (!channel.text) throw new Error(`Text attribute must be provided on channel ${channel.name}`);
        if (!channel.emoji) throw new Error(`Emoji must be provided on channel ${channel.name}`);
        if (!channel.type) throw new Error(`Emoji must be provided on channel ${channel.name}`);
        if (!ChannelType[channel.type]) throw new Error(`Channel type provided do not exist on channel ${channel.name}`);
        if (!channel.description) throw new Error(`Description must be provided on channel ${channel.name}`);
      });

      data.channelsCount = data.channels.length;
    }
  }

  public data(): CategoryData {
    return this.categoryData;
  }
}
