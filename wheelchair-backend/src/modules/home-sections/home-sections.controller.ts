import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HomeSectionsService } from './home-sections.service';
import {
  CreateHomeSectionDto,
  UpdateHomeSectionDto,
  ReorderHomeSectionsDto,
} from './home-section.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Home sections')
@Controller('home-sections')
export class HomeSectionsController {
  constructor(private readonly svc: HomeSectionsService) {}

  // ── Public ──────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'Get home sections (public = active only)' })
  findAll(@Query('all') all?: string) {
    return this.svc.findAll(all !== 'true');
  }

  // ── Admin ────────────────────────────────────────────────
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create home section (admin)' })
  create(@Body() dto: CreateHomeSectionDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update home section (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateHomeSectionDto) {
    return this.svc.update(id, dto);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk reorder sections (admin)' })
  reorder(@Body() dto: ReorderHomeSectionsDto) {
    return this.svc.reorder(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete home section (admin)' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
