import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailValidatorModule } from './modules/email-validator/email-validator.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { CompanyValidatorModule } from './modules/company-validator/company-validator.module';
import { AddressValidatorModule } from './modules/address-validator/address-validator.module';

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
    EmailValidatorModule,
    CompanyValidatorModule,
    AddressValidatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
