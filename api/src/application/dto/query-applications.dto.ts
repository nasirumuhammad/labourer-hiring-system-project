import { IsEnum, IsOptional } from 'class-validator';
import { ApplicationStatus } from '@labour-hiring/enums';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class QueryApplicationsDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;
}
