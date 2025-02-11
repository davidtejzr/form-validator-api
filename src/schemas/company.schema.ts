import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Company extends Document {
  @Prop({ required: true, unique: true, index: true })
  ico: string;

  @Prop({ required: true })
  firma: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
CompanySchema.index({ firma: 1 }, { collation: { locale: 'cs', strength: 1 } });
