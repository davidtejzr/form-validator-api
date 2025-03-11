import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CompanyValidatorService } from './company-validator.service';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CompanyResponseDto } from './dtos/company-response-dto';

@Controller('company-validator')
export class CompanyValidatorController {
  constructor(private readonly companyValidator: CompanyValidatorService) {}

  @Post('ico/validate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Company ICO validation, returns company details',
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
    description: 'Returns company details if ICO is valid',
    type: CompanyResponseDto,
  })
  async validateCompanyByIco(
    @Body('ico') ico: string,
  ): Promise<CompanyResponseDto> {
    return this.companyValidator.hasValidIco(ico);
  }

  @Get('ico/autocomplete')
  @ApiOperation({
    summary: 'Search by ICO, returns array of suggested companies',
  })
  @ApiQuery({
    name: 'ico',
    type: String,
    minLength: 1,
    maxLength: 8,
    default: '09272003',
    description: 'ICO to search by',
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
    type: [CompanyResponseDto],
  })
  async searchCompanyByIco(
    @Query('ico') ico: string,
    @Query('limit') limit: number,
  ): Promise<CompanyResponseDto[]> {
    return this.companyValidator.prefixSearchCompanyByIco(ico, limit);
  }

  @Post('dic/validate')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Company DIC validation, returns company details',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        dic: {
          type: 'string',
          default: 'CZ61989100',
          minLength: 8,
          maxLength: 12,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Returns company details if DIC is valid',
    type: CompanyResponseDto,
  })
  async validateCompanyByDic(
    @Body('dic') dic: string,
  ): Promise<CompanyResponseDto> {
    return this.companyValidator.hasValidDic(dic);
  }

  @Get('dic/autocomplete')
  @ApiOperation({
    summary: 'Search by DIC, returns array of suggested companies',
  })
  @ApiQuery({
    name: 'dic',
    type: String,
    minLength: 1,
    maxLength: 12,
    default: 'CZ61989100',
    description: 'DIC to search by',
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
    type: [CompanyResponseDto],
  })
  async searchCompanyByDic(
    @Query('dic') dic: string,
    @Query('limit') limit: number,
  ): Promise<CompanyResponseDto[]> {
    return this.companyValidator.prefixSearchCompanyByDic(dic, limit);
  }

  @Get('company-name/autocomplete')
  @ApiOperation({
    summary: 'Basic company search, returns array of suggested companies',
  })
  @ApiQuery({
    name: 'companyName',
    type: String,
    minLength: 1,
    maxLength: 2000,
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
    type: [CompanyResponseDto],
  })
  async searchCompanyByName(
    @Query('companyName') companyName: string,
    @Query('limit') limit: number,
  ): Promise<CompanyResponseDto[]> {
    return this.companyValidator.prefixSearchCompanyByName(companyName, limit);
  }
}
