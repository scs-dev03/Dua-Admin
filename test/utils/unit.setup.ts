// important
// process.env.NODE_ENV = 'test';

import path from 'path';

global.isValidJSON = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

// global setup
beforeAll(() => {
  jest.mock('pino');
});

// global teardown
afterAll(() => {
  jest.resetAllMocks();
});

// test data directories
global.test_data_dir = path.join(process.cwd(), 'test', 'data');
global.workunit_test_data_dir = path.join(global.test_data_dir, 'workunit');
