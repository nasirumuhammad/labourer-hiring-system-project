import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { JobStatus, PaymentType } from '@labour-hiring/enums';

export class QueryJobsDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(JobStatus) status?: JobStatus;
  @IsOptional() @IsEnum(PaymentType) paymentType?: PaymentType;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 10;
  get skip() { return (this.page - 1) * this.limit; }
}
