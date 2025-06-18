import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { _Entity } from '../_Entity';

interface RunEvery {
  start_time: string;
}

@Entity('configs')
export class Config extends _Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'nvarchar' })
  run_every: RunEvery[];

  @Column({ type: 'tinyint', default: 1 })
  headless: number;

  @Column({ type: 'varchar', length: 1024, default: null })
  download_path: string;
}
