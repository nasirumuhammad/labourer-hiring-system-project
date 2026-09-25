import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Max, Min, IsInt } from 'class-validator';
import { UserRole } from '@labour-hiring/enums';

export class QueryUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(['active', 'deactivated'])
  status?: 'active' | 'deactivated';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  get skip() { return (this.page - 1) * this.limit; }
}
