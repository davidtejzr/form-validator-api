import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AddressValidatorService } from './address-validator.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AddressResponseDto } from './dtos/address-response-dto';
import { PartialAddressSearchDto } from './dtos/partial-address-search-dto';
import { AddressCityResponseDto } from './dtos/address-city-response-dto';

@Controller('address-validator')
export class AddressValidatorController {
  constructor(
    private readonly addressValidatorService: AddressValidatorService,
  ) {}

  @Post('partial/validate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Partial address validation, returns address details',
  })
  @ApiBody({ type: PartialAddressSearchDto })
  @ApiResponse({
    status: 200,
    description: 'Returns address details when input is valid',
    type: AddressResponseDto,
  })
  partialAddressValidate(
    @Body() partialAddressSearch: PartialAddressSearchDto,
  ) {
    return this.addressValidatorService.isValidPartialAddress(
      partialAddressSearch,
    );
  }

  @Get('partial/street-autocomplete')
  @ApiOperation({
    summary: 'Streets and house numbers autocomplete, returns array',
  })
  @ApiQuery({
    name: 'streetHouseNumber',
    type: String,
    minLength: 5,
    maxLength: 100,
    default: '17. listopadu 2172/15',
    description: 'Street and house number to search by',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    minimum: 1,
    maximum: 20,
    default: 5,
    description: 'Maximum rows to return',
    required: true,
  })
  @ApiQuery({
    name: 'useLucene',
    type: Boolean,
    default: false,
    description: 'Use MongoDB Atlas Lucene search instead of regex',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of suggested address points',
    type: [AddressResponseDto],
  })
  streetAutocomplete(
    @Query('streetHouseNumber') streetHouseNumber: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('useLucene', new ParseBoolPipe({ optional: true }))
    useLucene?: boolean,
  ) {
    if (useLucene) {
      return this.addressValidatorService.luceneStreetHouseNumberSearch(
        streetHouseNumber,
        limit,
      );
    }
    return this.addressValidatorService.prefixStreetHouseNumberSearch(
      streetHouseNumber,
      limit,
    );
  }

  @Get('partial/city-autocomplete')
  @ApiOperation({
    summary: 'Cities autocomplete, returns array',
  })
  @ApiQuery({
    name: 'city',
    type: String,
    minLength: 1,
    maxLength: 50,
    default: 'Ostrava',
    description: 'City to search by',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    minimum: 1,
    maximum: 20,
    default: 5,
    description: 'Maximum rows to return',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of cities',
    type: [AddressCityResponseDto],
  })
  cityAutocomplete(
    @Query('city') city: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.addressValidatorService.citySearch(city, limit);
  }

  @Get('partial/postalcode-autocomplete')
  @ApiOperation({
    summary: 'Postal codes autocomplete, returns array',
  })
  @ApiQuery({
    name: 'postalCode',
    type: Number,
    minLength: 1,
    maxLength: 5,
    default: 70800,
    description: 'Postal code to search by',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    minimum: 1,
    maximum: 20,
    default: 5,
    description: 'Maximum rows to return',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of postal codes',
    type: [AddressCityResponseDto],
  })
  postalCodeAutocomplete(
    @Query('postalCode') postalCode: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.addressValidatorService.postalCodeSearch(postalCode, limit);
  }

  @Post('full/validate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Full address validation, returns address details',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullAddress: {
          type: 'string',
          default: '17. listopadu 2172/15 708 00 Ostrava-Poruba',
          minLength: 10,
          maxLength: 200,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns address details when input is valid',
    type: AddressResponseDto,
  })
  fullAddressValidate(@Query('fullAddress') fullAddress: string) {
    return this.addressValidatorService.isValidAddress(fullAddress);
  }

  @Get('full/autocomplete')
  @ApiOperation({
    summary:
      'Search by full address, returns array of suggested address points',
  })
  @ApiQuery({
    name: 'fullAddress',
    type: String,
    minLength: 10,
    maxLength: 200,
    default: '17. listopadu 2172/15 708 00 Ostrava-Poruba',
    description: 'Full address to search by',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    minimum: 1,
    maximum: 20,
    default: 5,
    description: 'Maximum rows to return',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Return array of suggested address points',
    type: [AddressResponseDto],
  })
  fullAddressAutocomplete(
    @Query('fullAddress') fullAddress: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.addressValidatorService.fullAddressSearch(fullAddress, limit);
  }
}
