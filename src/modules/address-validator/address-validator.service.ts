import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../schemas/address.schema';

@Injectable()
export class AddressValidatorService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async fullAddressAutocomplete(query: string) {
    const regexQuery = new RegExp(`^${query}`, 'i');
    return this.addressModel
      .find({
        $or: [
          { street: { $regex: regexQuery } },
          { city: { $regex: regexQuery } },
          { houseNumber: { $regex: regexQuery } },
        ],
      })
      .limit(5)
      .exec();
  }
}
