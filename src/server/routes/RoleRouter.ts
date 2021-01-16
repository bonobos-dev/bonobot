import express from 'express';
import { expressCallback } from '../utils';
import { RoleRESTController } from '../controllers';

import { authorizationMiddleware } from '../utils/UserMiddleware';

const controller = new RoleRESTController();
const router = express.Router();

router.post(`/roles`, authorizationMiddleware, expressCallback(controller.POST));
router.patch(`/roles`, authorizationMiddleware, expressCallback(controller.PATCH));
router.get(`/roles`, authorizationMiddleware, expressCallback(controller.LIST));
router.get(`/roles/:id`, authorizationMiddleware, expressCallback(controller.GET));
router.get(`/roles/name/:name`, authorizationMiddleware, expressCallback(controller.GET));
router.delete(`/roles`, authorizationMiddleware, expressCallback(controller.DELETE));
router.delete(`/roles/:id`, authorizationMiddleware, expressCallback(controller.DELETE));

export default router;
