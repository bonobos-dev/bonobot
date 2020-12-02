import dotenv from 'dotenv';
dotenv.config({ path: `../../.env` });
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import globalRouter from './routes/globalRouter';
import Bonobot from './Bonobot';
import { createRequest } from './utils/bonobotsHerokuHack';

const app = express();
const PORT = process.env.PORT || 2503;

console.info('The app is on : <<< ' + process.env.NODE_ENV + ' >>>');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bot = new Bonobot();
bot.start();
bot.run();

createRequest();

app.use('/', globalRouter);

app.listen(PORT, () => {
  console.log(`The bonobot is run on: <<< port ${PORT} >>> `);
});
