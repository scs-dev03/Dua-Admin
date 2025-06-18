// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import { BrandController } from '../controllers/brand/brand.controller';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};

export const brand = new BrandController();

router.get('/', handler(brand.getList, options));
router.get('/:brandId', handler(brand.getDetails, options));
router.post('/', handler(brand.create, options));
router.put('/:brandId', handler(brand.update, options));