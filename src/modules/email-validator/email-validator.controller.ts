import { Body, Controller, Post } from '@nestjs/common';
import { EmailValidatorService } from './email-validator.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('email-validator')
export class EmailValidatorController {
  constructor(private readonly emailValidatorService: EmailValidatorService) {}

  @Post('validate-basic')
  @ApiOperation({
    summary: 'Basic email validation, returns only the validation level',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string', default: 'test@gmail.com' } },
    },
  })
  async validateEmailBasic(@Body('email') email: string) {
    const validationStatus =
      await this.emailValidatorService.validateEmail(email);
    return this.emailValidatorService.resolveValidationLevel(validationStatus);
  }

  @Post('validate-recommended')
  @ApiOperation({
    summary:
      'Recommended email validation, returns the validation level and status message',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string', default: 'test@gmail.com' } },
    },
  })
  async validateEmailRecommended(@Body('email') email: string) {
    const validationStatus =
      await this.emailValidatorService.validateEmail(email);
    const validationLevel =
      this.emailValidatorService.resolveValidationLevel(validationStatus);
    return { validationStatus, validationLevel };
  }

  @Post('validate-advanced')
  @ApiOperation({
    summary:
      'Advanced email validation, returns the validation level, status message and partial validation results',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string', default: 'test@gmail.com' } },
    },
  })
  async validateEmailAdvanced(@Body('email') email: string) {
    const validationStatus =
      await this.emailValidatorService.validateEmail(email);
    const validationLevel =
      this.emailValidatorService.resolveValidationLevel(validationStatus);
    const partialResults = this.emailValidatorService.getPartialResults();
    return { validationStatus, validationLevel, partialResults };
  }
}
