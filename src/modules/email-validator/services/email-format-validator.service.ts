import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailFormatValidatorService {
  rfc5322Regex =
    /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})(@)((?:[A-Za-z0-9.\-])*(?:[A-Za-z0-9])\.(?:[A-Za-z0-9]){2,})$/;

  emailRegexWithoutDomain =
    /^((?:[A-Za-z0-9!#$%&'*+\-\/=?^_`{|}~]|(?<=^|\.)"|"(?=$|\.|@)|(?<=".*)[ .](?=.*")|(?<!\.)\.){1,64})@([A-Za-z0-9][A-Za-z0-9.\-]*)$/;

  acceptRfc5322Standard(email: string): boolean {
    return this.rfc5322Regex.test(email);
  }

  isValidEmailWithoutDomain(email: string): boolean {
    return this.emailRegexWithoutDomain.test(email);
  }
}
