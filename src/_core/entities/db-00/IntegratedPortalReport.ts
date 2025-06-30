import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { _Entity } from '../_Entity';
import { IntegratedPortal } from './IntegratedPortal';

@Entity('integrated_portal_reports')
export class IntegratedPortalReport extends _Entity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false })
  portal_id: number;

  @ManyToOne(() => IntegratedPortal, portal => portal.reports)
  @JoinColumn({ name: 'portal_id' })
  portal: IntegratedPortal;

  @Column({ type: 'varchar', length: 255, nullable: false })
  report_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  action_sheet_url: string;
}