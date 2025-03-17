import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EmailValidatorService } from './email-validator.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EmailCacheService } from './services/email-cache.service';
import { EmailFormatValidatorService } from './services/email-format-validator.service';
import { EmailValidateBasicResponseDto } from './dtos/email-validate-basic-response-dto';
import { EmailValidateRecommendedResponseDto } from './dtos/email-validate-recommended-response-dto';
import { EmailValidateAdvancedResponseDto } from './dtos/email-validate-advanced-response-dto';
import { I18nService } from 'nestjs-i18n';

@Controller('email-validator')
export class EmailValidatorController {
  constructor(
    private readonly emailValidatorService: EmailValidatorService,
    private readonly emailCacheService: EmailCacheService,
    private readonly emailFormatValidatorService: EmailFormatValidatorService,
    private readonly i18n: I18nService,
  ) {}

  @Post('validate-basic')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Basic email validation, returns only the validation level',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          default: 'seznam@seznam.cz',
          minLength: 3,
          maxLength: 254,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the validation level',
    type: EmailValidateBasicResponseDto,
  })
  async validateEmailBasic(
    @Body('email') email: string,
  ): Promise<EmailValidateBasicResponseDto> {
    const validationStatus =
      await this.emailValidatorService.validateEmail(email);

    return {
      level:
        this.emailValidatorService.resolveValidationLevel(validationStatus),
    };
  }

  @Post('validate-recommended')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Recommended email validation, returns the validation level and status message',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          default: 'seznam@seznam.cz',
          minLength: 3,
          maxLength: 254,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the validation level and status message',
    type: EmailValidateRecommendedResponseDto,
  })
  async validateEmailRecommended(
    @Body('email') email: string,
  ): Promise<EmailValidateRecommendedResponseDto> {
    const statusMessage = await this.emailValidatorService.validateEmail(email);
    const level =
      this.emailValidatorService.resolveValidationLevel(statusMessage);
    const friendlyMessage = (await this.i18n.t(
      `common.emailValidation.${statusMessage}`,
    )) as string;
    return { level, statusMessage, friendlyMessage };
  }

  @Post('validate-advanced')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Advanced email validation, returns the validation level, status message and partial validation results',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          default: 'seznam@seznam.cz',
          minLength: 3,
          maxLength: 254,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the validation level, status message and partial validation results',
    type: EmailValidateAdvancedResponseDto,
  })
  async validateEmailAdvanced(
    @Body('email') email: string,
  ): Promise<EmailValidateAdvancedResponseDto> {
    const statusMessage = await this.emailValidatorService.validateEmail(email);
    const level =
      this.emailValidatorService.resolveValidationLevel(statusMessage);
    const partialResults = this.emailValidatorService.getPartialResults();
    const friendlyMessage = (await this.i18n.t(
      `common.emailValidation.${statusMessage}`,
    )) as string;
    return { statusMessage, level, partialResults, friendlyMessage };
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'E-mail domains autocomplete' })
  @ApiQuery({
    name: 'email',
    type: String,
    minimum: 3,
    maximum: 254,
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
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
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
