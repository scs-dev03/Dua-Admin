import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm';
import {_Entity} from '../_Entity';
import { UserWarehouse } from './UserWarehouse';
import { UserPortal } from './UserPortal';
import { Installation } from './Installation';

@Entity('Users') // ✅ Make sure this matches your actual DB table name
export class User {
  @PrimaryGeneratedColumn({type: 'int', unsigned: true})
  id: number;

  @Column({ type: 'nvarchar', length: 100 })
  name: string;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'nvarchar', length: 100 })
  password: string;

  @OneToMany(() => UserWarehouse, userWarehouse => userWarehouse.user)
  userWarehouses: UserWarehouse[];

  @OneToMany(
    () => Installation,
    (installation: Installation) => installation.user
  )
  installations: Installation[];

  @OneToMany(() => UserPortal, (userPortal: UserPortal) => userPortal.user)
  userPortals: UserPortal[];
}
