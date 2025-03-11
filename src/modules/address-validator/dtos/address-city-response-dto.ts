import { ApiProperty } from '@nestjs/swagger';

export class AddressCityResponseDto {
  @ApiProperty()
  city?: string;

  @ApiProperty()
  postalCode?: string;

  @ApiProperty()
  country?: string;
}
