import { Module } from '@nestjs/common';
import { CompanyValidatorController } from './company-validator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CompanyValidatorService } from './company-validator.service';
import { CsResCsvParserService } from './services/cs-res-csv-parser.service';
import { Company, CompanySchema } from '../../schemas/company.schema';
import { CsAresVatParserService } from './services/cs-ares-vat-parser.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    ConfigModule,
  ],
  controllers: [CompanyValidatorController],
  providers: [
    CompanyValidatorService,
    CsResCsvParserService,
    CsAresVatParserService,
  ],
  exports: [CsResCsvParserService],
})
export class CompanyValidatorModule {}
