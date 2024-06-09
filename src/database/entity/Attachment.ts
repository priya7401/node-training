import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, AfterLoad, AfterInsert } from 'typeorm';
import { getDownloadUrl } from '../../utils/awsConfig';

@Entity('attachments')
export class Attachment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  file_name: string;

  @Column()
  file_type: string;

  @Column({ unique: true })
  s3_key: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  private s3_url: string;

  @AfterLoad()
  @AfterInsert()
  updateS3Url = async () => {
    this.s3_url = await getDownloadUrl(this.s3_key);
  };

  get _s3_url(): string {
    return this.s3_url;
  }
}
