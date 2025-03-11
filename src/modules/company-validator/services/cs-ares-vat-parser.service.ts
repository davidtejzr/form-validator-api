import { Injectable } from '@nestjs/common';
import { CompanyValidatorService } from '../company-validator.service';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from '../../../schemas/company.schema';
import { Model } from 'mongoose';

@Injectable()
export class CsAresVatParserService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    private readonly companyValidator: CompanyValidatorService,
  ) {}

  async observeAndSaveVats(): Promise<void> {
    const batchSize = 100;
    const delay = 15000; // 15 seconds
    const cursor = this.companyModel.find({ isVatPayer: null }).cursor();
    let processed = 0;

    let batch = [];
    for (
      let company = await cursor.next();
      company != null;
      company = await cursor.next()
    ) {
      batch.push(company);
      processed++;
      if (batch.length === batchSize) {
        await Promise.all(
          batch.map((company) =>
            this.companyValidator.observeDicByIcoUsingAres(company.ico),
          ),
        );
        batch = [];
        await new Promise((resolve) => setTimeout(resolve, delay));
        console.log(`Processed ${processed} records...`);
      }
    }

    // Process any remaining companies in the last batch
    if (batch.length > 0) {
      await Promise.all(
        batch.map((company) =>
          this.companyValidator.observeDicByIcoUsingAres(company.ico),
        ),
      );
      console.log(`Processed remaining ${batch.length} records...`);
    }
  }
}
