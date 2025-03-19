import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailValidatorModule } from './modules/email-validator/email-validator.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { CompanyValidatorModule } from './modules/company-validator/company-validator.module';
import { AddressValidatorModule } from './modules/address-validator/address-validator.module';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('databaseUri'),
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      resolvers: [AcceptLanguageResolver],
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    EmailValidatorModule,
    CompanyValidatorModule,
    AddressValidatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
