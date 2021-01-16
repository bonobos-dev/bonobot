interface ThemeData {
  title?: string;
  subtitles?: string[];
}

interface TemaryData {
  id?: string;
  name?: string;
  date?: string;
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
  active?: boolean;
  content?: ThemeData[];
}

export { ThemeData, TemaryData };
