import 'reflect-metadata';
import {DataSource, DataSourceOptions} from 'typeorm';

export type DBProviderOptions = {} & Partial<DataSourceOptions>;

/**
 * DB Provider class
 *
 */
export class DBProvider {
  /** TypeORM datasource */
  public datasource: DataSource;

  /**
   * The constructor of the `DBProvider` class.
   *
   * @param options
   */
  constructor(options: DBProviderOptions) {
    this.datasource = new DataSource(options as DataSourceOptions);
  }

  /**
   * Initialize TypeORM datasource.
   *
   */
  async init() {
    await this.datasource.initialize();
  }
}
