import { Module } from '@nestjs/common';
import { EmailValidatorController } from './email-validator.controller';
import { EmailValidatorService } from './email-validator.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Email, EmailSchema } from '../../schemas/email.schema';
import { ConfigModule } from '@nestjs/config';
import { EmailCacheService } from './services/email-cache.service';
import { EmailDnsResolverService } from './services/email-dns-resolver.service';
import { EmailFilterService } from './services/email-filter.service';
import { EmailFormatValidatorService } from './services/email-format-validator.service';
import { EmailSmtpResolverService } from './services/email-smtp-resolver.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Email.name, schema: EmailSchema }]),
    ConfigModule,
  ],
  controllers: [EmailValidatorController],
  providers: [
    EmailFormatValidatorService,
    EmailCacheService,
    EmailValidatorService,
    EmailFilterService,
    EmailDnsResolverService,
    EmailSmtpResolverService,
  ],
})
export class EmailValidatorModule {}
