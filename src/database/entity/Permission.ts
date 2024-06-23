import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ModuleType } from '../../config/appConstants';
import { Role } from '.';

@Entity('permissions')
@Unique(['role', 'module_name'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ModuleType })
  module_name: ModuleType;

  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'role_id', foreignKeyConstraintName: 'role_id' })
  role: Role;

  @Column({ default: false })
  can_create: boolean;

  @Column({ default: false })
  can_read: boolean;

  @Column({ default: false })
  can_update: boolean;

  @Column({ default: false })
  can_delete: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
