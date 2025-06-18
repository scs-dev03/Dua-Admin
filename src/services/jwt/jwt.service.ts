import {sign, verify, SignOptions, Jwt, JwtPayload} from 'jsonwebtoken';
import {readFileSync} from 'fs';
import {MVJwtPayload} from '../../_core/middlewares/auth/auth.middleware';

/**
 * JWTServiceOptions.
 */
export type JWTServiceOptions = {
  publicKeyPath: string;
  privateKeyPath: string;
};

/**
 * JWTService class provides methods for JWT generation and verification.
 */
export class JWTService {
  private privateKey: string;
  private publicKey: string;
  private signOptions: SignOptions;

  /**
   * Constructs a new JWTService instance.
   */
  constructor(options: JWTServiceOptions, signOptions: SignOptions) {
    // Configure sign options
    this.signOptions = signOptions;

    // Load private and public keys from file system
    this.privateKey = readFileSync(options.privateKeyPath, 'utf8');
    this.publicKey = readFileSync(options.publicKeyPath, 'utf8');
  }

  /**
   * Generates a JWT token.
   * @param payload - The payload data to be included in the JWT.
   * @returns The generated JWT token.
   */
  generate = (payload: MVJwtPayload): string => {
    return sign(payload, this.privateKey, this.signOptions);
  };

  /**
   * Verifies a JWT token.
   * @param token - The JWT token to be verified.
   * @returns A promise that resolves with the decoded payload if the token is valid, otherwise rejects with an error.
   */
  verify = (token: string): Promise<JwtPayload> => {
    return new Promise(
      (resolve: CallableFunction, reject: CallableFunction) => {
        verify(token, this.publicKey, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
            resolve(decoded);
          }
        });
      }
    );
  };
}
