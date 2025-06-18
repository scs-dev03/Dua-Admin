import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index, JoinColumn, ManyToOne } from "typeorm";
import { _Entity } from "../_Entity";
import { IntegratedPortal } from "./IntegratedPortal";
import { User } from "./User";

@Entity("user_portals")
@Index(["user_id", "portal_id"], { unique: true })
export class UserPortal extends _Entity {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ type: "bigint", unsigned: true })
  user_id: number;

  @Column({ type: "bigint", unsigned: true })
  portal_id: number;

  @Column({ type: "nvarchar", nullable: false, default: '{}' })
  report_config: string;
  // report_config: Record<number, boolean>;

  @Column({ type: "nvarchar", nullable: false, default: '{}' })
  runtime_config: any;

  @ManyToOne(() => User, (user) => user.userPortals)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => IntegratedPortal, (portal: IntegratedPortal) => portal.userPortals)
  @JoinColumn({ name: "portal_id" })
  portal: IntegratedPortal;

    // 🛠️ Constructor to set defaults
  constructor() {
    super();
    this.runtime_config = {};
  }
}
