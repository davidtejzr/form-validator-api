import { Injectable } from '@nestjs/common';
import { isDisposableEmailDomain } from 'disposable-email-domains-js';

@Injectable()
export class EmailFilterService {
  isDisposableDomain(domain: string): boolean {
    return isDisposableEmailDomain(domain);
  }
}
