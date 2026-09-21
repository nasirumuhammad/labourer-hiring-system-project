import {
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '@labour-hiring/enums';

const SELF_SERVE_ROLES = [UserRole.LABOURER, UserRole.EMPLOYER] as const;

export class SignUpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsOptional()
  @IsIn(SELF_SERVE_ROLES)
  role: UserRole.LABOURER | UserRole.EMPLOYER = UserRole.LABOURER;
}
