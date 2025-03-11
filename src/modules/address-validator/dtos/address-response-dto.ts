import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty()
  isValid: boolean;

  @ApiPropertyOptional()
  street?: string;

  @ApiPropertyOptional()
  houseNumber?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  country?: string;
}
