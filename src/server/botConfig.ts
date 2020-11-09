export interface Role {
  roleId: string;
  roleName: string;
}

export interface CommandRestriction {
  guildNmae: string;
  guildId: string;
  roles: Array<Role>;
}

export interface CommandConfig {
  command: string;
  restrictions: Array<CommandRestriction>;
}

const config = {
  prefix: 'bbpruebas-',
  env: process.env.NODE_ENV,
  commands: [
    {
      command: 'temario',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
    {
      command: 'turnos',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
    {
      command: 'verificador',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
    {
      command: 'denuncia',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
    {
      command: 'server',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
    {
      command: 'cleanroles',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
    {
      command: 'mensajes',
      restrictions: [
        {
          guildName: 'CB Pruebas',
          guildId: '759558925237878807',
          roles: [
            { roleId: '759558925270909004', roleName: 'Intercambiable' },
            { roleId: '759558925270909007', roleName: 'Influyente' },
            { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
            { roleId: '761729394750259230', roleName: 'Esencial' },
          ],
        },
        {
          guildName: 'migdrp testing',
          guildId: '737175557007212585',
          roles: [],
        },
        {
          guildName: 'Comunidad Bonóbica',
          guildId: '680585599819841560',
          roles: [
            { roleId: '759926662720258100', roleName: 'Esencial' },
            { roleId: '697314419868172298', roleName: 'Influyente' },
            { roleId: '687210304312180755', roleName: 'Intercambiable' },
          ],
        },
      ],
    },
  ],
  valid_guilds: [
    {
      guildName: 'CB Pruebas',
      guildId: '759558925237878807',
      roles: [
        { roleId: '759558925270909004', roleName: 'Intercambiable' },
        { roleId: '759558925270909007', roleName: 'Influyente' },
        { roleId: '759909279767068693', roleName: 'EDITANDO EL SERVER' },
        { roleId: '761729394750259230', roleName: 'Esencial' },
      ],
    },
    {
      guildName: 'migdrp testing',
      guildId: '737175557007212585',
      roles: [],
    },
    {
      guildName: 'Comunidad Bonóbica',
      guildId: '680585599819841560',
      roles: [
        { roleId: '759926662720258100', roleName: 'Esencial' },
        { roleId: '697314419868172298', roleName: 'Influyente' },
        { roleId: '687210304312180755', roleName: 'Intercambiable' },
      ],
    },
  ],
  ignored_users: [{ username: 'Bonobot', id: '737167797871837265' }],
};

const roles = {
  cb_real: {
    esencial: { id: '759926662720258100' },
    influyente: { id: '697314419868172298' },
    embajadores: { id: '714581956897013861' },
    intercambiable: { id: '687210304312180755' },
    'bonobo de la suerte': { id: '765414306426126426' },
    bonobo: { id: '710650474877157397' },
    chimpancé: { id: '684255900323938324' },
    austalopitecus: { id: '742860718650425395' },
    deus_ex_maquina: { id: '726582531746431008' },
    maquinas_arcade: { id: '742195627253039107' },
    multi_task: { id: '684255765082669056' },
    multimedia_digital: { id: '742195393424523354' },
    'parla sabatina': { id: '705975181688045598' },
    'lector avispado': { id: '727351251041386526' },
    lumierista: { id: '727357766561431552' },
    'bonobo literario': { id: '754532026366951434' },
    chaturanga: { id: '754825942701965342' },
    'eco bonobo': { id: '765413451799461889' },
    políglota: { id: '765413594137362433' },
    cinéfilo: { id: '765413731207086140' },
    sabronobo: { id: '765413874043715595' },
    'homo economicus': { id: '746149379790078025' },
    'photo shoppers': { id: '754531018404528229' },
    'homo artem': { id: '765413987390586891' },
    entomófagos: { id: '765414079228674058' },
    stremears: { id: '745032127690571826' },
    capuchino: { id: '759502696813690940' },
    aullador: { id: '761766524851585056' },
    mamandril: { id: '765414233369477150' },
    rabioso: { id: '743714192435052564' },
    'komecanto esperantisto': { id: '742186094367604797' },
    'homo sonitus': { id: '770696924336619590' },
  },
  cb_pruebas: {
    esencial: { id: '761729394750259230' },
    influyente: { id: '759558925270909007' },
    embajadores: { id: '759558925270909006' },
    intercambiable: { id: '759558925270909004' },
    'bonobo de la suerte': { id: '765127488451510332' },
    bonobo: { id: '759558925270909003' },
    chimpancé: { id: '759558925270909002' },
    austalopitecus: { id: '759558925270909001' },
    deus_ex_maquina: { id: '759558925287948288' },
    maquinas_arcade: { id: '759558925283754075' },
    multi_task: { id: '759558925283754074' },
    multimedia_digital: { id: '759558925283754076' },
    'parla sabatina': { id: '759558925237878813' },
    'lector avispado': { id: '759558925237878811' },
    lumierista: { id: '759558925237878812' },
    'bonobo literario': { id: '759558925237878809' },
    chaturanga: { id: '759558925237878814' },
    'eco bonobo': { id: '765111083874517003' },
    políglota: { id: '765111770834010142' },
    cinéfilo: { id: '765112061872439327' },
    sabronobo: { id: '765112235365498920' },
    'homo economicus': { id: '759558925237878816' },
    'photo shoppers': { id: '759558925270908999' },
    'homo artem': { id: '765112537070567425' },
    entomófagos: { id: '765112699159707649' },
    stremears: { id: '759558925237878810' },
    capuchino: { id: '761730409801187350' },
    aullador: { id: '765113221685706773' },
    mamandril: { id: '765126037305688064' },
    rabioso: { id: '759558925287948289' },
    'komecanto esperantisto': { id: '759558925237878808' },
    'homo sonitus': { id: '770696924336619590' },
  },
};

export { config, roles };

