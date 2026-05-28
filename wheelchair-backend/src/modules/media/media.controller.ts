import {
  Controller, Get, Post, Delete, Param,
  UseGuards, UseInterceptors, UploadedFile,
  Query, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Media')
@Controller('media')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly svc: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'List media files (admin)' })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.svc.findAll(page, limit);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload image (admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (file.mimetype?.startsWith('image/')) cb(null, true);
        else cb(new BadRequestException('Only image files are allowed'), false);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return this.svc.saveFile(file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete media file (admin)' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Post('cleanup-orphans')
  @ApiOperation({ summary: 'Remove DB records for files missing on disk (admin)' })
  cleanupOrphans() {
    return this.svc.cleanupOrphans();
  }
}
