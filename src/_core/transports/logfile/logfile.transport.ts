import {createStream, Options, RotatingFileStream} from 'rotating-file-stream';
import {randomBytes} from 'crypto';
import {accessSync, constants as fsconstants} from 'fs';
import dayjs from 'dayjs';

/**
 * Log file transport options.
 */
export interface LogFileTransportOptions {
  /** file name prefix. */
  file_prefix: string;

  /** system hostname. */
  hostname: string;

  /** process id. */
  pid: number;

  /** directory path for file. */
  directory: string;
}

/**
 * Custom Log file transport for Pino
 * Must be exported like this.
 * returns RotatingFileStream from package 'rotating-file-stream'.
 * @returns RotatingFileStream
 */
module.exports = (options: LogFileTransportOptions): RotatingFileStream => {
  /** validations. */
  if (
    !options.file_prefix ||
    !options.hostname ||
    !options.pid ||
    !options.directory
  ) {
    throw new Error(
      'inadequate options for LogFileTransport : ' + JSON.stringify(options)
    );
  }
  try {
    accessSync(options.directory, fsconstants.W_OK);
  } catch (err) {
    throw new Error('directory ' + options.directory + ' not writable');
  }
  //

  /** log file name generator. */
  const getLogFileName = () => {
    const day = dayjs();

    // default name for log file
    let logfilename =
      'log-' + day.valueOf() + '-' + randomBytes(5).toString('hex') + '.log';
    try {
      logfilename =
        options.file_prefix +
        ' - ' +
        options.hostname +
        ' - ' +
        day.format('YYYY-MM-DD') +
        ' ' +
        day.format('HH-mm-ss') +
        ' - ' +
        options.pid + // process id
        ' - ' +
        // for uniqueness, since a concurrent clash in filename throws error while rotation
        randomBytes(5).toString('hex') +
        '.log'; // extension
    } catch (err) {
      console.error(
        'Error formatting logfile name, falling back to default name'
      );
      console.error(err);
    }
    return logfilename;
  };

  // build & return RotatingFileStream
  const rfsOptions: Options = {
    path: options.directory,
    interval: '1d', // midnight rotation
  };
  return createStream(getLogFileName, rfsOptions);
};
