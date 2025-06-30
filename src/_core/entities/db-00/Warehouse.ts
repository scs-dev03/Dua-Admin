import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { _Entity } from '../_Entity';
import { Dealer } from './Dealer';
import { UserWarehouse } from './UserWarehouse';

@Entity('warehouses')
export class Warehouse extends _Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({type: 'bigint', unsigned: true, nullable: false})
  dealer_id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ManyToOne(() => Dealer, (dealer) => dealer.warehouses, {nullable: false})
  @JoinColumn({ name: 'dealer_id' })
  dealer: Dealer;

  @OneToMany(() => UserWarehouse, (userWarehouse) => userWarehouse.warehouse)
  userWarehouses: UserWarehouse[];
}
