export enum AdType {
  meeting = 'meeting',
  reminder = 'reminder',
  announcement = 'announcement',
  activity = 'activity',
  class = 'class',
}

export enum AdCustomParamType {
  text = 'text',
  channel = 'channel',
  user = 'user',
  role = 'role',
}

export interface AdCustomEmbedContent {
  thumbnailUrl?: string;
  imageUrl?: string;
  author?: {
    hasCustomParams: boolean;
    name: string;
    url?: string;
    icon_url?: string;
  };
  description?: {
    hasCustomParams: boolean;
    content: string;
  };
  customFields?: Array<{
    hasCustomParams: boolean;
    name: string;
    value: string;
    inline: boolean;
  }>;
  footer?: {
    hasCustomParams: boolean;
    icon_url?: string;
    text: string;
  };
}

export interface AdCustomParam {
  name: string;
  type: string;
  defaultValue: string;
}

export interface AdData {
  id?: string;
  name: string;
  type: string;
  description?: string;
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
  staticDate: boolean;
  staticHour: boolean;
  date?: string;
  hour?: string;
  role?: string;
  category?: string;
  defaultChannel?: string;
  customParams?: AdCustomParam[];
  customEmbedContent?: AdCustomEmbedContent;
}
