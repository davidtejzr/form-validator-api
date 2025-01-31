import { Body, Controller, Post } from '@nestjs/common';
import { CompanyValidatorService } from './company-validator.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('company-validator')
export class CompanyValidatorController {
  constructor(private readonly companyValidator: CompanyValidatorService) {}

  @Post('validate')
  @ApiOperation({
    summary: 'Basic company validation, returns boolean value',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { companyName: { type: 'string', default: 'Alza.cz a.s.' } },
    },
  })
  async validateEmailBasic(@Body('companyName') companyName: string) {
    return this.companyValidator.validateCompany(companyName);
  }
}
