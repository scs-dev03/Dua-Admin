// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import { PortalController } from '../controllers/portal/portal.controller';
import { PortalReportController } from '../controllers/portal/portal-report.controller';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};

export const portal = new PortalController();
export const reports = new PortalReportController()

router.get('/report', handler(reports.getListByPortal, options))

router.get('/', handler(portal.getList, options));
router.get('/:portalId', handler(portal.getDetails, options));
router.post('/', handler(portal.create, options));
router.put('/:portalId', handler(portal.update, options));


router.get('/:portalId/report', handler(reports.getList, options));
router.get('/:portalId/report/:reportId', handler(reports.getDetails, options));
router.post('/:portalId/report', handler(reports.create, options));
router.put('/:portalId/report/:reportId', handler(reports.update, options));
router.patch('/:portalId/report/:reportId', handler(reports.updateActionSheet, options));
