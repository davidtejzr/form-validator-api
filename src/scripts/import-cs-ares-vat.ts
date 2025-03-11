import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CsAresVatParserService } from '../modules/company-validator/services/cs-ares-vat-parser.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const aresVatParserService = app.get(CsAresVatParserService);

  try {
    await aresVatParserService.observeAndSaveVats();
    console.log('ARES data successfully imported.');
  } catch (error) {
    console.error('Error importing from ARES:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
