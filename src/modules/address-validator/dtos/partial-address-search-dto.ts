import { ApiProperty } from '@nestjs/swagger';

export class PartialAddressSearchDto {
  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 50,
    default: '17. listopadu',
  })
  street: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 50,
    default: '2172/15',
  })
  houseNumber: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 50,
    default: 'Ostrava-Poruba',
  })
  city: string;

  @ApiProperty({ type: Number, minLength: 5, maxLength: 5, default: 70800 })
  postalCode: string;

  @ApiProperty({
    type: String,
    minLength: 1,
    maxLength: 5,
    default: 'CZ',
  })
  country: string;
}
