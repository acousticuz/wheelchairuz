import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export type HomeSectionType =
  | 'hero'
  | 'stats'
  | 'search'
  | 'categories'
  | 'featured'
  | 'testimonials'
  | 'cta'
  | 'about'
  | 'banner'
  | 'spacer';

@Entity('home_sections')
@Index(['sortOrder'])
export class HomeSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Unique identifier for this section instance (e.g. 'main-hero',
  // 'product-cta-band'). Allows multiple sections of the same type.
  @Column({ unique: true })
  key: string;

  @Column()
  type: HomeSectionType;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  // Free-form per-type settings (texts in uz/ru/en, image URLs, options).
  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
