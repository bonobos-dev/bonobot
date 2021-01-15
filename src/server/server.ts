import dotenv from 'dotenv';
dotenv.config({ path: `../../.env` });
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

import globalRouter from './routes/globalRouter';
import Bonobot from './Bonobot';
import { startHerokuHackRequest } from './utils/bonobotHerokuHack';
import { Database } from './utils';

import { newBotConfigurationObject } from './botConfig';

const app = express();
const PORT = process.env.PORT || 2503;
const bot = new Bonobot(newBotConfigurationObject);

console.info('The app is on : <<< ' + process.env.NODE_ENV + ' >>>');

const server = new http.Server(app);

const initServer = async () => {
  console.log('Mongodb uri: ', process.env.MONGODB_URI);
  await new Database('mongodb').initDb();
  console.log('Database started');

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  bot.start();

  startHerokuHackRequest();
  console.log('');

  app.use('/', globalRouter);

  app.listen(PORT, () => {
    console.log(`The bonobot is run on: <<< port ${PORT} >>> `);
  });
};

initServer().catch((err) => {
  if (server && server.listening) server.close();
  console.log('Error del servidor: ', err);
  process.exitCode = 1;
});

export { bot };
