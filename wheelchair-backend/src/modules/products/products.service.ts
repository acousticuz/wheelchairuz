import {
  Injectable, NotFoundException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  async findAll(query: ProductQueryDto = {}): Promise<{ data: Product[]; total: number; page: number; limit: number }> {
    const {
      category, search, tags, featured,
      sort = 'newest', page = 1, limit = 12,
    } = query;
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Math.min(Math.max(Number(limit) || 12, 1), 100);

    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = true');

    if (category) {
      qb.andWhere('category.slug = :category', { category });
    }

    if (search) {
      qb.andWhere(
        `(product.name->>'uz' ILIKE :search OR product.name->>'ru' ILIKE :search OR product.name->>'en' ILIKE :search OR product.sku ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (tags) {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagList.length) {
        qb.andWhere(
          tagList.map((_, index) => `product.tags ILIKE :tag${index}`).join(' OR '),
          Object.fromEntries(tagList.map((tag, index) => [`tag${index}`, `%${tag}%`])),
        );
      }
    }

    if (featured) {
      qb.andWhere('product.isFeatured = true');
    }

    switch (sort) {
      case 'price_asc': qb.orderBy('product.price', 'ASC').addOrderBy('product.sortOrder', 'ASC'); break;
      case 'price_desc': qb.orderBy('product.price', 'DESC').addOrderBy('product.sortOrder', 'ASC'); break;
      case 'popular': qb.orderBy('product.reviewCount', 'DESC').addOrderBy('product.sortOrder', 'ASC'); break;
      default: qb.orderBy('product.sortOrder', 'ASC').addOrderBy('product.createdAt', 'DESC');
    }

    const total = await qb.getCount();
    const data = await qb.skip((pageNum - 1) * limitNum).take(limitNum).getMany();

    return { data, total, page: pageNum, limit: limitNum };
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.repo.findOne({
      where: { slug, isActive: true },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product '${slug}' not found`);
    return product;
  }

  async findById(id: string): Promise<Product> {
    const product = await this.repo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException(`Product not found`);
    return product;
  }

  async findRelated(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
    return this.repo
      .createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId })
      .andWhere('product.id != :productId', { productId })
      .andWhere('product.isActive = true')
      .orderBy('product.rating', 'DESC')
      .take(limit)
      .getMany();
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    const product = this.repo.create(dto);
    return this.repo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findById(id);
    Object.assign(product, dto);
    return this.repo.save(product);
  }

  async toggleActive(id: string): Promise<Product> {
    const product = await this.findById(id);
    product.isActive = !product.isActive;
    return this.repo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findById(id);
    await this.repo.remove(product);
  }

  async adminFindAll(query: { search?: string; category?: string; page?: number; limit?: number }) {
    const { search, category, page = 1, limit = 20 } = query;
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const qb = this.repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .orderBy('product.sortOrder', 'ASC')
      .addOrderBy('product.createdAt', 'DESC');

    if (search) {
      qb.andWhere(
        `(product.name->>'en' ILIKE :s OR product.name->>'uz' ILIKE :s OR product.sku ILIKE :s)`,
        { s: `%${search}%` },
      );
    }

    if (category && category !== 'all') {
      qb.andWhere('category.slug = :category', { category });
    }

    const total = await qb.getCount();
    const data = await qb.skip((pageNum - 1) * limitNum).take(limitNum).getMany();
    return { data, total, page: pageNum, limit: limitNum };
  }

  async seed(products: CreateProductDto[]): Promise<void> {
    const seedSlugs = products.map((p) => p.slug).filter(Boolean);

    for (const p of products) {
      const exists = await this.repo.findOne({ where: { slug: p.slug } });
      if (!exists) {
        await this.repo.save(this.repo.create(p));
        continue;
      }

      Object.assign(exists, p);
      await this.repo.save(exists);
    }

    if (seedSlugs.length) {
      await this.repo
        .createQueryBuilder()
        .update(Product)
        .set({ isActive: false })
        .where('slug NOT IN (:...seedSlugs)', { seedSlugs })
        .execute();
    }
  }
}
