import {
  Injectable, NotFoundException, BadRequestException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Media } from './media.entity';

const sharp = require('sharp');
const heicConvert = require('heic-convert');

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadDir: string;
  private readonly baseUrl: string;

  constructor(
    @InjectRepository(Media)
    private readonly repo: Repository<Media>,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = configService.get('app.upload.dir') || './uploads';
    this.baseUrl = configService.get('app.cors.frontendUrl') || 'http://localhost:3000';

    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  private async convertToWebp(file: Express.Multer.File): Promise<Buffer> {
    try {
      return await sharp(file.buffer, { animated: true, failOn: 'none', limitInputPixels: false })
        .rotate()
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    } catch (sharpErr) {
      const mime = (file.mimetype || '').toLowerCase();
      const isHeic = mime.includes('heic') || mime.includes('heif') || /\.(heic|heif)$/i.test(file.originalname || '');
      if (!isHeic) throw sharpErr;

      const jpegBuffer = await heicConvert({
        buffer: file.buffer,
        format: 'JPEG',
        quality: 0.9,
      }) as Buffer;

      return sharp(jpegBuffer, { failOn: 'none', limitInputPixels: false })
        .rotate()
        .webp({ quality: 82, effort: 4 })
        .toBuffer();
    }
  }

  async saveFile(file: Express.Multer.File, alt?: string): Promise<Media> {
    if (!file.mimetype?.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const filename = `${uuidv4()}.webp`;
    const filePath = path.join(this.uploadDir, filename);
    let converted: Buffer;
    try {
      converted = await this.convertToWebp(file);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'unknown error';
      this.logger.warn(`Media conversion failed: ${file.originalname} (${file.mimetype}) -> ${reason}`);
      throw new BadRequestException(`Unsupported or corrupted image (${reason})`);
    }
    fs.writeFileSync(filePath, converted);

    const media = this.repo.create({
      filename,
      originalName: file.originalname,
      mimetype: 'image/webp',
      size: converted.length,
      path: filePath,
      url: `/uploads/${filename}`,
      alt: alt || file.originalname,
    });

    return this.repo.save(media);
  }

  async findAll(page = 1, limit = 24): Promise<{ data: Media[]; total: number }> {
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Math.min(Math.max(Number(limit) || 24, 1), 120);
    const [data, total] = await this.repo.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });
    return { data, total };
  }

  async findById(id: string): Promise<Media> {
    const media = await this.repo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  async remove(id: string): Promise<void> {
    const media = await this.findById(id);
    // Delete file from disk
    if (fs.existsSync(media.path)) {
      fs.unlinkSync(media.path);
    }
    await this.repo.remove(media);
  }

  /**
   * Remove DB records whose underlying file is missing on disk. Used to clean
   * up after a deployment where the uploads volume was reset but DB persisted.
   */
  async cleanupOrphans(): Promise<{ scanned: number; removed: number; removedIds: string[] }> {
    const all = await this.repo.find();
    const orphanIds: string[] = [];
    for (const m of all) {
      const filePath = path.isAbsolute(m.path)
        ? m.path
        : path.join(process.cwd(), m.path);
      if (!fs.existsSync(filePath)) orphanIds.push(m.id);
    }
    if (orphanIds.length > 0) {
      await this.repo.delete(orphanIds);
      this.logger.warn(`Cleaned up ${orphanIds.length} orphaned media records`);
    }
    return { scanned: all.length, removed: orphanIds.length, removedIds: orphanIds };
  }
}
