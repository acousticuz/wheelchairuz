import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseGuards, Request, Ip,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InquiriesService } from './inquiries.service';
import { CreateInquiryDto, UpdateInquiryDto, InquiryQueryDto } from './inquiry.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InquiryStatus } from './inquiry.entity';

@ApiTags('Inquiries')
@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly svc: InquiriesService) {}

  // ── Public: contact form submit ─────────────────────────
  @Post()
  @ApiOperation({ summary: 'Submit contact form (public)' })
  create(
    @Body() dto: CreateInquiryDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.svc.create(dto, { ip, userAgent });
  }

  // ── Admin ────────────────────────────────────────────────
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all inquiries (admin)' })
  findAll(
    @Query('status') status?: InquiryStatus | 'all',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.svc.findAll({ status, page, limit, search });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry stats (admin)' })
  getStats() {
    return this.svc.getStats();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inquiry by ID (admin)' })
  findOne(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inquiry status/note (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateInquiryDto) {
    return this.svc.updateStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete inquiry (admin)' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
