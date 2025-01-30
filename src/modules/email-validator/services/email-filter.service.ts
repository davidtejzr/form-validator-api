import { Injectable } from '@nestjs/common';
import { isDisposableEmailDomain } from 'disposable-email-domains-js';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailFilterService {
  constructor(private configService: ConfigService) {}

  isDisposableDomain(domain: string): boolean {
    return isDisposableEmailDomain(domain);
  }

  async isDomainOnBlacklist(domain: string): Promise<boolean | 'failed'> {
    try {
      const response = await axios.get(
        `https://api.mxtoolbox.com/api/v1/Lookup/Blacklist/?argument=${domain}`,
        {
          headers: {
            Authorization: this.configService.get<string>('mxtoolboxApiKey'),
          },
        },
      );
      return !!(
        response.data?.Failed &&
        Array.isArray(response.data.Failed) &&
        response.data.Failed.length > 0
      );
    } catch (error) {
      console.error('Error fetching data from MxToolbox:', error);
      return 'failed';
    }
  }
}
