import pino from 'pino';
import {hostname} from 'os';
import process from 'process';
import {DBProvider, DBProviderOptions} from './_core/providers/db/db.provider';
import {config} from './_config';
import {LogFileTransportOptions} from './_core/transports/logfile/logfile.transport';
import dayjs from 'dayjs';
import path, {join} from 'path';
import {JWTService, JWTServiceOptions} from './services/jwt/jwt.service';
import {Algorithm, SignOptions} from 'jsonwebtoken';
import {PasswordService} from './services/password/password.service';
import multer from 'multer';
import {v4} from 'uuid';
import fs from 'fs';


// logger
const logfileOptions: LogFileTransportOptions = {
  file_prefix: config.get('misc.log_file_prefix'),
  directory: config.get('storage.logs'),
  hostname: hostname(),
  pid: process.pid,
};
const logger = pino({
  timestamp: () => {
    const day = dayjs();
    return (
      ', "time":' +
      day.valueOf() +
      ', "readabletime": "' +
      day.format('YYYY-MM-DD[,] HH:mm:ss[.]SSS[,] [UTC]Z') +
      '"'
    );
  },
  transport: {
    target: './_core/transports/logfile/logfile.transport',
    options: logfileOptions,
  },
});

// db00
// const db00Options: DBProviderOptions = {
//   type: 'mysql',
//   host: config.get('db00.host'),
//   port: config.get('db00.port'),
//   database: config.get('db00.dbname'),
//   cache: false,
//   synchronize: true,
//   entities: [join(__dirname, '_core/entities/db-00/**/*.{js,ts}')],
//   migrations: [join(__dirname, 'migrations/db-00/**/*.{js,ts}')],
//   username: config.get('db00.username'),
//   password: config.get('db00.password'),
//   extra: {
//     options: {
//       useUTC: true,
//     },
//   },
// };



// For mssql 
import { DataSource } from 'typeorm';

const db00 = new DataSource({
  type: 'mssql',
  host: config.get('db00.host'),
  port: config.get('db00.port'),
  username: config.get('db00.username'),
  password: config.get('db00.password'),
  database: config.get('db00.dbname'),
  synchronize: true, // disable this in prod
  entities: [join(__dirname, '_core/entities/db-00/**/*.{ts,js}')],
  migrations: [join(__dirname, 'migrations/db-00/**/*.{ts,js}')],
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
    encrypt: false,
    useUTC: true,
  },
});

db00
  .initialize()
  .then(() => console.log('MSSQL connection established via TypeORM'))
  .catch((err) => {
    console.error('MSSQL connection failed:', err.message);
    process.exit(1);
  });

// jwt service
const signOptions: SignOptions = {
  issuer: config.get('jwt.issuer') as string,
  audience: config.get('jwt.audience') as string,
  expiresIn: '1d',
  algorithm: config.get('jwt.algorithm_1') as Algorithm,
};
const jwtServiceOptions: JWTServiceOptions = {
  privateKeyPath: config.get('jwt.private_key_path'),
  publicKeyPath: config.get('jwt.public_key_path'),
};
const jwtService: JWTService = new JWTService(jwtServiceOptions, signOptions);

const passwordService = new PasswordService();

// file upload middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = config.get('storage.temp_uploads');
    if (req.originalUrl.indexOf('/report') > -1) {
      const match = req.originalUrl.match(/\/user\/(\d+)\/report/);
      if (match) {
        const userId = match[1];
        path = join(config.get('storage.report_uploads'), userId);
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      } else {
        path = config.get('storage.report_uploads');
      }
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, v4() + path.extname(file?.originalname));
  },
});


// const fileUploadMiddleware = multer({storage});

const fileUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});


// exports
export {
  db00, logger, jwtService, passwordService,
  fileUploadMiddleware
};

