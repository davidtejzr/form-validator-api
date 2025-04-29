import { ApiProperty } from '@nestjs/swagger';

export class EmailValidationResultDto {
  @ApiProperty({ type: Boolean, nullable: true })
  cachedResult: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  invalidFormat: boolean | null;

  @ApiProperty({ type: Boolean, nullable: true })
  noMxRecords: boolean | null;

  @ApiProperty({
    type: 'string',
    enum: [true, false, 'failed'],
    nullable: true,
  })
  blacklistedDomain: boolean | 'failed' | null;

  @ApiProperty({ type: Boolean, nullable: true })
  disposableAddress: boolean | null;

  @ApiProperty({
    type: 'string',
    enum: [true, false, 'undeclared'],
    nullable: true,
  })
  undeliverableAddress: boolean | 'undeclared' | null;
}
