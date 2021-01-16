import express from 'express';
import { authorizationMiddleware, expressCallback } from '../utils';
import { CategoryRESTController } from '../controllers';

const controller = new CategoryRESTController();
const router = express.Router();

router.post(`/categories`, authorizationMiddleware, expressCallback(controller.POST));
router.patch(`/categories`, authorizationMiddleware, expressCallback(controller.PATCH));
router.get(`/categories`, authorizationMiddleware, expressCallback(controller.LIST));
router.get(`/categories/:id`, authorizationMiddleware, expressCallback(controller.GET));
router.get(`/categories/name/:name`, authorizationMiddleware, expressCallback(controller.GET));
router.delete(`/categories`, authorizationMiddleware, expressCallback(controller.DELETE));
router.delete(`/categories/:id`, authorizationMiddleware, expressCallback(controller.DELETE));

export default router;
