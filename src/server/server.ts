import * as express from "express";
import * as bodyParser from 'body-parser';

import globalRouter from './routes/globalRouter';
//import { webpackDevDependencies } from './webpackDevDependencies';
import { initBot } from './bot';

const app = express.application;
const PORT = process.env.PORT || 2503;

let server = require('http').Server(app);

console.log(
  'La aplicación está corriendo en el entorno: <<< ' +
    process.env.NODE_ENV +
    ' >>>'
);

const initServer = async () => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV === 'production') {
    console.log('Production proxy: (http to https)');

  } else if (process.env.NODE_ENV === 'development') {
    //app.use(webpackDevDependencies.middleware);
  }

  initBot();
  app.use('/', globalRouter);

  server.listen(PORT, () => {
    console.log(`La aplicación está corriendo en: <<< port ${PORT} >>> `);
  });
};

initServer().catch((_err) => {
  if (server && server.listening) server.close();
  console.log(_err);
  process.exitCode = 1;
});
