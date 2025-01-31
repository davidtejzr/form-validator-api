import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Domain extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 1 })
  searchCount: number;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
