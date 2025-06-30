// just to be sure
process.env.NODE_ENV = 'test';

import pino from 'pino';
import {config} from '../../src/_config';
import {db00} from './test.providers';

// before all test suites
beforeAll(async () => {
  // test logger options
  const logger = pino({enabled: false});

  // mocking db
  await db00.init();
  jest.mock('../../src/_providers', () => ({
    logger: logger,
    db00: db00,
  }));

  // mocking app
  const {build} = require('../../src/app');
  const options = {
    // jwt
    jwt: {
      algorithms: [config.get('jwt.algorithm_1')],
      issuer: config.get('jwt.issuer'),
      audience: config.get('jwt.audience'),
      jwks_url: config.get('jwt.jwks_url'),
    },
    // logger
    logger: {
      logger: logger,
    },
    server: {},
  };
  global.app = await build(options);
});

// after all test suites
afterAll(() => {
  jest.clearAllMocks();
  db00.datasource.destroy();
  global.app = null;
});
