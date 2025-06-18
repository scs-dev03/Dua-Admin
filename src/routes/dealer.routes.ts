// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import { DealerController } from '../controllers/dealer/dealer.controller';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};

export const dealer = new DealerController();

router.get('/', handler(dealer.getList, options));
router.get('/:dealerId', handler(dealer.getDetails, options));
router.post('/', handler(dealer.create, options));
router.put('/:dealerId', handler(dealer.update, options));
