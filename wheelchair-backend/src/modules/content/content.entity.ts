import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('content_pages')
export class ContentPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'jsonb', default: {} })
  title: { uz: string; ru: string; en: string };

  @Column({ type: 'jsonb', default: {} })
  body: { uz: string; ru: string; en: string };

  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
