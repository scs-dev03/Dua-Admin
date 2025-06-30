import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { _Entity } from "../_Entity";
import { Brand } from "./Brand";
import { Warehouse } from "./Warehouse";

@Entity("dealers")
export class Dealer extends _Entity {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  name: string;

  @Column({ type: "bigint", unsigned: true, nullable: false })
  brand_id: number;

  @ManyToOne(() => Brand, (brand) => brand.dealers, { nullable: false })
  @JoinColumn({ name: "brand_id" })
  brand: Brand;

  @OneToMany(() => Warehouse, (warehouse) => warehouse.dealer)
  warehouses: Warehouse[];
}
