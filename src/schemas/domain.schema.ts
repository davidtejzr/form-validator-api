import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Domain extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: 1 })
  searchCount: number;

  @Prop({ default: Date.now, required: true })
  createdAt: Date;

  @Prop({ default: Date.now, required: true })
  updatedAt: Date;
}

export const DomainSchema = SchemaFactory.createForClass(Domain);
