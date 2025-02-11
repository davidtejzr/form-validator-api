import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmailValidationStatus } from '../enums/email-validation-status.enum';

@Schema({ versionKey: false })
export class Email extends Document {
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 254 })
  email: string;

  @Prop({ required: true })
  domain: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ enum: EmailValidationStatus, default: EmailValidationStatus.PENDING })
  validationStatus: EmailValidationStatus;

  @Prop({ default: 1 })
  searchCount: number;

  @Prop({ default: null })
  noMxRecords: boolean;

  @Prop({ default: null, type: String })
  blacklistedDomain: boolean | 'failed';

  @Prop({ default: null })
  disposableAddress: boolean;

  @Prop({ default: null, type: String })
  deliverableAddress: boolean | 'undeclared';
}

export const EmailSchema = SchemaFactory.createForClass(Email);
