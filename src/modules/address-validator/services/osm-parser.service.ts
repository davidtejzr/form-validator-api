import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../../schemas/address.schema';
import * as fs from 'fs';
import * as JSONStream from 'jsonstream';

export class OsmParserService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async parseAndSaveOsm(filePath: string): Promise<void> {
    await this.addressModel.collection.drop();
    const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const jsonStream = JSONStream.parse('features.*');
    let processed = 0;

    const batch: any[] = [];
    const BATCH_SIZE = 1000;

    await new Promise<void>((resolve, reject) => {
      jsonStream.on('data', async (feature: any) => {
        if (
          !feature.properties ||
          !feature.properties['addr:housenumber'] ||
          (!feature.properties['addr:city'] &&
            !feature.properties['addr:place']) ||
          !feature.properties['addr:postcode'] ||
          !feature.properties['addr:country']
        )
          return;

        const city =
          feature.properties['addr:city'] || feature.properties['addr:place'];
        const street = feature.properties['addr:street'] || city;
        const houseNumber = feature.properties['addr:housenumber'];

        batch.push({
          street,
          hasStreetName: !!feature.properties['addr:street'],
          houseNumber,
          city,
          postalCode: feature.properties['addr:postcode'].replace(' ', ''),
          country: feature.properties['addr:country'],
          ruianRef: feature.properties['ref:ruian:addr'],
          streetHouseNumber: `${street} ${houseNumber}`,
        });

        processed++;
        if (batch.length >= BATCH_SIZE) {
          jsonStream.pause();
          await this.addressModel.insertMany(batch);
          console.log(`Processed ${processed} records...`);
          batch.length = 0;
          jsonStream.resume();
        }
      });

      jsonStream.on('end', async () => {
        if (batch.length > 0) {
          await this.addressModel.insertMany(batch);
          console.log(`Processed last ${batch.length} records.`);
        }
        console.log('OSM import completed successfully!');
        resolve();
      });

      jsonStream.on('error', (err: string) => {
        console.error('Error when reading GeoJSON file:', err);
        reject(err);
      });

      stream.pipe(jsonStream);
    });
  }
}
