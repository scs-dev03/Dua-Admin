import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';

const cors = require('cors');
const logger = require('pino-http')();

// middlewares
import {AuthMiddleware} from './_core/middlewares/auth/auth.middleware';
import {ErrorHandlerMiddleware} from './_core/middlewares/error-handler/error-handler.middleware';
import {RequestLoggerMiddleware} from './_core/middlewares/request-logger/request-logger.middleware';

// routes
import {router as authRouter} from './routes/auth.routes';
import {router as healthRouter} from './routes/health.routes';
import {router as brandRouter} from './routes/brand.routes';
import {router as dealerRouter} from './routes/dealer.routes';
import {router as warehouseRouter} from './routes/warehouse.routes';
import {router as userRouter} from './routes/user.routes';
import {router as portalRouter} from './routes/portal.routes';
import {router as mediaRouter} from './routes/media.routes';
import {router as configRouter} from './routes/config.routes';
import {config} from './_config';

//
export interface ServerOptions {
  json_request_body_limit: string;
}

// configuration for global application
export interface AppConfig {
  server: ServerOptions;
  logger: any;
}

// app builder
export const build = async (opts: AppConfig) => {
  // application
  const app = express();

  // middlewares

  // app.use(cors());
  // app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
  // app.use(bodyParser.json({limit: opts.server.json_request_body_limit}));
  // app.use((req, res, next) => {
  //   logger(req, res);
  //   next();
  // });

  app.use(
    cors({
      origin: '*', // or specify allowed origins
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
  app.options('*', cors()); // 🔥 This line is critical for handling preflight
  app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}));
  app.use(bodyParser.json({limit: opts.server.json_request_body_limit}));
  app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));

  app.use((req, res, next) => {
    logger(req, res);
    next();
  });

  // uploaded files
  app.use(
    '/api/v1/media/uploads/',
    express.static(config.get('storage.temp_uploads'))
  );

  // request lifecycle logs
  app.use(RequestLoggerMiddleware());

  // auth
  // app.use(
  //   (await AuthMiddleware()).unless({
  //     path: ['/api/health/ping', /^\/api\/v1\/auth/,
  //       //  /^\/api\/v1\/media/,/^\/api\/v1\/site/
  //     ],
  //   })
  // );

  // setting global content type
  app.use((req, res, next) => {
    res.contentType('application/json');
    next();
  });

  // routes
  app.use('/api/health', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/brand', brandRouter);
  app.use('/api/v1/dealer', dealerRouter);
  app.use('/api/v1/warehouse', warehouseRouter);
  app.use('/api/v1/user', userRouter);
  app.use('/api/v1/portal', portalRouter);
  app.use('/api/v1/media', mediaRouter);
  app.use('/api/v1/config', configRouter);

  // error handler
  app.use(ErrorHandlerMiddleware());

  return app;
};
