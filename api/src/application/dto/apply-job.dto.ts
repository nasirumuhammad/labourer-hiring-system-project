import { sanitizeRichText, stripHtmlTags } from '@/common/utils/rich-text.util';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'minTextLength', async: false })
class MinTextLengthConstraint implements ValidatorConstraintInterface {
  validate(value: any, args?: ValidationArguments): boolean {
    const [minLength] = args?.constraints as [number];
    return (
      typeof value === 'string' && stripHtmlTags(value).length >= minLength
    );
  }

  defaultMessage(args?: ValidationArguments): string {
    const [minLength] = args?.constraints as [number];
    return `Proposal must contain at least ${minLength} characters of text`;
  }
}

export class ApplyJobDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? sanitizeRichText(value) : value,
  )
  @Validate(MinTextLengthConstraint, [20])
  proposal!: string;
}
