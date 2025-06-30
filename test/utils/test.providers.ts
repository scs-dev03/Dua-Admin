import {config} from '../../src/_config';
import {join} from 'path';
import {
  DBProvider,
  DBProviderOptions,
} from '../../src/_core/providers/db/db.provider';

const db00_options: DBProviderOptions = {
  type: 'mysql',
  host: config.get('db00.host'),
  database: config.get('db00.dbname'),
  synchronize: true,
  dropSchema: true,
  cache: false,
  entities: [
    join(__dirname, '../../src/_core/entities/db-00/**/*.ts'),
    join(__dirname, '../../src/_core/entities/db-00/**/*.js'),
  ],
  username: config.get('db00.username'),
  password: config.get('db00.password'),
};
export const db00 = new DBProvider(db00_options);
