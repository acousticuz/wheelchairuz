import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly svc: ProductsService) {}

  // ── Public ──────────────────────────────────────────────
  @Get()
  @ApiOperation({ summary: 'List products (public, paginated, filtered)' })
  findAll(@Query() query: ProductQueryDto) {
    return this.svc.findAll(query);
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: get all products including inactive' })
  adminFindAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.svc.adminFindAll({ search, category, page, limit });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get product by slug (public)' })
  findOne(@Param('slug') slug: string) {
    return this.svc.findBySlug(slug);
  }

  @Get(':slug/related')
  @ApiOperation({ summary: 'Get related products' })
  async findRelated(@Param('slug') slug: string) {
    const product = await this.svc.findBySlug(slug);
    return this.svc.findRelated(product.id, product.categoryId);
  }

  // ── Admin ────────────────────────────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create product (admin)' })
  create(@Body() dto: CreateProductDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.svc.update(id, dto);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle product active/inactive (admin)' })
  toggle(@Param('id') id: string) {
    return this.svc.toggleActive(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product (admin)' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
