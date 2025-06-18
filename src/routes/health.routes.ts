// external
import express from 'express';

// internal
import {HandlerMiddleware as handler} from '../_core/middlewares/handler/handler.middleware';
import {HealthController} from '../controllers/health/health.controller';

// router
export const router = express.Router();

// health routes
const health = new HealthController();
router.get('/ping', handler(health.ping));
