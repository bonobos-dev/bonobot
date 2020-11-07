import express from "express";
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import globalRouter from './routes/globalRouter';
import { initBot } from './bot';

dotenv.config({path: `../../.env` });
dotenv.config();
console.log(`Prueba de env ${process.env.NODE_ENV}`);
const app = express();
const PORT = process.env.PORT || 2503;

console.log(process.env.NODE_ENV);
console.log(
  'La aplicación está corriendo en el entorno: <<< ' +
    process.env.NODE_ENV +
    ' >>>'
);

const initServer = () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'production') {
    console.log('Production proxy: (http to https)');

  } else if (process.env.NODE_ENV === 'development') {
    //app.use(webpackDevDependencies.middleware);
  }

  initBot();
  app.use('/', globalRouter);

  app.listen(PORT, () => {
    console.log(`La aplicación está corriendo en: <<< port ${PORT} >>> `);
  });
};

initServer();
