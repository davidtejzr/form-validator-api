import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../schemas/address.schema';
import { PartialAddressSearchDto } from './dtos/partial-address-search-dto';
import { AddressResponseDto } from './dtos/address-response-dto';
import { AddressCityResponseDto } from './dtos/address-city-response-dto';

@Injectable()
export class AddressValidatorService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async isValidPartialAddress(
    pas: PartialAddressSearchDto,
  ): Promise<AddressResponseDto> {
    const result = await this.addressModel
      .find({
        $and: [
          { street: { $regex: new RegExp(`^${pas.street}`, 'i') } },
          { houseNumber: { $regex: new RegExp(`^${pas.houseNumber}`, 'i') } },
          {
            city: {
              $regex: new RegExp(pas.city.split(/[\s-]/).join('|'), 'i'),
            },
          },
          { postalCode: { $regex: new RegExp(`^${pas.postalCode}`, 'i') } },
          { country: { $regex: new RegExp(`^${pas.country}`, 'i') } },
        ],
      })
      .exec();

    const firstResult = result?.[0];
    if (!firstResult) {
      return { isValid: false };
    }

    return {
      isValid: true,
      street: firstResult.street,
      houseNumber: firstResult.houseNumber,
      city: firstResult.city,
      postalCode: firstResult.postalCode,
      country: firstResult.country,
    };
  }

  // todo: vyhledávání ulice.. varianta group by podle města?
  // todo: ignorovat diakritiku

  async streetAndHouseNumberSearch(streetAndHouseNumber: string, limit = 5) {
    const escapedSearchTerm = streetAndHouseNumber.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    ); // Escapujeme speciální znaky
    const regexQuery = new RegExp(`^${escapedSearchTerm}`, 'i');

    return this.addressModel
      .find({
        $expr: {
          $regexMatch: {
            input: { $concat: ['$street', ' ', '$houseNumber'] },
            regex: regexQuery,
          },
        },
      })
      .limit(limit)
      .select('street houseNumber city postalCode country -_id')
      .exec();
  }

  async citySearch(
    query: string,
    limit = 5,
  ): Promise<AddressCityResponseDto[]> {
    const regexQuery = new RegExp(`^${query}`, 'i');
    return await this.addressModel
      .aggregate([
        {
          $match: { city: { $regex: regexQuery } },
        },
        {
          $group: {
            _id: {
              city: '$city',
              postalCode: '$postalCode',
              country: '$country',
            },
            city: { $first: '$city' },
            postalCode: { $first: '$postalCode' },
            country: { $first: '$country' },
          },
        },
        { $sort: { city: 1, postalCode: 1, country: 1 } },
        { $limit: limit },
        {
          $project: { _id: 0, city: 1, postalCode: 1, country: 1 },
        },
      ])
      .exec();
  }

  async postalCodeSearch(query: string, limit = 5): Promise<string[]> {
    const regexQuery = new RegExp(`^${query}`, 'i');
    return await this.addressModel
      .aggregate([
        {
          $match: { postalCode: { $regex: regexQuery } },
        },
        {
          $group: {
            _id: {
              postalCode: '$postalCode',
              city: '$city',
              country: '$country',
            },
            postalCode: { $first: '$postalCode' },
            city: { $first: '$city' },
            country: { $first: '$country' },
          },
        },
        { $sort: { postalCode: 1, city: 1, country: 1 } },
        { $limit: limit },
        {
          $project: { _id: 0, postalCode: 1, city: 1, country: 1 },
        },
      ])
      .exec();
  }

  async isValidAddress(query: string) {
    const regexQuery = new RegExp(`^${query}`, 'i');
    return this.addressModel
      .find({
        $or: [
          { street: { $regex: regexQuery } },
          { city: { $regex: regexQuery } },
          { houseNumber: { $regex: regexQuery } },
        ],
      })
      .exec();
  }

  async fullAddressSearch(query: string, limit = 5) {
    const regexQuery = new RegExp(`^${query}`, 'i');
    return this.addressModel
      .find({
        $or: [
          { street: { $regex: regexQuery } },
          { city: { $regex: regexQuery } },
          { houseNumber: { $regex: regexQuery } },
        ],
      })
      .limit(limit)
      .exec();
  }
}
