import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CompanyValidatorService } from './company-validator.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('company-validator')
export class CompanyValidatorController {
  constructor(private readonly companyValidator: CompanyValidatorService) {}

  @Post('ico/validate')
  @ApiOperation({
    summary: 'Company ICO validation, returns boolean value',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ico: {
          type: 'string',
          default: '09272003',
          minLength: 8,
          maxLength: 8,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Return boolean value',
    type: Boolean,
  })
  async validateCompanyByIco(@Body('ico') ico: string) {
    return this.companyValidator.hasValidIco(ico);
  }

  @Get('company-name/autocomplete')
  @ApiOperation({
    summary: 'Basic company search, returns array of suggested companies',
  })
  @ApiQuery({
    name: 'companyName',
    type: String,
    minimum: 1,
    maximum: 2000,
    default: 'Alza.cz',
    description: 'Company name to search',
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
    description: 'Return array of suggested companies',
    type: [String],
  })
  async searchCompanyByName(@Query('companyName') companyName: string, @Query('limit') limit: number) {
    return this.companyValidator.searchCompanyByName(companyName, limit);
  }
}
