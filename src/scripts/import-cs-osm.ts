import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { OsmParserService } from '../modules/address-validator/services/osm-parser.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const osmParserService = app.get(OsmParserService);
  const filePath = './data-providers/osm/data/addresses.geojson';

  try {
    await osmParserService.parseAndSaveOsm(filePath);
    console.log('OSM data successfully imported.');
  } catch (error) {
    console.error('Error importing OSM:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
