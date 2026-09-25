import { IdentityType } from '@labour-hiring/types';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

const identityTypes = [IdentityType.NIN, IdentityType.BVN] as const;

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  phoneNumber!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  lga!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  address!: string;

  @IsIn(identityTypes)
  identityType!: IdentityType;

  @Length(11, 12)
  identityNumber!: string;

  @IsString()
  @IsNotEmpty()
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  bankAccountNumber!: string;
}
