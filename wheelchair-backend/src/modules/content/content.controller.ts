import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ContentService } from './content.service';
import { CreateContentPageDto, UpdateContentPageDto } from './content.dto';

@ApiTags('Content')
@Controller('content')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContentController {
  constructor(private readonly svc: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'List content pages' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get content page by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Post()
  @ApiOperation({ summary: 'Create content page' })
  create(@Body() dto: CreateContentPageDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update content page' })
  update(@Param('id') id: string, @Body() dto: UpdateContentPageDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete content page' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
