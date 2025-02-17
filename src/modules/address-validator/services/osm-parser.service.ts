import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../../schemas/address.schema';

export class OsmParserService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  // async parseAndSaveOsm(filePath: string): Promise<void> {}
}
