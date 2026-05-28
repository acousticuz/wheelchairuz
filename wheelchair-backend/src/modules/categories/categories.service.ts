import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(activeOnly = false): Promise<Category[]> {
    const where = activeOnly ? { isActive: true } : {};
    return this.repo.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findBySlug(slug: string): Promise<Category> {
    const cat = await this.repo.findOne({ where: { slug } });
    if (!cat) throw new NotFoundException(`Category '${slug}' not found`);
    return cat;
  }

  async findById(id: string): Promise<Category> {
    const cat = await this.repo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Category not found`);
    return cat;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    const cat = this.repo.create(dto);
    return this.repo.save(cat);
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const cat = await this.findById(id);
    Object.assign(cat, dto);
    return this.repo.save(cat);
  }

  async remove(id: string): Promise<void> {
    const cat = await this.findById(id);
    await this.repo.remove(cat);
  }

  async seed(categories: CreateCategoryDto[]): Promise<void> {
    for (const cat of categories) {
      const exists = await this.repo.findOne({ where: { slug: cat.slug } });
      if (!exists) {
        await this.repo.save(this.repo.create({ ...cat, isActive: true }));
        continue;
      }

      Object.assign(exists, cat, { isActive: true });
      await this.repo.save(exists);
    }
  }
}
