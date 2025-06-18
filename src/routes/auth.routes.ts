// external
import express from 'express';

// internal
import {
  HandlerMiddleware as handler,
  HandlerOptions,
} from '../_core/middlewares/handler/handler.middleware';
import {AuthController} from '../controllers/auth/auth.controller';
import {oneOf} from 'express-validator';
import {
  isEmailValid,
  isMobileValid,
  isPasswordStrong,
  mobAndMailCantCoexist,
} from '../validators';

// router
export const router = express.Router();

// auth routes
const options: HandlerOptions = {
  scopes: [],
};
const auth = new AuthController();
router.get('/access-status', handler(auth.accessStatus, options));
router.post(
  '/login',
  [
    oneOf([isEmailValid, isMobileValid]),
    ...mobAndMailCantCoexist,
    ...isPasswordStrong,
  ],
  handler(auth.login, options)
);

router.post('/user/login', auth.userLogin)
router.put('/user/installation/:installationId', auth.userInstallationUpdate);