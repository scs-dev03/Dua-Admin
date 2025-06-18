// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import {MediaController} from '../controllers/media/media.controller';
import {fileUploadMiddleware} from '../_providers';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};
const media = new MediaController();

router.get('/:filename', handler(media.download, options))

router.post(
  '/upload',
  fileUploadMiddleware.single('action_sheet'),
  handler(media.upload, options)
);

router.delete('/:filename', handler(media.delete, options))