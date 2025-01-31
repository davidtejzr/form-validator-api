import { Module } from '@nestjs/common';
import { CompanyValidatorController } from './company-validator.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from '../../schemas/email.schema';
import { ConfigModule } from '@nestjs/config';
import { CompanyValidatorService } from './company-validator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    ConfigModule,
  ],
  controllers: [CompanyValidatorController],
  providers: [CompanyValidatorService],
})
export class CompanyValidatorModule {}
