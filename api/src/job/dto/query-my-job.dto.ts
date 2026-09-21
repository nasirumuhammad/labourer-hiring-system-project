import { IsEnum, IsOptional } from 'class-validator';
import { JobStatus } from '@labour-hiring/enums';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class QueryMyJobsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
