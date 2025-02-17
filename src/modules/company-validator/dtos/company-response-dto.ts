import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty()
  isValid: boolean;

  @ApiPropertyOptional()
  ico?: string;

  @ApiPropertyOptional()
  dic?: string;

  @ApiPropertyOptional()
  companyName?: string;
}
