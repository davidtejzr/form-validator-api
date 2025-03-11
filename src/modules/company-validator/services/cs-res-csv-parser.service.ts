import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Company } from '../../../schemas/company.schema';
import { CsResCsvRowDto } from '../dtos/cs-res-csv-row-dto';

@Injectable()
export class CsResCsvParserService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async parseAndSaveCSV(filePath: string): Promise<void> {
    const stream = fs.createReadStream(filePath).pipe(csvParser());
    const now = new Date();
    let processed = 0;

    for await (const row of stream as AsyncIterable<CsResCsvRowDto>) {
      if (row.DDATZAN === '' && row.FIRMA !== '') {
        await this.companyModel.updateOne(
          { ico: row.ICO },
          {
            $set: {
              ico: row.ICO,
              firma: row.FIRMA,
              lastUpdate: now,
            },
          },
          { upsert: true },
        );

        processed++;
        if (processed % 1000 === 0)
          console.log(`Processed ${processed} records...`);
      }
    }

    await this.companyModel.deleteMany({ lastUpdate: { $lt: now } });
    console.log('CSV import completed successfully.');
  }
}
