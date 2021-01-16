import express from 'express';
import { authorizationMiddleware, expressCallback } from '../utils';
import { CommandRESTController } from '../controllers';

const controller = new CommandRESTController();
const router = express.Router();

router.post(`/commands`, authorizationMiddleware, expressCallback(controller.POST));
router.patch(`/commands`, authorizationMiddleware, expressCallback(controller.PATCH));
router.get(`/commands`, authorizationMiddleware, expressCallback(controller.LIST));
router.get(`/commands/:id`, authorizationMiddleware, expressCallback(controller.GET));
router.get(`/commands/name/:name`, authorizationMiddleware, expressCallback(controller.GET));
router.delete(`/commands`, authorizationMiddleware, expressCallback(controller.DELETE));
router.delete(`/commands/:id`, authorizationMiddleware, expressCallback(controller.DELETE));

export default router;
