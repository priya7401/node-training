import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ProjectStatus } from '../../config/appConstants';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reg_num: string;

  @Column()
  temple_name: string;

  @Column()
  location: string;

  @Column()
  temple_incharge_name: string;

  @Column()
  temple_incharge_number: string;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.proposed })
  status: ProjectStatus;

  @Column({ type: 'timestamptz', nullable: true })
  start_date: Date;

  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date;

  @Column({ nullable: true })
  estimated_amount: number;

  @Column({ nullable: true })
  expensed_amount: number;

  @Column({ nullable: true })
  scrapped_reason: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
