import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentPage } from './content.entity';
import { CreateContentPageDto, UpdateContentPageDto } from './content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentPage)
    private readonly repo: Repository<ContentPage>,
  ) {}

  findAll() {
    return this.repo.find({ order: { slug: 'ASC' } });
  }

  async findBySlug(slug: string) {
    const page = await this.repo.findOne({ where: { slug } });
    if (!page) throw new NotFoundException('Content page not found');
    return page;
  }

  async create(dto: CreateContentPageDto) {
    const exists = await this.repo.findOne({ where: { slug: dto.slug } });
    if (exists) throw new ConflictException(`Slug '${dto.slug}' already exists`);
    return this.repo.save(this.repo.create(dto));
  }

  async update(id: string, dto: UpdateContentPageDto) {
    const page = await this.repo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('Content page not found');
    Object.assign(page, dto);
    return this.repo.save(page);
  }

  async remove(id: string) {
    const page = await this.repo.findOne({ where: { id } });
    if (!page) throw new NotFoundException('Content page not found');
    await this.repo.remove(page);
  }

  async seedDefaultPages() {
    const defaults: CreateContentPageDto[] = [
      { slug: 'home', title: { uz: 'Home', ru: 'Home', en: 'Home' }, body: { uz: '', ru: '', en: '' } },
      { slug: 'about', title: { uz: 'About', ru: 'About', en: 'About' }, body: { uz: '', ru: '', en: '' } },
      { slug: 'contact', title: { uz: 'Contact', ru: 'Contact', en: 'Contact' }, body: { uz: '', ru: '', en: '' } },
      { slug: 'catalog', title: { uz: 'Catalog', ru: 'Catalog', en: 'Catalog' }, body: { uz: '', ru: '', en: '' } },
      { slug: 'footer', title: { uz: 'Footer', ru: 'Footer', en: 'Footer' }, body: { uz: '', ru: '', en: '' } },
    ];
    for (const d of defaults) {
      const exists = await this.repo.findOne({ where: { slug: d.slug } });
      if (!exists) await this.repo.save(this.repo.create(d));
    }
  }
}
