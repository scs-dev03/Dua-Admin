import {NextFunction, Request, Response} from 'express';
import {v4} from 'uuid';
import {MVError} from '../../classes/mverror/MVError';

/**
 * Global Error handler middleware.
 *
 * @returns express middleware
 */
export const ErrorHandlerMiddleware = function () {
  return (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    // send to logs
    request.log?.error(
      {reqId: request.id, errorID: v4(), stack: JSON.stringify(error.stack)},
      error.message
    );

    const err: {code: number} & Partial<MVError> = {
      code: 500,
      message: 'Internal server error',
      stack: error.stack,
    };

    if (error instanceof MVError) {
      err.code = error.error_code;
      err.message = error.message;
      err.errors = error.errors;
      response.status(error.http_code).send({
        error: err,
      });
    } else {
      response.status(err.code).send({
        error: err,
      });
    }

    next();
  };
};
