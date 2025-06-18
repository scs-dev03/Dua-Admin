import {AuthMiddleware} from '../auth.middleware';

describe('failure tests', () => {
  //
  it('should throw if options not sent', async () => {
    try {
      // @ts-ignore
      await AuthMiddleware();
    } catch (e: any) {
      expect(e);
      expect(e.message).toEqual(
        'auth-middleware: `jwks_url` is a required option'
      );
    }
  });

  //
  it('should throw if jwks_url is not a valid url', async () => {
    try {
      // @ts-ignore
      await AuthMiddleware({
        jwks_url: 'http/url',
      });
    } catch (e: any) {
      expect(e);
      expect(e.message).toEqual(
        'auth-middleware: `jwks_url` must be a valid url'
      );
    }
  });

  //
  it('should throw if audience is not sent', async () => {
    try {
      // @ts-ignore
      await AuthMiddleware({jwks_url: 'https://url.com'});
    } catch (e: any) {
      expect(e);
      expect(e.message).toEqual(
        'auth-middleware: `audience` is a required option'
      );
    }
  });

  //
  it('should throw if issuer is not sent', async () => {
    try {
      // @ts-ignore
      await AuthMiddleware({jwks_url: 'https://url.com', audience: 'audience'});
    } catch (e: any) {
      expect(e);
      expect(e.message).toEqual(
        'auth-middleware: `issuer` is a required option'
      );
    }
  });

  //
  it('should throw if algorithms is not sent', async () => {
    try {
      // @ts-ignore
      await AuthMiddleware({
        jwks_url: 'https://url.com',
        audience: 'audience',
        issuer: 'issuer',
      });
    } catch (e: any) {
      expect(e);
      expect(e.message).toEqual(
        'auth-middleware: `algorithms` is a required option'
      );
    }
  });

  //
  it('should throw if algorithms is not an array', async () => {
    try {
      // @ts-ignore
      await AuthMiddleware({
        jwks_url: 'https://url.com',
        audience: 'audience',
        issuer: 'issuer',
        // @ts-ignore
        algorithms: 'x',
      });
    } catch (e: any) {
      expect(e);
      expect(e.message).toEqual(
        'auth-middleware: `algorithms` must be an array'
      );
    }
  });
});
