import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  sku: string;

  @Column({ type: 'jsonb', default: {} })
  name: { uz: string; ru: string; en: string };

  @Column({ type: 'jsonb', default: {} })
  excerpt: { uz: string; ru: string; en: string };

  @Column({ type: 'jsonb', default: {} })
  description: { uz: string; ru: string; en: string };

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  price: number;

  @Column({ default: true })
  showPrice: boolean;

  @Column({ nullable: true })
  mainImage: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ type: 'jsonb', default: [] })
  specs: Array<{
    label_uz: string;
    label_ru: string;
    label_en: string;
    value: string;
  }>;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ nullable: true })
  badge: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
