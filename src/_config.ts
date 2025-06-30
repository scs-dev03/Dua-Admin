import fs from 'fs';
import dotenv from 'dotenv';

const convict = require('convict');

// environment
if (process.env.NODE_ENV === 'test') {
  dotenv.config({path: '.env.test'});
} else {
  dotenv.config({path: '.env'});
}
//

// global config
export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    address: {
      doc: 'Server bind Address',
      format: String,
      default: null,
      env: 'SERVER_ADDRESS',
    },
    // port: {
    //   doc: 'Server port.',
    //   format: 'int',
    //   default: null,
    //   env: 'SERVER_PORT',
    // },\
    port: {
  doc: 'Server port.',
  format: String,
  default: parseInt(process.env.PORT || '3007'),  // Fallback for local dev
  env: 'PORT',  // THIS MUST BE PORT (not SERVER_PORT)
},

    cluster_size: {
      doc: 'Cluster size.',
      format: 'int',
      default: null,
      env: 'SERVER_CLUSTER_SIZE',
    },
    json_request_body_limit: {
      doc: 'JSON Request body limit',
      format: String,
      default: null,
      env: 'SERVER_JSON_REQUEST_BODY_LIMIT',
    },
  },
  jwt: {
    algorithm_1: {
      doc: 'First supported algorithm for jwt',
      format: String,
      default: null,
      env: 'JWT_ALGORITHM_1',
    },
    issuer: {
      doc: 'JWT Issuer',
      format: String,
      default: null,
      env: 'JWT_ISSUER',
    },
    audience: {
      doc: 'JWT Audience',
      format: String,
      default: null,
      env: 'JWT_AUDIENCE',
    },
    jwks_url: {
      doc: 'JWKS URL',
      format: String,
      default: null,
      env: 'JWT_JWKS_URL',
    },
    public_key_path: {
      doc: 'Public key path',
      format: String,
      default: null,
      env: 'JWT_PUBLIC_KEY_PATH',
    },
    private_key_path: {
      doc: 'Private key path',
      format: String,
      default: null,
      env: 'JWT_PRIVATE_KEY_PATH',
    },
  },
  db00: {
    host: {
      doc: 'Database server hostname',
      format: String,
      default: null,
      env: 'DB_HOST',
    },
    port: {
      doc: 'Database server port',
      format: 'int',
      default: null,
      env: 'DB_PORT',
    },
    dbname: {
      doc: 'Database name',
      format: String,
      default: null,
      env: 'DB_NAME',
    },
    username: {
      doc: 'Database username',
      format: String,
      default: '',
      env: 'DB_USER',
    },
    password: {
      doc: 'Database password',
      format: String,
      default: '',
      env: 'DB_PASSWORD',
    },
    pool: {
      min: {
        doc: 'Minimum Database connection pool size',
        format: 'int',
        default: null,
        env: 'DB_POOL_MIN',
      },
      max: {
        doc: 'Maximum Database connection pool size',
        format: 'int',
        default: null,
        env: 'DB_POOL_MAX',
      },
    },
  },
  storage: {
    logs: {
      doc: 'Logs directory',
      format: String,
      default: null,
      env: 'LOGS_DIR',
    },
    temp_uploads: {
      doc: 'temporary directory for file uploads',
      format: String,
      default: null,
      env: 'STORAGE_TEMP_UPLOADS',
    },
    report_uploads: {
      doc: 'directory for report uploads',
      format: String,
      default: null,
      env: 'STORAGE_REPORT_UPLOADS',
    },
  },
  misc: {
    log_file_prefix: {
      doc: 'prefix for log files',
      format: String,
      default: 'log',
      env: 'LOG_FILE_PREFIX',
    },
  },
});

// validating
try {
  // initial validation
  config.validate({allowed: 'strict'});

  // validations for jwt
  if (config.get('jwt.algorithm_1')) {
    if (config.get('jwt.algorithm_1') !== 'RS256') {
      throw new Error('Currently only RS256 is allowed as JWT Algorithm.');
    }
  }

  // validations for storage options
  if (process.env.NODE_ENV !== 'test') {
    if (!fs.existsSync(config.get('storage.logs'))) {
      throw new Error(
        'STORAGE_LOGS_DIR should be a valid accessible directory!'
      );
    }
    if (!fs.existsSync(config.get('storage.temp_uploads'))) {
      throw new Error(
        'STORAGE_TEMP_UPLOADS should be a valid accessible directory!'
      );
    }
    if (!fs.existsSync(config.get('jwt.public_key_path'))) {
      throw new Error(
        'JWT_PUBLIC_KEY_PATH should be a valid accessible directory!'
      );
    }
    if (!fs.existsSync(config.get('jwt.private_key_path'))) {
      throw new Error(
        'JWT_PRIVATE_KEY_PATH should be a valid accessible directory!'
      );
    }
  }

  //
} catch (err: any) {
  console.error(err.message);
  throw err;
}
