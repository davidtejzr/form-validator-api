import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Email } from '../../schemas/email.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompanyValidatorService {
  constructor(@InjectModel(Email.name) private emailModel: Model<Email>) {}

  async validateCompany(value: string): Promise<boolean> {
    console.log(value);
    return false;
  }
}
