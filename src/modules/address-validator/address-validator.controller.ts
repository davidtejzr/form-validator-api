import { Controller, Get, Query } from '@nestjs/common';
import { AddressValidatorService } from './address-validator.service';

@Controller('address-validator')
export class AddressValidatorController {
  constructor(
    private readonly addressValidatorService: AddressValidatorService,
  ) {}

  @Get('full-address/autocomplete')
  search(@Query('query') query: string) {
    return this.addressValidatorService.fullAddressAutocomplete(query);
  }
}
