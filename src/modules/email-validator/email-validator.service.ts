import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Email } from '../../schemas/email.schema';
import { Model } from 'mongoose';
import { EmailValidationStatus } from '../../enums/email-validation-status.enum';
import { EmailFormatValidatorService } from './services/email-format-validator.service';
import { EmailDnsResolverService } from './services/email-dns-resolver.service';
import { EmailFilterService } from './services/email-filter.service';
import { EmailCacheService } from './services/email-cache.service';
import { EmailSmtpResolverService } from './services/email-smtp-resolver.service';
import { EmailValidationLevelEnum } from '../../enums/email-validation-level.enum';
import { EmailValidationResultInterface } from '../../interfaces/email-validation-result.interface';

@Injectable()
export class EmailValidatorService {
  private partialResults: EmailValidationResultInterface;

  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    private cacheService: EmailCacheService,
    private formatValidatorService: EmailFormatValidatorService,
    private filterService: EmailFilterService,
    private dnsResolverService: EmailDnsResolverService,
    private smtpResolverService: EmailSmtpResolverService,
  ) {}

  async validateEmail(email: string): Promise<EmailValidationStatus> {
    this.partialResults = {
      cachedResult: false,
      invalidFormat: false,
      noMxRecords: null,
      blacklistedDomain: null,
      disposableAddress: null,
      undeliverableAddress: null,
    };
    if (!this.formatValidatorService.acceptRfc5322Standard(email)) {
      this.partialResults.invalidFormat = true;
      return EmailValidationStatus.INVALID_FORMAT;
    }

    let emailInstance = await this.cacheService.getEmail(email);
    if (emailInstance) {
      await this.cacheService.increaseSearchCount(emailInstance);
      if (!this.cacheService.isOutdated(emailInstance.updatedAt)) {
        Object.assign(this.partialResults, {
          cachedResult: true,
          noMxRecords: emailInstance.noMxRecords,
          blacklistedDomain: this.parseMixedType(
            emailInstance.blacklistedDomain,
          ),
          disposableAddress: emailInstance.disposableAddress,
          undeliverableAddress: this.parseMixedType(
            emailInstance.undeliverableAddress,
          ),
        });
        await this.cacheService.checkAndSaveDomain(
          emailInstance.domain,
          this.partialResults,
        );
        return emailInstance.validationStatus;
      }
    } else {
      this.partialResults.cachedResult = false;
      emailInstance = await this.cacheService.saveEmail(email);
    }

    const validationStatus = await this.resolveValidationStatus(emailInstance);
    await this.cacheService.checkAndSaveDomain(
      emailInstance.domain,
      this.partialResults,
    );

    await this.cacheService.persistValidationStatus(
      emailInstance,
      validationStatus,
      this.partialResults,
    );
    return validationStatus;
  }

  private async resolveValidationStatus(
    emailInstance: Email,
  ): Promise<EmailValidationStatus> {
    const mxRecord = await this.dnsResolverService.getHighestPriorityMxRecord(
      emailInstance.domain,
    );
    this.partialResults.noMxRecords = mxRecord === false;
    if (typeof mxRecord === 'boolean') {
      return EmailValidationStatus.NO_MX_RECORDS;
    }

    const isDisposable = this.filterService.isDisposableDomain(
      emailInstance.domain,
    );
    this.partialResults.disposableAddress = isDisposable;
    if (isDisposable) {
      return EmailValidationStatus.DISPOSABLE_ADDRESS;
    }

    const isOnBlacklist = await this.filterService.isDomainOnBlacklist(
      emailInstance.domain,
    );
    this.partialResults.blacklistedDomain = isOnBlacklist;
    if (isOnBlacklist) {
      return EmailValidationStatus.BLACKLISTED_DOMAIN;
    }

    const isUndeliverable = await this.smtpResolverService.isEmailUndeliverable(
      mxRecord,
      emailInstance.email,
    );
    this.partialResults.undeliverableAddress = isUndeliverable;
    if (isUndeliverable === 'undeclared') {
      return EmailValidationStatus.UNDECLARED_ADDRESS;
    }
    if (isUndeliverable) {
      return EmailValidationStatus.UNDELIVERABLE_ADDRESS;
    }

    return EmailValidationStatus.VALID;
  }

  resolveValidationLevel(validationStatus: EmailValidationStatus) {
    switch (validationStatus) {
      case EmailValidationStatus.VALID:
        return EmailValidationLevelEnum.GREEN;
      case EmailValidationStatus.UNDECLARED_ADDRESS:
        return EmailValidationLevelEnum.YELLOW;
      default:
        return EmailValidationLevelEnum.RED;
    }
  }

  getPartialResults() {
    return this.partialResults;
  }

  private parseMixedType(value: string | boolean): boolean | string {
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    } else {
      return value;
    }
  }
}
