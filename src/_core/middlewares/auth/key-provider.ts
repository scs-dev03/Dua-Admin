import jwkToPem from 'jwk-to-pem';
import {JwtHeader, Secret} from 'jsonwebtoken';
import superagent from 'superagent';

/**
 * Key provider class for Auth middleware.
 * caches keys locally & if not found.
 *
 */
export class KeyProvider {
  /** local cached keys. */
  private keys: any = [];

  /** url to the jwks. */
  private jwks_url: string;

  /**
   * The constructor of the `KeyProvider` class.
   *
   * @param jwks_url url to jwks endpoint
   */
  constructor(jwks_url: string) {
    this.jwks_url = jwks_url;
    // this.fetchKeys();
  }

  /**
   * Function to fetch & store keys locally from remote
   *
   */
  public async fetchKeys() {
    console.log('fetching keys...');
    const resp: any = await superagent.get(this.jwks_url);
    if (resp) {
      this.keys = resp.body.keys;
    }
  }

  /**
   * return key for a key id.
   *
   * @param header jwt header
   *
   * @returns Promise<Secret>
   */
  public async getKey(header: JwtHeader): Promise<Secret> {
    try {
      let key: any;
      if (this.keys && Array.isArray(this.keys)) {
        // eslint-disable-next-line eqeqeq
        key = this.keys.find((key: any) => key.kid == header.kid);
        if (key) {
          return Promise.resolve(jwkToPem(key));
        }
      }
      await this.fetchKeys();
      if (this.keys && Array.isArray(this.keys)) {
        // eslint-disable-next-line eqeqeq
        key = this.keys.find((key: any) => key.kid == header.kid);
        if (key) {
          return Promise.resolve(jwkToPem(key));
        } else {
          throw new Error('Key not found!');
        }
      }
      throw new Error('Could not find keys to validate token');
    } catch (err: any) {
      throw new Error(err);
    }
  }
}
