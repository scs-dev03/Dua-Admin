import {Request, Response} from 'express';
import {RequestLoggerMiddleware} from '../request-logger.middleware';

let request: any;
let response: any;
let nextFunction: any;
beforeEach(() => {
  request = {
    log: {
      info: jest.fn(),
      error: jest.fn(),
    },
  };
  response = {
    on: jest.fn(),
    removeListener: jest.fn(),
  };
  nextFunction = jest.fn();
});

describe('request logger middleware', () => {
  it('should --> remove listeners', () => {
    const middleware = RequestLoggerMiddleware();
    middleware(request as Request, response as Response, nextFunction);
    expect(response.removeListener).toHaveBeenCalledTimes(2);
    expect(response.removeListener.mock.calls[0][0]).toBe('error');
    expect(response.removeListener.mock.calls[1][0]).toBe('finish');
    expect(typeof response.removeListener.mock.calls[0][1]).toBe('function');
    expect(typeof response.removeListener.mock.calls[1][1]).toBe('function');
  });

  it('should --> attach listeners to request lifecycle', () => {
    const middleware = RequestLoggerMiddleware();
    middleware(request as Request, response as Response, nextFunction);
    expect(response.removeListener).toHaveBeenCalledTimes(2);
    expect(response.on.mock.calls[1][0]).toBe('error');
    expect(response.on.mock.calls[0][0]).toBe('finish');
    expect(typeof response.on.mock.calls[0][1]).toBe('function');
    expect(typeof response.on.mock.calls[1][1]).toBe('function');
  });

  it('should --> call next function', () => {
    const middleware = RequestLoggerMiddleware();
    middleware(request as Request, response as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalled();
  });
});
