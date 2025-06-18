import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import {_Entity} from '../_Entity';
import {User} from './User';

@Entity('installations')
export class Installation extends _Entity {
  @PrimaryGeneratedColumn({type: 'bigint', unsigned: true})
  id: number;

  @Column({type: 'bigint', unsigned: true})
  userId: number;

  @Column({type: 'int', unsigned: true, default: 0})
  installStatus: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.installations, {eager: true})
  @JoinColumn({name: 'userId'})
  user: User;
}
