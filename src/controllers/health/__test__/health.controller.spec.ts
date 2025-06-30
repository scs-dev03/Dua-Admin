import {Request, Response} from 'express';

// setup
let request: any;
let response: any;
let controller: any;
beforeEach(() => {
  response = {
    setHeader: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as Partial<Response>;

  const {HealthController} = require('../health.controller');
  controller = new HealthController();
});

// teardown
afterEach(() => {
  jest.resetAllMocks();
});

// health ping function
describe('ping function', () => {
  //
  it('should return 200 --> ', async () => {
    await controller.ping(request as Partial<Request>, response);
    expect(response.setHeader).toBeCalledWith(
      'Content-Type',
      'application/json'
    );
    expect(response.status).toBeCalledWith(200);
    expect(response.send).toBeCalledWith(
      JSON.stringify({data: {message: 'ok'}})
    );
  });
});
