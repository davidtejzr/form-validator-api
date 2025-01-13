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

@Injectable()
export class EmailValidatorService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    private cacheService: EmailCacheService,
    private formatValidatorService: EmailFormatValidatorService,
    private filterService: EmailFilterService,
    private dnsResolverService: EmailDnsResolverService,
    private smtpResolverService: EmailSmtpResolverService,
  ) {}

  async validateEmail(email: string): Promise<EmailValidationStatus> {
    console.log('email to resolve:', email);
    if (!this.formatValidatorService.acceptRfc5322Standard(email)) {
      return EmailValidationStatus.INVALID_FORMAT;
    }

    let emailInstance = await this.cacheService.getEmail(email);
    if (emailInstance) {
      await this.cacheService.increaseSearchCount(emailInstance);
      if (!this.cacheService.isOutdated(emailInstance.updatedAt)) {
        console.log('cache hit');
        return emailInstance.validationStatus;
      }
    } else {
      emailInstance = await new this.emailModel({ email }).save();
    }

    console.log('instance:', emailInstance);
    const validationStatus = await this.resolveValidationStatus(
      emailInstance.email,
    );

    await this.cacheService.persistValidationStatus(
      emailInstance,
      validationStatus,
    );
    return validationStatus;
  }

  private async resolveValidationStatus(
    email: string,
  ): Promise<EmailValidationStatus> {
    const domain = email.split('@')[1];

    const mxRecord =
      await this.dnsResolverService.getHighestPriorityMxRecord(domain);
    if (typeof mxRecord === 'boolean') {
      return EmailValidationStatus.NO_MX_RECORDS;
    }

    const isDeliverable = await this.smtpResolverService.isEmailDeliverable(
      mxRecord,
      email,
    );
    if (!isDeliverable) {
      return EmailValidationStatus.UNDELIVERABLE_ADDRESS;
    }

    const isDisposable = this.filterService.isDisposableDomain(domain);
    if (isDisposable) {
      return EmailValidationStatus.DISPOSABLE_ADDRESS;
    }

    return EmailValidationStatus.VALID;
  }
}
