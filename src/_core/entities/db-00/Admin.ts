import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {_Entity} from '../_Entity';

@Entity('admins')
export class Admin extends _Entity {
  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  id: number;

  @Column({type: 'varchar', length: 150, unique: true})
  email: string;

  @Column({type: 'bigint', unsigned: true, unique: true})
  mobile: number;

  @Column({type: 'varchar', length: 150, nullable: false})
  password: string;
}
