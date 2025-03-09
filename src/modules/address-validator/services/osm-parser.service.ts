import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../../schemas/address.schema';
import * as fs from 'fs';
import * as JSONStream from 'jsonstream';

export class OsmParserService {
  jsonFilePath = 'czech-republic-latest.json';
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async parseAndSaveOsm(filePath: string): Promise<void> {
    const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });
    const jsonStream = JSONStream.parse('features.*'); // Streamuje jednotlivé "features"

    const batch: any[] = [];
    const BATCH_SIZE = 1000;

    await new Promise<void>((resolve, reject) => {
      jsonStream.on('data', async (feature: any) => {
        if (
          !feature.properties ||
          !feature.properties['addr:street'] ||
          (!feature.properties['addr:city'] &&
            !feature.properties['addr:place']) ||
          !feature.properties['addr:postcode'] ||
          !feature.properties['addr:country']
        )
          return;

        batch.push({
          street: feature.properties['addr:street'],
          houseNumber: feature.properties['addr:housenumber'] || null,
          city:
            feature.properties['addr:city'] || feature.properties['addr:place'],
          postalCode: feature.properties['addr:postcode'],
          country: feature.properties['addr:country'],
        });

        if (batch.length >= BATCH_SIZE) {
          jsonStream.pause();
          await this.addressModel.insertMany(batch);
          console.log(`Uloženo ${BATCH_SIZE} adres.`);
          batch.length = 0; // Vyprázdnění bufferu
          jsonStream.resume();
        }
      });

      jsonStream.on('end', async () => {
        if (batch.length > 0) {
          await this.addressModel.insertMany(batch);
          console.log(`Uloženo posledních ${batch.length} adres.`);
        }
        console.log('Import dokončen!');
        resolve();
      });

      jsonStream.on('error', (err: string) => {
        console.error('Chyba při čtení GeoJSON souboru:', err);
        reject(err);
      });

      stream.pipe(jsonStream);
    });
  }
}
