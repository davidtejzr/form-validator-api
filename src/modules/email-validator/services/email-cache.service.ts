import { Injectable } from '@nestjs/common';
import { Email } from '../../../schemas/email.schema';
import { EmailValidationStatus } from '../../../enums/email-validation-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EmailValidationResultInterface } from '../../../interfaces/email-validation-result.interface';

@Injectable()
export class EmailCacheService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
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

  async getEmailDomainSuggestions(email: string): Promise<string[]> {
    const results = await this.emailModel.aggregate([
      {
        $match: { email: { $regex: `@${email}`, $options: 'i' } },
      },
      {
        $project: {
          domain: {
            $substr: ['$email', { $indexOfBytes: ['$email', '@'] }, -1],
          },
        },
      },
      {
        $group: { _id: '$domain', count: { $sum: 1 } },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    return results.map((item) => item._id);
  }
}
