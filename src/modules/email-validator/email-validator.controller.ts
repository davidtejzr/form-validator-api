import { Body, Controller, Post } from '@nestjs/common';
import { EmailValidatorService } from './email-validator.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('email-validator')
export class EmailValidatorController {
  constructor(private readonly emailValidatorService: EmailValidatorService) {}

  @Post('validate')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { email: { type: 'string', default: 'test@gmail.com' } },
    },
  })
  async validateEmail(@Body('email') email: string) {
    return this.emailValidatorService.validateEmail(email);
  }
}
