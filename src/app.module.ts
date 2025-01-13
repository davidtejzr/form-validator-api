import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailValidatorModule } from './modules/email-validator/email-validator.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
