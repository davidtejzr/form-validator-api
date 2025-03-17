import { ApiProperty } from '@nestjs/swagger';
import { EmailValidateBasicResponseDto } from './email-validate-basic-response-dto';
import { EmailValidationStatus } from '../../../enums/email-validation-status.enum';

export class EmailValidateRecommendedResponseDto extends EmailValidateBasicResponseDto {
  @ApiProperty({
    enum: EmailValidationStatus,
    default: EmailValidationStatus.VALID,
  })
  statusMessage: EmailValidationStatus;
  friendlyMessage: string;
}
