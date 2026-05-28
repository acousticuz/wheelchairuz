import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateLanguageDto {
  @IsString() code: string;
  @IsString() name: string;
  @IsOptional() @IsString() nativeName?: string;
  @IsOptional() @IsString() flag?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @IsBoolean() isDefault?: boolean;
  @IsOptional() @IsInt() @Min(0) @Max(100) completion?: number;
  @IsOptional() @IsInt() @Min(0) totalKeys?: number;
}

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {}
