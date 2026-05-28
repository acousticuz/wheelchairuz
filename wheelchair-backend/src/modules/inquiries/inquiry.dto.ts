import { IsString, IsOptional, IsEmail, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InquiryStatus } from './inquiry.entity';

export class CreateInquiryDto {
  @ApiProperty({ example: 'Aziz' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Rahimov' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+998901234567' })
  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsOptional()
  @IsString()
  productName?: string;
}

export class UpdateInquiryDto {
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @IsOptional()
  @IsString()
  adminNote?: string;
}

export class InquiryQueryDto {
  @IsOptional() status?: InquiryStatus | 'all';
  @IsOptional() page?: number;
  @IsOptional() limit?: number;
  @IsOptional() search?: string;
}
