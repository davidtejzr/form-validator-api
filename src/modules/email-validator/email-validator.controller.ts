import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EmailValidatorService } from './email-validator.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EmailCacheService } from './services/email-cache.service';
import { EmailFormatValidatorService } from './services/email-format-validator.service';

@Controller('email-validator')
export class EmailValidatorController {
  constructor(
    private readonly emailValidatorService: EmailValidatorService,
    private readonly emailCacheService: EmailCacheService,
    private readonly emailFormatValidatorService: EmailFormatValidatorService,
  ) {}

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

  @Get('autocomplete')
  @ApiOperation({ summary: 'E-mail domains autocomplete' })
  @ApiQuery({
    name: 'email',
    type: String,
    description:
      'The beginning of the email address with @ and at least one domain character',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    minimum: 1,
    maximum: 20,
    default: 5,
    description: 'Maximum rows to return',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of suggested email domains',
    type: [String],
  })
  async getEmailDomainSuggestions(
    @Query('email') email: string,
    @Query('limit') limit: number,
  ): Promise<string[]> {
    if (
      !email ||
      !this.emailFormatValidatorService.isValidEmailWithoutDomain(email)
    ) {
      return [];
    }
    return this.emailCacheService.getEmailDomainSuggestions(email, limit);
  }
}
