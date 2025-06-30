import {NextFunction, Request, Response} from 'express';

/**
 * Request logger middleware.
 *
 * @returns express middleware
 */
export const RequestLoggerMiddleware = function () {
  return (request: Request, response: Response, next: NextFunction) => {
    const startTime = new Date().getTime();
    request.log.info({reqId: request.id}, 'Request started');

    // callbacks
    const finished = () => {
      request.log.info(
        {
          reqId: request.id,
          responseTime: new Date().getTime() - startTime,
          statusCode: response.statusCode,
        },
        'Request completed'
      );
    };
    const errored = () => {
      request.log.error(
        {
          reqId: request.id,
          responseTime: new Date().getTime() - startTime,
          statusCode: response.statusCode,
        },
        'Request errored'
      );
    };
    //

    // removing existing listeners
    response.removeListener('error', errored);
    response.removeListener('finish', finished);

    //
    response.on('finish', finished);
    response.on('error', errored);
    if (next) {
      next();
    }
  };
};
