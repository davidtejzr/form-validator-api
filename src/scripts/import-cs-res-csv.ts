import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CsResCsvParserService } from '../modules/company-validator/services/cs-res-csv-parser.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const csvService = app.get(CsResCsvParserService);

  try {
    await csvService.parseAndSaveCSV('./data/res_data.csv');
    console.log('CSV data successfully imported.');
  } catch (error) {
    console.error('Error importing CSV:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
