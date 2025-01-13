import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EmailValidationStatus } from '../enums/email-validation-status.enum';

@Schema({ versionKey: false })
export class Email extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ enum: EmailValidationStatus, default: EmailValidationStatus.PENDING })
  validationStatus: EmailValidationStatus;

  @Prop({ default: 1 })
  searchCount: number;
}

export const EmailSchema = SchemaFactory.createForClass(Email);
