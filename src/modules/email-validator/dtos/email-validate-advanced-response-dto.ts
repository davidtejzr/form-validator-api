import { ApiProperty } from '@nestjs/swagger';
import { EmailValidateRecommendedResponseDto } from './email-validate-recommended-response-dto';
import { EmailValidationResultInterface } from '../../../interfaces/email-validation-result.interface';

export class EmailValidateAdvancedResponseDto extends EmailValidateRecommendedResponseDto {
  @ApiProperty()
  partialResults: EmailValidationResultInterface;
}
