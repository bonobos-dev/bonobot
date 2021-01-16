export interface GuildData {
  id?: string;
  name: string;
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
  categoriesCount?: number;
  categories?: string[];
  rolesCount?: number;
  roles?: string[];
  mastersCount?: number;
  masters?: string[];
  apiRolesCount?: number;
  apiRoles?: string[];
}
