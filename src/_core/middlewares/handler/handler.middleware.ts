import {Request} from 'express';
import {EError, MVError} from '../../classes/mverror/MVError';
import {Result, ValidationError, validationResult} from 'express-validator';

// handler options
export type HandlerOptions = {
  scopes?: string[];
};

/**
 * Coverts ValidationError to IError (Error type based on Google Styles)
 * @param errors Validation Errors
 * @returns returns and array of errors
 */
function validationErrToError(errors: Result<ValidationError>): EError[] {
  const errorsRes: EError[] = [];
  errors.array().forEach(err => {
    if (err.type == 'alternative_grouped') {
      err.nestedErrors.flat().forEach(err => {
        errorsRes.push({
          message: err.msg,
        });
      });
    } else {
      errorsRes.push({
        message: err.msg,
      });
    }
  });
  return errorsRes;
}

// handler middleware
export const HandlerMiddleware = (
  fn: CallableFunction,
  options: HandlerOptions = {}
) =>
  function asyncUtilWrap(...args: any) {
    const request: Request = args[0];
    const next = args[args.length - 1];

    try {
      // check for validation error
      const errors = validationResult(request);
      console.log(errors, 'errors');
      
      if (!errors.isEmpty()) {
        const validationErrors = validationErrToError(errors);
        throw new MVError({
          http_code: 422,
          error_code: 422,
          errors: validationErrors,
          message: 'Invalid Inputs',
        });
      }

      console.log('validation passed');
      

      // auth checks
      if (options.scopes) {
        // authorized token's scopes
        let token_scopes: string[] = [];
        if (request.token_payload) {
          if (request.token_payload.mv_scopes) {
            token_scopes = request.token_payload.mv_scopes;
          }
        }

        console.log(options.scopes, options.scopes?.length > 0, 'scopes');
        
        // verification
        if (options.scopes && options.scopes.length > 0) {
          // verification of scopes is requested
          const result = options.scopes.every(val =>
            token_scopes.includes(val)
          );
          if (!result) {
            throw new MVError({
              http_code: 401,
              error_code: 1001,
              message:
                'Token does not have sufficient permissions to access this api',
            });
          }
        }
      }
    } catch (err) {
      next(err);
      return;
    }

    //
    const fnReturn = fn(...args);
    return Promise.resolve(fnReturn).catch(next);
  };
