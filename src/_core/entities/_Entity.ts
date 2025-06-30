import {BaseEntity} from 'typeorm';

/**
 * Wrapper class for Typeorm BaseEntity {@link BaseEntity | `BaseEntity`}.
 */
export class _Entity extends BaseEntity {
  /**
   * Returns table name of the entity.
   *
   * @returns name of the table in database.
   */
  static get table_name() {
    return this.getRepository().metadata.tableName;
  }
}
