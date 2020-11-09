import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
//import  { webpackDevDependencies } from '../webpackDevDependencies';
//import webpack from "webpack";

dotenv.config({path: `../../.env` });
dotenv.config();
const router = express.Router();
const ENV_PATH: string =
  process.env.NODE_ENV === 'production' ? 'dist' : 'src/public';

console.log('From global router: ', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'production') {
  router.get(['/'], (req, res) => {
    res.sendFile(path.join(__dirname + `../../../${ENV_PATH}/index.html`));
  });
} else if (process.env.NODE_ENV === 'development') {
  /*
	router.get('/', function (req, res, next) {
		var filename = path.join(webpackDevDependencies.compiler.outputPath,'index.html');

		(webpackDevDependencies.compiler.outputFileSystem as unknown as webpack.InputFileSystem).readFile(filename, function(err:any, result:any){
			if (err) {
				return next(err);
			}
			res.set('content-type','text/html');
			res.send(result);
			res.end();
		});
	});
	
*/
}

router.use('/dist', express.static(path.join(__dirname, `../../${ENV_PATH}`)));
router.use(
  '/img',
  express.static(path.join(__dirname, `../../${ENV_PATH}/assets/img`))
);
router.use(
  '/audio',
  express.static(path.join(__dirname, `../../${ENV_PATH}/assets/audio`))
);

router.post('/api/data/tester', (_req, res) => {
  res.header('Content-Type', 'application/json');
  res.json({
    message: 'ok',
  });
  console.log('check body: ', _req.body);
  console.log('check params: ', _req.params);
  console.log('check query: ', _req.query);
});

router.get('/api/envtest', (_req, res) => {
  res.send(
    'Running the application on <<< ' +
      process.env.NODE_ENV +
      ' environment >>>'
  );
});

router.get('/start_requests', (_req, res) => {
  res.send('Hola hermoso bot, hacemos un buen trabajo, yo soy el bonobot');
});

export default router;
