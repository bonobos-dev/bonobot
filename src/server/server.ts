
import express from 'express';
import bodyParser from "body-parser";
import path from 'path';
import url from 'url';



import globalRouter from './routes/globalRouter';
//import { webpackDevDependencies } from './webpackDevDependencies';
import { initBot } from './bot';
import { createRequest } from './utils/requestGenerator';


const app = express();
const PORT = process.env.PORT || 2503;


let server = require("http").Server(app);



console.log('La aplicación está corriendo en el entorno: <<< ' + process.env.NODE_ENV + ' >>>');


const initServer =  async () => {
		
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	if (process.env.NODE_ENV === 'production') {
		console.log("Production proxy: (http to https)");

		// Uncoment when uploading to a secure domain....  (https)

		/*

		app.enable('trust proxy');
	
		app.use((req, res, next) => {
			if (req.secure) {
				next();
			} else if (req.method === 'GET' || req.method === 'HEAD') {
				res.redirect(url.format({
					protocol: 'https',
					host: req.get('host'),
					pathname: req.originalUrl,
				}));
			} else {
				res.status(400).json({
					error: 'invalid_request',
					error_description: 'Please only use https for this domain',
				});
			}
		});

		*/
		

	} else if (process.env.NODE_ENV === 'development') {
		//app.use(webpackDevDependencies.middleware);

	}
	

	initBot();
	createRequest();
	app.use('/', globalRouter);

	
	server.listen(PORT, () => {
		console.log(`La aplicación está corriendo en: <<< port ${PORT} >>> `);
	});


}

initServer().catch((_err) => {
	if (server && server.listening) server.close();
	console.log(_err);
	process.exitCode = 1;
});




