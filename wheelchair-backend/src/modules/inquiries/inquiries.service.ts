import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry, InquiryStatus } from './inquiry.entity';
import { CreateInquiryDto, UpdateInquiryDto, InquiryQueryDto } from './inquiry.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class InquiriesService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly repo: Repository<Inquiry>,
    private readonly telegramService: TelegramService,
  ) {}

  async create(dto: CreateInquiryDto, meta?: { ip?: string; userAgent?: string }): Promise<Inquiry> {
    const inquiry = this.repo.create({
      ...dto,
      status: InquiryStatus.NEW,
      ipAddress: meta?.ip,
      userAgent: meta?.userAgent,
    });

    const saved = await this.repo.save(inquiry);

    // Send Telegram notification (non-blocking)
    this.telegramService
      .sendNewInquiryNotification(saved)
      .then((msgId) => {
        if (msgId) {
          this.repo.update(saved.id, { telegramMessageId: msgId });
        }
      })
      .catch(() => {});

    return saved;
  }

  async findAll(query: InquiryQueryDto = {}): Promise<{ data: Inquiry[]; total: number }> {
    const { status, page = 1, limit = 20, search } = query;
    const pageNum = Number(page) > 0 ? Number(page) : 1;
    const limitNum = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const qb = this.repo
      .createQueryBuilder('inquiry')
      .orderBy('inquiry.createdAt', 'DESC');

    if (status && status !== 'all') {
      qb.andWhere('inquiry.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(inquiry.firstName ILIKE :s OR inquiry.lastName ILIKE :s OR inquiry.phone ILIKE :s OR inquiry.email ILIKE :s)',
        { s: `%${search}%` },
      );
    }

    const total = await qb.getCount();
    const data = await qb.skip((pageNum - 1) * limitNum).take(limitNum).getMany();

    return { data, total };
  }

  async findById(id: string): Promise<Inquiry> {
    const inquiry = await this.repo.findOne({ where: { id } });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async updateStatus(id: string, dto: UpdateInquiryDto): Promise<Inquiry> {
    const inquiry = await this.findById(id);
    if (dto.status) {
      inquiry.status = dto.status;
      if (dto.status === InquiryStatus.REPLIED) {
        inquiry.repliedAt = new Date();
      }
    }
    if (dto.adminNote !== undefined) {
      inquiry.adminNote = dto.adminNote;
    }
    return this.repo.save(inquiry);
  }

  async getStats(): Promise<{ new: number; replied: number; archived: number; total: number }> {
    const [newCount, repliedCount, archivedCount, total] = await Promise.all([
      this.repo.count({ where: { status: InquiryStatus.NEW } }),
      this.repo.count({ where: { status: InquiryStatus.REPLIED } }),
      this.repo.count({ where: { status: InquiryStatus.ARCHIVED } }),
      this.repo.count(),
    ]);
    return { new: newCount, replied: repliedCount, archived: archivedCount, total };
  }

  async remove(id: string): Promise<void> {
    const inquiry = await this.findById(id);
    await this.repo.remove(inquiry);
  }
}
