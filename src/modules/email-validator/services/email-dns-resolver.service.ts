import { Injectable } from '@nestjs/common';
import { promises as dns } from 'dns';

@Injectable()
export class EmailDnsResolverService {
  async getHighestPriorityMxRecord(domain: string): Promise<boolean | string> {
    try {
      const mxRecords = await dns.resolveMx(domain);

      if (!mxRecords || mxRecords.length === 0) {
        return false;
      }
      if (!mxRecords.some((mxRecord) => mxRecord.exchange.trim() !== '')) {
        return false;
      }

      const sortedMxRecords = mxRecords.sort((a, b) => b.priority - a.priority);
      console.log('mxRecords:', sortedMxRecords);
      return sortedMxRecords[0].exchange;
    } catch (err) {
      console.error('Error resolving MX records:', err);
      return false;
    }
  }
}
