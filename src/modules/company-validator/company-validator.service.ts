import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AresSearchResponseInterface } from '../../interfaces/ares-search-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from '../../schemas/company.schema';
import { Model } from 'mongoose';
import { CompanyResponseDto } from './dtos/company-response-dto';

@Injectable()
export class CompanyValidatorService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async hasValidIco(ico: string): Promise<CompanyResponseDto> {
    if (ico.length !== 8) {
      return { isValid: false };
    }
    const result = await this.companyModel
      .find()
      .where('ico')
      .equals(ico)
      .exec();

    const firstResult = result?.[0];
    if (!firstResult) {
      return { isValid: false };
    }

    return {
      isValid: true,
      ico: firstResult.ico,
      dic: firstResult.dic,
      companyName: firstResult.firma,
    };
  }

  async prefixSearchCompanyByIco(
    ico: string,
    limit = 5,
  ): Promise<CompanyResponseDto[]> {
    const result = await this.companyModel
      .find({ ico: { $gte: ico, $lt: ico + '\uffff' } })
      .sort({ ico: 1 })
      .limit(limit)
      .exec();

    return result.map((company) => ({
      isValid: true,
      ico: company.ico,
      dic: company.dic,
      companyName: company.firma,
    }));
  }

  async hasValidDic(dic: string): Promise<CompanyResponseDto> {
    if (dic.length >= 12) {
      return { isValid: false };
    }
    const result = await this.companyModel
      .find()
      .where('dic')
      .equals(dic)
      .exec();

    const firstResult = result?.[0];
    if (!firstResult) {
      return { isValid: false };
    }

    return {
      isValid: true,
      ico: firstResult.ico,
      dic: firstResult.dic,
      companyName: firstResult.firma,
    };
  }

  async prefixSearchCompanyByDic(
    dic: string,
    limit = 5,
  ): Promise<CompanyResponseDto[]> {
    const result = await this.companyModel
      .find({ dic: { $gte: dic, $lt: dic + '\uffff' } })
      .sort({ dic: 1 })
      .limit(limit)
      .exec();

    return result.map((company) => ({
      isValid: true,
      ico: company.ico,
      dic: company.dic,
      companyName: company.firma,
    }));
  }

  async prefixSearchCompanyByName(
    companyName: string,
    limit = 5,
  ): Promise<CompanyResponseDto[]> {
    const result = await this.companyModel
      .find({ firma: { $gte: companyName, $lt: companyName + '\uffff' } })
      .collation({ locale: 'cs', strength: 1 })
      .sort({ firma: 1 })
      .limit(limit)
      .exec();

    return result.map((company) => ({
      isValid: true,
      ico: company.ico,
      dic: company.dic,
      companyName: company.firma,
    }));
  }

  async regexSearchCompanyByName(
    companyName: string,
    limit = 5,
  ): Promise<string[]> {
    const result = await this.companyModel
      .find({ firma: new RegExp(companyName, 'i') })
      .collation({ locale: 'cs', strength: 1 })
      .limit(limit)
      .exec();
    return result.map((company) => company.firma);
  }

  async searchCompanyByNameUsingAres(companyName: string): Promise<string[]> {
    const response = await axios
      .post<any, AxiosResponse<AresSearchResponseInterface, any>>(
        `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/vyhledat`,
        {
          pocet: 10,
          obchodniJmeno: companyName,
        },
      )
      .catch((error) => {
        console.error('Error fetching data from ARES: ', error);
      });
    if (response) {
      return response.data.ekonomickeSubjekty.map(
        (company) => `${company.obchodniJmeno} | ${company.ico}`,
      );
    }
    return [];
  }

  async hasValidIcoUsingAres(ico: string): Promise<boolean> {
    if (ico.length !== 8) {
      return false;
    }
    const response = await axios
      .get(
        `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${ico}`,
      )
      .catch(() => {});
    return !!response;
  }
}
