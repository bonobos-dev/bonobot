import express from 'express';
import { authorizationMiddleware, expressCallback } from '../utils';
import { RuleRESTController } from '../controllers';

const controller = new RuleRESTController();
const router = express.Router();

router.post(`/rules`, authorizationMiddleware, expressCallback(controller.POST));
router.patch(`/rules`, authorizationMiddleware, expressCallback(controller.PATCH));
router.get(`/rules`, authorizationMiddleware, expressCallback(controller.LIST));
router.get(`/rules/:id`, authorizationMiddleware, expressCallback(controller.GET));
router.get(`/rules/name/:name`, authorizationMiddleware, expressCallback(controller.GET));
router.delete(`/rules`, authorizationMiddleware, expressCallback(controller.DELETE));
router.delete(`/rules/:id`, authorizationMiddleware, expressCallback(controller.DELETE));

export default router;
