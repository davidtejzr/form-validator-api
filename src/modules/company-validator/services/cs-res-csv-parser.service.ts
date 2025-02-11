import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Company } from '../../../schemas/company.schema';

@Injectable()
export class CsResCsvParserService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async parseAndSaveCSV(filePath: string): Promise<void> {
    const stream = fs.createReadStream(filePath).pipe(csvParser());
    let processed = 0;

    for await (const row of stream) {
      if (row.DDATZAN === '' && row.FIRMA !== '') {
        await this.companyModel.updateOne(
          { ico: row.ICO },
          { $set: { ico: row.ICO, firma: row.FIRMA } },
          { upsert: true },
        );

        processed++;
        if (processed % 500 === 0)
          console.log(`Processed ${processed} records...`);
      }
    }

    console.log('CSV import completed successfully.');
  }
}
