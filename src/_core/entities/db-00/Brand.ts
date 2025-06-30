import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { _Entity } from '../_Entity';
import { Dealer } from './Dealer';
import {IntegratedPortal} from './IntegratedPortal';

@Entity('brands')
export class Brand extends _Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => Dealer, (dealer) => dealer.brand)
  dealers: Dealer[];

@OneToMany(() => IntegratedPortal, portal => portal.brand)
portals: IntegratedPortal[];
}
