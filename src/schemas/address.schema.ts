import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Address extends Document {
  @Prop({ required: true }) street: string;
  @Prop({ required: true, default: false }) hasStreetName: boolean;
  @Prop({ required: false }) houseNumber: string;
  @Prop({ required: true, index: true }) city: string;
  @Prop({ required: true, index: true }) postalCode: string;
  @Prop({ required: true }) country: string;
  @Prop({ required: false, default: null }) ruianRef: string;
  @Prop({ required: false, index: true }) streetHouseNumber: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
AddressSchema.index(
  { streetHouseNumber: 1 },
  { collation: { locale: 'cs', strength: 1 } },
);
AddressSchema.index({ city: 1 }, { collation: { locale: 'cs', strength: 1 } });
AddressSchema.index({ postalCode: 1 });
