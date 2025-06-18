// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import { ConfigController } from '../controllers/config/config.controller';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};

export const config = new ConfigController();

router.get('/', handler(config.getList, options));
router.get('/:configId', handler(config.getDetails, options));
router.post('/', handler(config.create, options));
router.put('/:configId', handler(config.update, options));