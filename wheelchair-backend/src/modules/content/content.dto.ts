import {
  IsString, IsOptional, IsBoolean, ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

class LocalizedDto {
  @IsString() uz: string;
  @IsString() ru: string;
  @IsString() en: string;
}

export class CreateContentPageDto {
  @IsString() slug: string;
  @ValidateNested() @Type(() => LocalizedDto) title: LocalizedDto;
  @ValidateNested() @Type(() => LocalizedDto) body: LocalizedDto;
  @IsOptional() @IsObject() meta?: Record<string, any>;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateContentPageDto extends PartialType(CreateContentPageDto) {}
