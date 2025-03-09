import { Module } from '@nestjs/common';
import { AddressValidatorController } from './address-validator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AddressValidatorService } from './address-validator.service';
import { Address, AddressSchema } from '../../schemas/address.schema';
import { OsmParserService } from './services/osm-parser.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }]),
    ConfigModule,
  ],
  controllers: [AddressValidatorController],
  providers: [AddressValidatorService, OsmParserService],
  exports: [OsmParserService],
})
export class AddressValidatorModule {}
