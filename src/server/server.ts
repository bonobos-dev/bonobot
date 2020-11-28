import dotenv from 'dotenv';
dotenv.config({path: `../../.env` });
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import globalRouter from './routes/globalRouter';
import Bonobot  from './Bonobot';
import { createRequest } from './utils/bonobotsHerokuHack';



const app = express();
const PORT = process.env.PORT || 2503;



console.log(
  'La aplicación está corriendo en el entorno: <<< ' +
    process.env.NODE_ENV +
    ' >>>'
);



const initServer = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const bot = new Bonobot();
  bot.start();
  bot.apply();
  
  createRequest();

  app.use('/', globalRouter);


  app.listen(PORT, () => {
    console.log(`El bonobot está corriendo en: <<< port ${PORT} >>> `);
  });
};

initServer();
