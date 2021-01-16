interface RuleData {
  id?: string;
  name?: string;
  guild?: string;
  rule?: string;
  severity?: number;
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
}

export { RuleData };
