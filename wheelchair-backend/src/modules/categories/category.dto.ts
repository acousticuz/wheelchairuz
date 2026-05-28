import { IsString, IsOptional, IsBoolean, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';

class LocalizedStringDto {
  @ApiProperty() @IsString() uz: string;
  @ApiProperty() @IsString() ru: string;
  @ApiProperty() @IsString() en: string;
}

export class CreateCategoryDto {
  @ApiProperty() @IsString() slug: string;
  @ApiProperty() @IsString() icon: string;
  @ApiProperty({ type: LocalizedStringDto }) @ValidateNested() @Type(() => LocalizedStringDto) name: LocalizedStringDto;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
