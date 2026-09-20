import { IsString, Length } from 'class-validator';

export class ApplyJobDto {
  @IsString()
  @Length(2, 100)
  bankName!: string;

  @IsString()
  @Length(10, 10)
  bankAccountNumber!: string;

  @IsString()
  @Length(11, 11)
  bvn!: string;
}
