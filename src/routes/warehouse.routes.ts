// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import { WarehouseController } from '../controllers/warehouse/warehouse.controller';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};

export const warehouse = new WarehouseController();

router.get('/', handler(warehouse.getList, options));
router.get('/:warehouseId', handler(warehouse.getDetails, options));
router.post('/', handler(warehouse.create, options));
router.put('/:warehouseId', handler(warehouse.update, options));
