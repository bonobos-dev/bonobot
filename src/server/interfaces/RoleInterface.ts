export enum RoleType {
  Principales = 'Principales',
  Actividades = 'Actividades',
  Educativos = 'Educativos',
  Utilidad = 'Utilidad',
  Reservados = 'Reservados',
  Discord = 'Discord',
  Archivados = 'Archivados',
  Bots = 'Bots',
}

export interface RoleData {
  id?: string;
  name?: string;
  guild: string;
  emoji?: string;
  active?: boolean;
  selectable?: boolean;
  color?: string;
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
  type?: string;
  description?: string;
  commands?: string[];
  commandsCount?: number;
}
