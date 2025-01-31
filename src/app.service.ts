import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Form Validator API 1.0, please see documentation for more information';
  }
}
