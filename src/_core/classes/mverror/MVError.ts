// Expanded Error
export type EError = {
  domain?: string;
  reason?: string;
  message?: string;
  location?: string;
  locationType?: string;
  extendedHelper?: string;
  sendReport?: string;
};

/**
 * MVError constructor options.
 */
export interface MVErrorConstructorOptions {
  /** http error code. */
  http_code: number;

  /** api sub error code. */
  error_code: number;

  /** message to show on api error. */
  message: string;

  /** error stack */
  stack?: any;

  /** errors object */
  errors?: EError[];
}

/**
 * Universal error class for the project.
 *
 */
export class MVError extends Error {
  /** HTTP Error code to be thrown. */
  public http_code: number;

  /** Sub API Error code. */
  public error_code: number;

  /** errors object  */
  public errors: EError[];

  /**
   * The constructor of the `MVError` class.
   *
   * @param options constructor options
   */
  constructor(options: MVErrorConstructorOptions) {
    super(options.message);
    this.name = 'SB Error';
    this.http_code = options.http_code;
    this.error_code = options.error_code;
    if (options.stack) {
      this.stack = options.stack;
    }
    if (options.errors) {
      this.errors = options.errors;
    }
  }
}
