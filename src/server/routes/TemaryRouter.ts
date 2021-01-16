import express from 'express';
import { expressCallback, authorizationMiddleware } from '../utils';
import { TemaryRESTController } from '../controllers';

const controller = new TemaryRESTController();
const router = express.Router();

router.post(`/temaries`, authorizationMiddleware, expressCallback(controller.POST));
router.patch(`/temaries`, authorizationMiddleware, expressCallback(controller.PATCH));
router.get(`/temaries`, authorizationMiddleware, expressCallback(controller.LIST));
router.get(`/temaries/:id`, authorizationMiddleware, expressCallback(controller.GET));
router.get(`/temaries/name/:name`, authorizationMiddleware, expressCallback(controller.GET));
router.delete(`/temaries`, authorizationMiddleware, expressCallback(controller.DELETE));
router.delete(`/temaries/:id`, authorizationMiddleware, expressCallback(controller.DELETE));

export default router;
