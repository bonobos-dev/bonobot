import express from 'express';
import path from 'path';

const router = express.Router();



router.use('/img', express.static(path.join(__dirname, `../assets/img`)));


router.get('/', (req, res)=>{
  res.send('Bienvenido al bonobot');
});


router.get('/start_requests', (_req, res) => {
  res.send('Hola hermoso bot, hacemos un buen trabajo, yo soy el bonobot');
});

export default router;
