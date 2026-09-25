import { Type } from 'class-transformer';
import { ApplicationStatus } from '@labour-hiring/enums';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryAdminApplicationsDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsEnum(ApplicationStatus) status?: ApplicationStatus;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 10;
  get skip() { return (this.page - 1) * this.limit; }
}
