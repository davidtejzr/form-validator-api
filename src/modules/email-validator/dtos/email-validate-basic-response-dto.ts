import { EmailValidationLevelEnum } from '../../../enums/email-validation-level.enum';
import { ApiProperty } from '@nestjs/swagger';

export class EmailValidateBasicResponseDto {
  @ApiProperty({ enum: EmailValidationLevelEnum })
  level: EmailValidationLevelEnum;
}
