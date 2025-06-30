import {Request, Response} from 'express';

/**
 * Class for health routes.
 */
export class HealthController {
  constructor() {}

  /**
   * ping
   */
  ping = async (request: Request, response: Response) => {
    response
      .status(200)
      .setHeader('Content-Type', 'application/json')
      .send(
        JSON.stringify({
          data: {
            message: 'ok',
          },
        })
      );
  };
}
