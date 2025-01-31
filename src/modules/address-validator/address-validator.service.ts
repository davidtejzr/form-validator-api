import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../schemas/address.schema';

@Injectable()
export class AddressValidatorService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async search(query: string) {
    return this.addressModel
      .find({ $text: { $search: query } })
      .limit(10)
      .exec();
  }
}
