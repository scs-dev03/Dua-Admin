import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, JoinColumn, ManyToOne } from "typeorm";
import { _Entity } from "../_Entity";
import { User } from "./User";
import { Warehouse } from "./Warehouse";

@Entity('user_warehouses')
@Index(['user_id', 'warehouse_id'], { unique: true })
export class UserWarehouse extends _Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'bigint', unsigned: true })
  warehouse_id: number;

  @ManyToOne(() => User, (user) => user.userWarehouses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.userWarehouses)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;
}
