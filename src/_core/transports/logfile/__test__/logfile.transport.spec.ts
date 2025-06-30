import {Writable} from 'stream';
import {dirSync, DirResult} from 'tmp';

let temp_dir: DirResult;
beforeEach(() => {
  temp_dir = dirSync({unsafeCleanup: true});
});
afterEach(() => {
  temp_dir.removeCallback();
});

describe('logfile transport', () => {
  //
  it('should export function that returns writable stream', () => {
    expect.assertions(2);
    const transport = require('../logfile.transport');
    const stm = transport({
      file_prefix: 'fileprefix',
      hostname: 'hostname',
      pid: 102,
      directory: temp_dir.name,
    });
    expect(stm).toBeInstanceOf(Writable);
    expect(typeof transport).toBe('function');
  });

  //
  it('should throw error if wrong options supplied', () => {
    expect.assertions(1);
    const transport = require('../logfile.transport');
    const options = {
      file_prefix: '',
      hostname: 'hostname',
      pid: '102',
      directory: '',
    };
    try {
      transport(options);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  //
  it('should throw error if supplied directory not writable', () => {
    expect.assertions(1);
    const transport = require('../logfile.transport');
    const options = {
      file_prefix: 'prefix',
      hostname: 'hostname',
      pid: '102',
      directory: temp_dir.name + 'random',
    };
    try {
      transport(options);
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });
});
