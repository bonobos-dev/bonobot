import express from 'express';
import path from 'path';
import dotenv from 'dotenv';


dotenv.config({path: `../../.env` });
dotenv.config();
const router = express.Router();
const ENV_PATH = process.env.NODE_ENV === 'production' ? 'dist' : 'src/public';



router.use('/dist', express.static(path.join(__dirname, `../../${ENV_PATH}`)));
router.use('/img', express.static(path.join(__dirname, `../../${ENV_PATH}/assets/img`)));
router.use('/audio', express.static(path.join(__dirname, `../../${ENV_PATH}/assets/audio`)));

router.get('/', (req, res)=>{
  res.send('Bienvenido al bonobot');
});

router.get('/start_requests', (_req, res) => {
  res.send('Hola hermoso bot, hacemos un buen trabajo, yo soy el bonobot');
});

export default router;
