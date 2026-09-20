import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { PaymentType } from '@labour-hiring/enums';

export class CreateJobDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsString()
  @MinLength(3)
  companyName!: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsEnum(PaymentType)
  paymentType!: PaymentType;

  @IsNumberString()
  minPay!: string;

  @IsNumberString()
  maxPay!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minExperienceYears?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  skills?: string[];
}
