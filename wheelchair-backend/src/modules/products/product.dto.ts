import {
  IsString, IsOptional, IsBoolean, IsNumber,
  IsArray, ValidateNested, IsUUID,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

class LocalizedDto {
  @IsString() uz: string;
  @IsString() ru: string;
  @IsString() en: string;
}

class SpecDto {
  @IsString() label_uz: string;
  @IsString() label_ru: string;
  @IsString() label_en: string;
  @IsString() value: string;
}

export class CreateProductDto {
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() sku: string;
  @ApiProperty() @ValidateNested() @Type(() => LocalizedDto) name: LocalizedDto;
  @ApiProperty() @ValidateNested() @Type(() => LocalizedDto) excerpt: LocalizedDto;
  @ApiProperty() @ValidateNested() @Type(() => LocalizedDto) description: LocalizedDto;

  @ApiProperty() @IsNumber() @Transform(({ value }) => Number(value)) price: number;
  @IsOptional() @IsBoolean() showPrice?: boolean;

  @IsOptional() @IsString() mainImage?: string;
  @IsOptional() @IsArray() images?: string[];
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => SpecDto) specs?: SpecDto[];
  @IsOptional() @IsArray() tags?: string[];
  @IsOptional() @IsString() badge?: string;
  @IsOptional() @IsNumber() rating?: number;
  @IsOptional() @IsNumber() reviewCount?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsNumber() sortOrder?: number;
  @IsOptional() @IsUUID() categoryId?: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto {
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() tags?: string;
  @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true') featured?: boolean;
  @IsOptional() @IsString() sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  @IsOptional() @Transform(({ value }) => parseInt(value)) page?: number;
  @IsOptional() @Transform(({ value }) => parseInt(value)) limit?: number;
}
