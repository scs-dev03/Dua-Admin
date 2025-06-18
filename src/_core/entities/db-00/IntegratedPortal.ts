import { Entity, Column, PrimaryGeneratedColumn, OneToMany,ManyToOne , JoinColumn} from 'typeorm';
import { _Entity } from '../_Entity';
import { IntegratedPortalReport } from './IntegratedPortalReport';
import { UserPortal } from "./UserPortal";
import {Brand} from './Brand';

export enum AuthType {
  BASIC = 'basic',
  CAPTCHA = 'captcha',
  OTP = 'otp',
}

@Entity('integrated_portals')
export class IntegratedPortal extends _Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({type: 'bigint', unsigned: true, nullable: false})
  brand_id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  url: string;

  // ✅ Store enum as string in MSSQL
  @Column({ type: 'nvarchar', length: 50, default: AuthType.BASIC, nullable: false })
  auth_type: AuthType;

  @OneToMany(() => IntegratedPortalReport, report => report.portal)
  reports: IntegratedPortalReport[];

  @OneToMany(() => UserPortal, (userPortal: UserPortal) => userPortal.portal)
  userPortals: UserPortal[];

  @ManyToOne(() => Brand, brand => brand.portals, {nullable: false})
  @JoinColumn({name: 'brand_id'})
  brand: Brand;
}
