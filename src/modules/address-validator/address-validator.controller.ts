import { Controller, Get, Query } from '@nestjs/common';
import { AddressValidatorService } from './address-validator.service';

@Controller('address-validator')
export class AddressValidatorController {
  constructor(
    private readonly addressValidatorService: AddressValidatorService,
  ) {}

  @Get('search')
  search(@Query('q') query: string) {
    return this.addressValidatorService.search(query);
  }
}
