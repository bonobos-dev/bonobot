export enum ChannelType {
  text = 'text',
  voice = 'voice',
  ads = 'ads',
}

export interface ChannelData {
  id?: string;
  name: string;
  active: boolean;
  text: string;
  emoji: string;
  type: string;
  description: string;
}

export interface CategoryData {
  id?: string;
  name?: string;
  guild?: string;
  emoji?: string;
  createdAt?: string;
  createdBy?: {
    id?: string;
    username?: string;
    discriminator?: string;
  };
  modifiedAt?: string;
  modifiedBy?: {
    id?: string;
    username?: string;
    discriminator?: string;
  };
  source?: {
    ip?: string;
    browser?: string;
    referrer?: string;
  };
  description?: string;
  channelsCount?: number;
  channels?: ChannelData[];
}
