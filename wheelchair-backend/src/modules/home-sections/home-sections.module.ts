import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeSection } from './home-section.entity';
import { HomeSectionsService } from './home-sections.service';
import { HomeSectionsController } from './home-sections.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HomeSection])],
  providers: [HomeSectionsService],
  controllers: [HomeSectionsController],
  exports: [HomeSectionsService],
})
export class HomeSectionsModule {}
