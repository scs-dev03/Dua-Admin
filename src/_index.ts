import {v4} from 'uuid';

import {build, AppConfig} from './app';
import {logger} from './_providers';
import {config} from './_config';

// options for app builder
const options: AppConfig = {
  // logger
  logger: {
    genReqId: function () {
      return v4();
    },
    logger: logger,
    serializers: {
      req: (req: any) => ({
        url: req.url,
        method: req.method,
      }),
      res: (res: any) => ({
        statusCode: res.statusCode,
      }),
    },
    autoLogging: false,
  },
  server: {
    json_request_body_limit: config.get('server.json_request_body_limit'),
  },
};

export const app = build(options);
