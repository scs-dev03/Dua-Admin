// external
import express from "express";

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions
} from "../_core/middlewares/handler/handler.middleware";
import { UserController } from "../controllers/user/user.controller";
import { fileUploadMiddleware } from "../_providers";
import { dealer } from "./dealer.routes";

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: []
};

export const user = new UserController();


router.get("/", handler(user.getList, options));
router.post("/", handler(user.create, options));
router.get("/download", handler(user.downloadActionSheets, options));

router.post("/:userId/report", fileUploadMiddleware.single("file"), handler(user.uploadReport, options));
router.post("/:userId/portal-report", handler(user.assignReport, options));
router.get("/:userId/portal-report", handler(user.getAssignedPortalReports, options));
router.post("/:userId/portal/:portalId/config", handler(user.updatePortalRuntimeConfig, options));

router.get("/:userId/config", handler(user.getConfig, options));
router.put("/:userId", handler(user.update, options));
router.get("/:userId", handler(user.getDetails, options));