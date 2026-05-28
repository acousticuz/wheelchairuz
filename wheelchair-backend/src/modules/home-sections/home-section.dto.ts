import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsObject,
  IsIn,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

const SECTION_TYPES = [
  'hero',
  'stats',
  'search',
  'categories',
  'featured',
  'testimonials',
  'cta',
  'about',
  'banner',
  'spacer',
] as const;

export class CreateHomeSectionDto {
  @ApiProperty({ example: 'main-hero' })
  @IsString()
  key: string;

  @ApiProperty({ enum: SECTION_TYPES })
  @IsIn(SECTION_TYPES as unknown as string[])
  type: (typeof SECTION_TYPES)[number];

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown>;
}

export class UpdateHomeSectionDto extends PartialType(CreateHomeSectionDto) {}

class ReorderItemDto {
  @ApiProperty() @IsString() id: string;
  @ApiProperty() @IsInt() sortOrder: number;
}

export class ReorderHomeSectionsDto {
  @ApiProperty({ type: [ReorderItemDto] })
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
