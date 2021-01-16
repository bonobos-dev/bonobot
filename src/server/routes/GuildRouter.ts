import express from 'express';
import { expressCallback, bonobotMastersMiddleware } from '../utils';
import { GuildRESTController } from '../controllers';

const controller = new GuildRESTController();
const router = express.Router();

router.post(`/guilds`, bonobotMastersMiddleware, expressCallback(controller.POST));
router.patch(`/guilds`, bonobotMastersMiddleware, expressCallback(controller.PATCH));
router.get(`/guilds`, bonobotMastersMiddleware, expressCallback(controller.LIST));
router.get(`/guilds/:id`, bonobotMastersMiddleware, expressCallback(controller.GET));
router.get(`/guilds/name/:name`, bonobotMastersMiddleware, expressCallback(controller.GET));
router.delete(`/guilds`, bonobotMastersMiddleware, expressCallback(controller.DELETE));
router.delete(`/guilds/:id`, bonobotMastersMiddleware, expressCallback(controller.DELETE));

export default router;
