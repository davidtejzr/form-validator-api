import { Injectable } from '@nestjs/common';
import { Email } from '../../../schemas/email.schema';
import { EmailValidationStatus } from '../../../enums/email-validation-status.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailCacheService {
  constructor(
    @InjectModel(Email.name) private emailModel: Model<Email>,
    private configService: ConfigService,
  ) {}
  async getEmail(email: string): Promise<Email | null> {
    return this.emailModel.findOne({ email }).exec();
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
  ): Promise<void> {
    await this.emailModel.updateOne(
      { _id: email._id },
      { $set: { validationStatus, updatedAt: new Date() } },
    );
  }
}
