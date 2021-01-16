import express from 'express';
import { expressCallback,  authorizationMiddleware } from '../utils';
import { AdRESTController } from '../controllers';


const controller = new AdRESTController();
const router = express.Router();

router.post(`/ads`, authorizationMiddleware, expressCallback(controller.POST));
router.patch(`/ads`, authorizationMiddleware,   expressCallback(controller.PATCH));
router.get(`/ads`, authorizationMiddleware,  expressCallback(controller.LIST));
router.get(`/ads/:id`, authorizationMiddleware,  expressCallback(controller.GET));
router.get(`/ads/name/:name`, authorizationMiddleware,  expressCallback(controller.GET));
router.delete(`/ads`, authorizationMiddleware,  expressCallback(controller.DELETE));
router.delete(`/ads/:id`, authorizationMiddleware,  expressCallback(controller.DELETE));

export default router;

