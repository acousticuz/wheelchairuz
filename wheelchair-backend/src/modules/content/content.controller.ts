import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ContentService } from './content.service';
import { CreateContentPageDto, UpdateContentPageDto } from './content.dto';

@ApiTags('Content')
@Controller('content')
export class ContentController {
  constructor(private readonly svc: ContentService) {}

  // ── Public ──────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'List content pages (public)' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get content page by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  // ── Admin ────────────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create content page (admin)' })
  create(@Body() dto: CreateContentPageDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update content page (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateContentPageDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete content page (admin)' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
