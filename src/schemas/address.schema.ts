import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {
  @Prop({ required: true }) street: string;
  @Prop({ required: true, default: false }) hasStreetName: boolean;
  @Prop({ required: false }) houseNumber: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) postalCode: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: false, default: null }) ruianRef: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
