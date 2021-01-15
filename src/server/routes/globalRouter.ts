import express from 'express';
import path from 'path';
import { authenticationMiddleware } from '../utils';

import { TemaryRouter, CategoryRouter, GuildRouter, RoleRouter, RuleRouter, CommandRouter, AdRouter } from './';

const router = express.Router();

router.use('/img', express.static(path.join(__dirname, `../assets/img`)));

router.use(authenticationMiddleware);
router.use('/api', TemaryRouter, CategoryRouter, RoleRouter, RuleRouter, CommandRouter, AdRouter, GuildRouter);

router.get('/', (req, res) => {
  res.send('Bienvenido al bonobot');
});

router.get('/redirected', (req, res) => {
  console.log('Params..', req.params);
  console.log('Body..', req.body);
  console.log('Query..', req.query);
  res.send('Redirected from discord');
});

router.get('/start_requests', (_req, res) => {
  res.send('Hola hermoso bot, hacemos un buen trabajo, yo soy el bonobot');
});

export default router;
