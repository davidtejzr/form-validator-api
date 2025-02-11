import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { AresSearchResponseInterface } from '../../interfaces/ares-search-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from '../../schemas/company.schema';
import { Model } from 'mongoose';

@Injectable()
export class CompanyValidatorService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) {}

  async hasValidIco(ico: string): Promise<boolean> {
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

  async searchCompanyByName(companyName: string, limit = 5): Promise<string[]> {
    const result = await this.companyModel
      .find({ firma: { $gte: companyName, $lt: companyName + '\uffff' } })
      .collation({ locale: 'cs', strength: 1 })
      .sort({ firma: 1 })
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
}
