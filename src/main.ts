import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Form Validator API')
    .setDescription(
      'The Form Validator API provides a comprehensive RESTful service for validating and autocompleting common form data elements. It offers endpoints for email validation with multiple levels of verification and domain suggestions, company validation against official registers with identifier verification and name autocompletion, and address validation with intelligent suggestions for streets, cities, and postal codes. This solution helps developers build smarter, more user-friendly web forms by reducing input errors and improving data quality through real-time validation and intelligent autocompletion features.',
    )
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
