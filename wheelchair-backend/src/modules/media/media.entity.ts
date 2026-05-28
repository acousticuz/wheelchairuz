import {
  Entity, PrimaryGeneratedColumn, Column, Index,
  CreateDateColumn,
} from 'typeorm';

@Index(['createdAt'])
@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column({ type: 'int' })
  size: number;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  alt: string;

  @CreateDateColumn()
  createdAt: Date;
}
