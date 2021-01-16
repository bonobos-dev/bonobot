import { TemaryData } from '../interfaces';
import { Id } from '../utils';

export class TemaryEntity {
  private temaryData: TemaryData;

  constructor(data: TemaryData) {
    this.validateData(data);
    this.temaryData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: TemaryData): void {
    if (data.createdAt === '') data.createdAt = new Date(Date.now()).toLocaleString('en-US');

    if (!data.name) throw new Error('A temary name must be provided.');
    if (!data.date) throw new Error('A temary date must be provided.');
    if (data.active === null || data.active === undefined) throw new Error('Active attribute must be specified.');

    const newDate = new Date(data.date).toLocaleString('en-US');
    if (newDate === 'Invalid Date' || newDate === null) throw new Error('Please enter a valid date format. (yyyy-mm-dd).');

    if (!data.content || data.content.length === 0) throw new Error('Content must be provided');
  }

  public data(): TemaryData {
    return this.temaryData;
  }
}
