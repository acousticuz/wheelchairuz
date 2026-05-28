import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from './language.entity';
import { CreateLanguageDto, UpdateLanguageDto } from './language.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly repo: Repository<Language>,
  ) {}

  findAll() {
    return this.repo.find({ order: { isDefault: 'DESC', code: 'ASC' } });
  }

  async create(dto: CreateLanguageDto) {
    const code = dto.code.toLowerCase();
    const exists = await this.repo.findOne({ where: { code } });
    if (exists) throw new ConflictException(`Language '${code}' already exists`);
    if (dto.isDefault) {
      await this.repo.update({ isDefault: true }, { isDefault: false });
    }
    return this.repo.save(this.repo.create({ ...dto, code }));
  }

  async update(id: string, dto: UpdateLanguageDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Language not found');
    if (dto.code) dto.code = dto.code.toLowerCase();
    if (dto.isDefault) {
      await this.repo.update({ isDefault: true }, { isDefault: false });
    }
    Object.assign(row, dto);
    return this.repo.save(row);
  }

  async remove(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Language not found');
    await this.repo.remove(row);
  }

  async seedDefaults() {
    const defaults: CreateLanguageDto[] = [
      { code: 'uz', name: "O'zbek", nativeName: "O'zbek", flag: 'UZ', isActive: true, isDefault: true, completion: 100, totalKeys: 120 },
      { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'RU', isActive: true, isDefault: false, completion: 100, totalKeys: 120 },
      { code: 'en', name: 'English', nativeName: 'English', flag: 'EN', isActive: true, isDefault: false, completion: 100, totalKeys: 120 },
    ];
    for (const d of defaults) {
      const exists = await this.repo.findOne({ where: { code: d.code } });
      if (!exists) {
        await this.repo.save(this.repo.create(d));
      }
    }
  }
}
