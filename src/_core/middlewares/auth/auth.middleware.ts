import {Request, Response, NextFunction} from 'express';
import {unless} from 'express-unless';
import {Jwt, JwtPayload} from 'jsonwebtoken';

import {MVError} from '../../classes/mverror/MVError';
import {jwtService} from '../../../_providers';

/**
 * An interface that extends {@link express | `express`}
 * and adds decoded jwt payload.
 *
 */
declare module 'express' {
  export interface Request {
    /** decoded jwt payload. */
    token_payload?: MVJwtPayload;
  }
}

/**
 * A type that extends {@link 'JwtPayload' | `JwtPayload`}
 * and adds decoded jwt payload.
 *
 */
export type MVJwtPayload = {
  oid: number;
  mv_scopes: string[];
} & Partial<JwtPayload>;

/**
 * JWT Auth Middleware.
 * decodes, verifies and attaches the decoded payload to request object.
 * @returns express middleware
 */
export const AuthMiddleware = async function () {
  const middleware = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    /** HTTP Auth Header. */
    const authHeader =
      request.headers && 'Authorization' in request.headers
        ? 'Authorization'
        : 'authorization';
    try {
      if (authHeader) {
        let parts = [];
        if (!(request.headers && request.headers[authHeader])) {
          throw new Error('Token is required');
        }
        const headerValue = request.headers[authHeader] as string;
        if (headerValue && headerValue.indexOf(' ') > -1) {
          parts = headerValue.split(' ');
        } else {
          throw new Error('Bad format');
        }
        if (parts.length === 2) {
          const scheme = parts[0];
          const token = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            // verifying now
            request.log.info({reqId: request.id}, 'Verifying token');

            // throws if error
            const finalPayload: MVJwtPayload = (await jwtService.verify(
              token
            )) as MVJwtPayload;

            // adding mv_scopes
            finalPayload.mv_scopes = [];
            if ((finalPayload as any)?.scp) {
              finalPayload.mv_scopes = (finalPayload as any).scp.split(' ');
            }

            //
            if (!finalPayload.oid) {
              throw new MVError({
                http_code: 403,
                error_code: 100,
                message: 'missing oid claim from token',
              });
            }

            //
            request.log.info(
              {reqId: request.id, user: {oid: finalPayload.oid}},
              'Token verified'
            );

            // attaching to request object
            request.token_payload = finalPayload;
            next();
          }
        } else {
          throw new MVError({
            http_code: 401,
            error_code: 401,
            message: 'Invalid format',
          });
        }
      }
    } catch (err: any) {
      if (err instanceof MVError) {
        next(err);
      } else {
        next(
          new MVError({
            http_code: 401,
            error_code: 401,
            stack: err.stack,
            message: err.message,
          })
        );
      }
    }
  };

  // adding express-unless support
  middleware.unless = unless;

  //
  return middleware;
};
