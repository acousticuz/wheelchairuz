import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto, UpdateLanguageDto } from './language.dto';

@ApiTags('Languages')
@Controller('languages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LanguagesController {
  constructor(private readonly svc: LanguagesService) {}

  @Get()
  @ApiOperation({ summary: 'List languages' })
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create language' })
  create(@Body() dto: CreateLanguageDto) {
    return this.svc.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update language' })
  update(@Param('id') id: string, @Body() dto: UpdateLanguageDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete language' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
