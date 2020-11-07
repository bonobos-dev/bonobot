import cuid from 'cuid';

export type ID = typeof Id;

export const Id = Object.freeze({
  makeId: cuid,
  isValidId: cuid.isCuid,
});
