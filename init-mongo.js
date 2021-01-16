/* eslint-disable no-undef */

db.createUser({
  user: 'bonobotUser',
  pwd: 'test123',
  roles: [
    {
      role: 'readWrite',
      db: 'bonobot',
    },
  ],
});
