import { Injectable } from '@nestjs/common';
import { Email } from '../../../schemas/email.schema';
import { EmailValidationStatus } from '../../../enums/email-validation-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EmailValidationResultInterface } from '../../../interfaces/email-validation-result.interface';
import { Domain } from '../../../schemas/domain.schema';

@Injectable()
export class EmailCacheService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    @InjectModel(Domain.name) private domainModel: Model<Domain>,
    private configService: ConfigService,
  ) {}
  async getEmail(email: string): Promise<Email | null> {
    return this.emailModel.findOne({ email }).exec();
  }

  async saveEmail(email: string): Promise<Email> {
    const domain = email.split('@')[1];
    return await new this.emailModel({ email, domain }).save();
  }

  isOutdated(date: Date): boolean {
    const current = new Date();
    const cacheTime = parseInt(
      this.configService.get<string>('cacheTimeMs') || '0',
    );
    return current.getTime() > date.getTime() + cacheTime;
  }

  async increaseSearchCount(email: Email): Promise<void> {
    await this.emailModel
      .updateOne({ _id: email._id }, { $inc: { searchCount: 1 } })
      .exec();
  }

  async persistValidationStatus(
    email: Email,
    validationStatus: EmailValidationStatus,
    partialResults: EmailValidationResultInterface,
  ): Promise<void> {
    const {
      noMxRecords,
      blacklistedDomain,
      disposableAddress,
      deliverableAddress,
    } = partialResults;

    await this.emailModel.updateOne(
      { _id: email._id },
      {
        $set: {
          validationStatus,
          noMxRecords,
          blacklistedDomain,
          disposableAddress,
          deliverableAddress,
          updatedAt: new Date(),
        },
      },
    );
  }

  async checkAndSaveDomain(
    domain: string,
    partialResults: EmailValidationResultInterface,
  ): Promise<void> {
    if (
      partialResults.noMxRecords ||
      partialResults.blacklistedDomain === true ||
      partialResults.disposableAddress
    ) {
      return;
    }

    const existingDomain = await this.domainModel.findOne({
      name: domain,
    });
    if (existingDomain) {
      await this.domainModel.updateOne(
        { _id: existingDomain._id },
        { $inc: { searchCount: 1 } },
      );
    } else {
      await new this.domainModel({ name: domain, searchCount: 1 }).save();
    }
  }

  async getEmailDomainSuggestions(email: string, limit = 5): Promise<string[]> {
    const domain = email.split('@')[1];
    return this.domainModel
      .find({ name: new RegExp(`^${domain}`, 'i') })
      .sort({ searchCount: 'desc' })
      .limit(limit)
      .then((domains) => domains.map((d) => d.name));
  }
}
