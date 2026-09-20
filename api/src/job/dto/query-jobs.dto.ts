import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { PaymentType } from '@labour-hiring/enums';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

const toArray = ({ value }: { value: unknown }) =>
  value === undefined ? undefined : Array.isArray(value) ? value : [value];

export class QueryJobsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(PaymentType, { each: true })
  paymentType?: PaymentType[];

  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsIn(['newest', 'oldest'])
  sort: 'newest' | 'oldest' = 'newest';
}
