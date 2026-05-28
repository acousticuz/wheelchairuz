import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomeSection } from './home-section.entity';
import {
  CreateHomeSectionDto,
  UpdateHomeSectionDto,
  ReorderHomeSectionsDto,
} from './home-section.dto';

@Injectable()
export class HomeSectionsService {
  private readonly logger = new Logger(HomeSectionsService.name);

  constructor(
    @InjectRepository(HomeSection)
    private readonly repo: Repository<HomeSection>,
  ) {}

  async findAll(activeOnly = false): Promise<HomeSection[]> {
    const where = activeOnly ? { isActive: true } : {};
    return this.repo.find({
      where,
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  async findById(id: string): Promise<HomeSection> {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Home section not found');
    return item;
  }

  async findByKey(key: string): Promise<HomeSection> {
    const item = await this.repo.findOne({ where: { key } });
    if (!item) throw new NotFoundException(`Home section '${key}' not found`);
    return item;
  }

  async create(dto: CreateHomeSectionDto): Promise<HomeSection> {
    const existing = await this.repo.findOne({ where: { key: dto.key } });
    if (existing) {
      throw new ConflictException(`Section key '${dto.key}' already exists`);
    }
    const item = this.repo.create({
      ...dto,
      settings: dto.settings ?? {},
      isActive: dto.isActive ?? true,
      sortOrder:
        typeof dto.sortOrder === 'number' ? dto.sortOrder : await this.nextSortOrder(),
    });
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdateHomeSectionDto): Promise<HomeSection> {
    const item = await this.findById(id);
    Object.assign(item, dto);
    if (dto.settings) item.settings = dto.settings;
    return this.repo.save(item);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findById(id);
    await this.repo.remove(item);
  }

  async reorder(dto: ReorderHomeSectionsDto): Promise<HomeSection[]> {
    await this.repo.manager.transaction(async (tx) => {
      for (const it of dto.items) {
        await tx.update(HomeSection, it.id, { sortOrder: it.sortOrder });
      }
    });
    return this.findAll(false);
  }

  /**
   * Seed defaults — only inserts sections that don't already exist (matched by
   * `key`). Existing rows are left untouched so admin tweaks survive restarts.
   */
  async seedDefaults(defaults: CreateHomeSectionDto[]): Promise<void> {
    let created = 0;
    for (const def of defaults) {
      const exists = await this.repo.findOne({ where: { key: def.key } });
      if (exists) continue;
      await this.repo.save(
        this.repo.create({
          ...def,
          settings: def.settings ?? {},
          isActive: def.isActive ?? true,
        }),
      );
      created += 1;
    }
    if (created > 0) this.logger.log(`Seeded ${created} default home sections`);
  }

  private async nextSortOrder(): Promise<number> {
    const last = await this.repo
      .createQueryBuilder('s')
      .select('MAX(s.sortOrder)', 'max')
      .getRawOne<{ max: string | null }>();
    return (Number(last?.max) || 0) + 10;
  }
}
