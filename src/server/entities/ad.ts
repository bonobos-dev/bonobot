import { AdCustomParamType, AdData, AdType } from '../interfaces';
import { Id } from '../utils';

export class AdEntity {
  private adData: AdData;

  constructor(data: AdData) {
    this.validateData(data);
    this.adData = {
      id: data.id || Id.makeId(),
      createdAt: data.createdAt || new Date(Date.now()).toLocaleString('en-US'),
      modifiedAt: new Date(Date.now()).toLocaleString('en-US'),
      ...data,
    };
  }

  private validateData(data: AdData): void {
    if (!data.name) throw new Error('Advertisement name must be provided.');
    if (!data.type) throw new Error('Advertisement type must be provided.');
    if (!AdType[data.type]) throw new Error('Advertisement type provided do not exist.');
    if (!data.description) throw new Error('Advertisement type must be provided.');
    if (data.staticDate === null || data.staticDate === undefined) throw new Error('Advertisement static date enabled/disabled must be specified.');
    if (data.staticHour === null || data.staticHour === undefined) throw new Error('Advertisement static hour enabled/disabled must be specified.');

    if (AdType[data.type] === AdType.activity || AdType[data.type] === AdType.class || (AdType[data.type] === AdType.meeting && !data.hour)) throw new Error(`Advertisement hour must be provided for the ad type ${data.type}.`);

    if (RegExp(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/gm).test(data.hour)) throw new Error('Please enter a valid hour format. (hh:mm).');

    const newDate = new Date(data.date).toLocaleString('en-US');
    if (newDate === 'Invalid Date' || newDate === null) throw new Error('Please enter a valid date format. (yyyy-mm-dd).');

    if (!data.role) throw new Error('Advertisement role must be provided.');
    if (!data.category) throw new Error('Advertisement category must be provided.');
    if (!data.defaultChannel) throw new Error('Advertisement default channel must be provided.');

    if (data.customParams.length > 0) {
      for (let n = 0; n < data.customParams.length; n++) {
        if (!data.customParams[n].name) throw new Error('Advertisement custom params names must be provided.');
        if (!data.customParams[n].type) throw new Error(`Advertisement custom param type must be provided for custom parameter ${data.customParams[n].name}.`);
        if (!AdCustomParamType[data.customParams[n].type]) throw new Error(`Advertisement custom parameter type provided do not exist for custom parameter ${data.customParams[n].name}.`);
        if (!data.customParams[n].defaultValue) throw new Error(`Advertisement custom param default value must be provided for custom parameter ${data.customParams[n].name}.`);
      }
    }

    if (!data.customEmbedContent) throw new Error('Advertisement custom embed content must be provided even empty.');

    if (data.customEmbedContent.author) {
      if (!data.customEmbedContent.author.hasCustomParams) throw new Error('Author object attribute of the advertisement custom embed must specify if it has custom parameters.');
    }

    if (data.customEmbedContent.description) {
      if (!data.customEmbedContent.description.hasCustomParams) throw new Error('Description object attribute of the advertisement custom embed must specify if it has custom parameters.');
      if (!data.customEmbedContent.description.content) throw new Error('Description content of the advertisement custom embed must be provided.');
    }

    if (data.customEmbedContent.customFields) {
      if (data.customEmbedContent.customFields.length > 0) {
        for (let n = 0; n < data.customEmbedContent.customFields.length; n++) {
          if (!data.customEmbedContent.customFields[n].hasCustomParams) throw new Error('Custom embed field must specify if it has custom parameters.');
          if (!data.customEmbedContent.customFields[n].name) throw new Error('Custom embed field name must be provided.');
          if (!data.customEmbedContent.customFields[n].value) throw new Error('Custom embed field value must be provided.');
          if (!data.customEmbedContent.customFields[n].inline) throw new Error('Custom embed field inline attribute must be provided.');
        }
      }
    }

    if (data.customEmbedContent.footer) {
      if (!data.customEmbedContent.footer.hasCustomParams) throw new Error('Footer object attribute of the advertisement custom embed must specify if it has custom parameters.');
      if (!data.customEmbedContent.footer.text) throw new Error('Footer text attribute of the advertisement custom embed must be provided.');
    }
  }

  public data(): AdData {
    return this.adData;
  }
}
