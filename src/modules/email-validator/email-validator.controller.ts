import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { EmailValidatorService } from './email-validator.service';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { EmailCacheService } from './services/email-cache.service';
import { EmailFormatValidatorService } from './services/email-format-validator.service';
import { EmailValidateBasicResponseDto } from './dtos/email-validate-basic-response-dto';
import { EmailValidateRecommendedResponseDto } from './dtos/email-validate-recommended-response-dto';
import { EmailValidateAdvancedResponseDto } from './dtos/email-validate-advanced-response-dto';
import { I18nService } from 'nestjs-i18n';
import { EmailValidationOptionsInterface } from '../../interfaces/email-validation-options.interface';

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
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language for response messages (e.g., en, cs)',
    required: false,
    schema: {
      type: 'string',
      default: 'cs',
    },
  })
  @ApiHeader({
    name: 'X-Allow-Blacklist-Check',
    required: false,
    description:
      'Set to true to enable blacklist checking (e.g., known spam or blocked domains)',
    schema: {
      type: 'boolean',
      default: true,
    },
  })
  @ApiHeader({
    name: 'X-Allow-Is-Disposable-Check',
    required: false,
    description:
      'Set to true to check if the email is from a disposable provider (e.g., temp-mail)',
    schema: {
      type: 'boolean',
      default: true,
    },
  })
  @ApiHeader({
    name: 'X-Allow-Smtp-Check',
    required: false,
    description:
      'Set to true to check if the email is valid and reachable via SMTP',
    schema: {
      type: 'boolean',
      default: true,
    },
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
    @Headers('Accept-Language') language: string = 'cs',
    @Headers('X-Allow-Blacklist-Check') blacklistCheckHeader: string,
    @Headers('X-Allow-Is-Disposable-Check') disposableCheckHeader: string,
    @Headers('X-Allow-Smtp-Check') smtpCheckHeader: string,
  ): Promise<EmailValidateRecommendedResponseDto> {
    const disableBlacklistCheck = blacklistCheckHeader === 'false';
    const disableDisposableCheck = disposableCheckHeader === 'false';
    const disableSmtpCheck = smtpCheckHeader === 'false';
    const options: EmailValidationOptionsInterface = {
      blacklistCheck: !disableBlacklistCheck,
      disposableCheck: !disableDisposableCheck,
      smtpCheck: !disableSmtpCheck,
    };

    const statusMessage = await this.emailValidatorService.validateEmail(
      email,
      options,
    );
    const level =
      this.emailValidatorService.resolveValidationLevel(statusMessage);
    const friendlyMessage = (await this.i18n.t(
      `common.emailValidation.${statusMessage}`,
      { lang: language },
    )) as string;
    return { level, statusMessage, friendlyMessage };
  }

  @Post('validate-advanced')
  @HttpCode(200)
  @ApiOperation({
    summary:
      'Advanced email validation, returns the validation level, status message and partial validation results',
  })
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Language for response messages (e.g., en, cs)',
    required: false,
    schema: {
      type: 'string',
      default: 'cs',
    },
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
    @Headers('Accept-Language') language: string = 'cs',
  ): Promise<EmailValidateAdvancedResponseDto> {
    const statusMessage = await this.emailValidatorService.validateEmail(email);
    const level =
      this.emailValidatorService.resolveValidationLevel(statusMessage);
    const partialResults = this.emailValidatorService.getPartialResults();
    const friendlyMessage = (await this.i18n.t(
      `common.emailValidation.${statusMessage}`,
      { lang: language },
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
