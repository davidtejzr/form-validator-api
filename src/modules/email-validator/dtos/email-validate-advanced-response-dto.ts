import { ApiProperty } from '@nestjs/swagger';
import { EmailValidateRecommendedResponseDto } from './email-validate-recommended-response-dto';
import { EmailValidationResultDto } from './email-validator-result-dto';

export class EmailValidateAdvancedResponseDto extends EmailValidateRecommendedResponseDto {
  @ApiProperty({ type: EmailValidationResultDto })
  partialResults: EmailValidationResultDto;
}
