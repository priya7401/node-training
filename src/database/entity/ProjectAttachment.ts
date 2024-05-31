import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { ProjectAttachmentType } from '../../config/appConstants';
import { Attachment } from './Attachment';
import { Project } from './Project';

@Entity('project_attachments')
export class ProjectAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.project_attachments)
  @JoinColumn({ foreignKeyConstraintName: 'project_id' })
  project: Project;

  @OneToOne(() => Attachment, { cascade: ['remove'] })
  @JoinColumn({ foreignKeyConstraintName: 'attachment_id' })
  attachment: Attachment;

  @Column({ type: 'enum', enum: ProjectAttachmentType })
  project_attachment_type: ProjectAttachmentType;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
