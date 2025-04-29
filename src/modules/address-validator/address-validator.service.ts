import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from '../../schemas/address.schema';
import { PartialAddressSearchDto } from './dtos/partial-address-search-dto';
import { AddressResponseDto } from './dtos/address-response-dto';
import { AddressCityResponseDto } from './dtos/address-city-response-dto';
import * as process from 'node:process';

@Injectable()
export class AddressValidatorService {
  constructor(
    @InjectModel(Address.name) private readonly addressModel: Model<Address>,
  ) {}

  async isValidPartialAddress(
    pas: PartialAddressSearchDto,
  ): Promise<AddressResponseDto> {
    if (!pas.streetHouseNumber && (!pas.street || !pas.houseNumber)) {
      throw new BadRequestException(
        'Street and house number are required! Separately or together.',
      );
    }

    const param = pas.streetHouseNumber
      ? {
          streetHouseNumber: {
            $regex: new RegExp(`^${pas.streetHouseNumber}`, 'i'),
          },
        }
      : {
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
        };

    const result = await this.addressModel.find(param).exec();

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

  async prefixStreetHouseNumberSearch(
    streetHouseNumber: string,
    limit = 5,
  ): Promise<AddressCityResponseDto[]> {
    const result = await this.addressModel
      .find({
        streetHouseNumber: {
          $gte: streetHouseNumber,
          $lt: streetHouseNumber + '\uffff',
        },
        country: process.env.DATA_LOCALE || 'CZ',
      })
      .collation({ locale: 'cs', strength: 1 })
      .sort({ firma: 1 })
      .limit(limit)
      .exec();

    return result.map((address) => ({
      street: address.street,
      houseNumber: address.houseNumber,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    }));
  }

  async luceneStreetHouseNumberSearch(
    streetHouseNumber: string,
    limit = 5,
  ): Promise<AddressCityResponseDto[]> {
    return this.addressModel.aggregate([
      {
        $search: {
          index: 'default',
          compound: {
            should: [
              {
                autocomplete: {
                  query: streetHouseNumber,
                  path: 'streetHouseNumber',
                },
              },
              {
                text: {
                  query: streetHouseNumber,
                  path: 'streetHouseNumber',
                },
              },
            ],
            minimumShouldMatch: 1,
          },
        },
      },
      { $match: { country: process.env.DATA_LOCALE || 'CZ' } },
      { $limit: limit },
      {
        $project: {
          street: 1,
          houseNumber: 1,
          city: 1,
          postalCode: 1,
          country: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ]);
  }

  async citySearch(
    query: string,
    limit = 5,
  ): Promise<AddressCityResponseDto[]> {
    const result = await this.addressModel
      .find({
        city: { $gte: query, $lt: query + '\uffff' },
        country: process.env.DATA_LOCALE || 'CZ',
      })
      .collation({ locale: 'cs', strength: 1 })
      .sort({ city: 1, postalCode: 1, country: 1 })
      .exec();

    const distinctResult = await this.addressModel
      .aggregate([
        { $match: { _id: { $in: result.map((address) => address._id) } } },
        {
          $group: {
            _id: { postalCode: '$postalCode' },
            city: { $first: '$city' },
            postalCode: { $first: '$postalCode' },
            country: { $first: '$country' },
          },
        },
        { $sort: { city: 1, postalCode: 1, country: 1 } },
        { $limit: limit },
        { $project: { _id: 0, city: 1, postalCode: 1, country: 1 } },
      ])
      .exec();

    return distinctResult.map((address) => ({
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
    }));
  }

  async postalCodeSearch(
    query: string,
    limit = 5,
  ): Promise<AddressCityResponseDto[]> {
    const result = await this.addressModel
      .aggregate([
        {
          $match: {
            postalCode: { $gte: query, $lt: query + '\uffff' },
            country: process.env.DATA_LOCALE || 'CZ',
          },
        },
        {
          $group: {
            _id: { city: '$city' },
            postalCode: { $first: '$postalCode' },
            city: { $first: '$city' },
            country: { $first: '$country' },
          },
        },
        { $sort: { postalCode: 1, city: 1, country: 1 } },
        { $limit: limit },
        { $project: { _id: 0, postalCode: 1, city: 1, country: 1 } },
      ])
      .exec();

    return result.map((address) => ({
      postalCode: address.postalCode,
      city: address.city,
      country: address.country,
    }));
  }
}
