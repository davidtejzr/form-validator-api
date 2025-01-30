import { Test, TestingModule } from '@nestjs/testing';
import { EmailFormatValidatorService } from './email-format-validator.service';

describe('EmailFormatValidatorService', () => {
  let service: EmailFormatValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailFormatValidatorService],
    }).compile();

    service = module.get<EmailFormatValidatorService>(
      EmailFormatValidatorService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true for valid email', () => {
    const validEmail = 'test@example.com';
    expect(service.acceptRfc5322Standard(validEmail)).toBe(true);
  });

  it('should return true for valid email with subdomain', () => {
    const validEmail = 'test@subdomain.domain.com';
    expect(service.acceptRfc5322Standard(validEmail)).toBe(true);
  });

  it('should return false for invalid local-part length', () => {
    const localPart = 'a'.repeat(65);
    const domain = 'example.com';
    const invalidEmail = `${localPart}@${domain}`;
    expect(service.acceptRfc5322Standard(invalidEmail)).toBe(false);
  });

  it('should return false for invalid email', () => {
    const invalidEmail = 'invalid-email';
    expect(service.acceptRfc5322Standard(invalidEmail)).toBe(false);
  });

  it('should return false for invalid email with empty domain', () => {
    const invalidEmail = 'invalid-email@';
    expect(service.acceptRfc5322Standard(invalidEmail)).toBe(false);
  });

  it('should return false for email with invalid domain', () => {
    const invalidEmail = 'test@invalid-domain';
    expect(service.acceptRfc5322Standard(invalidEmail)).toBe(false);
  });

  it('should return false for email with empty TLD', () => {
    const invalidEmail = 'test@invalid-domain.';
    expect(service.acceptRfc5322Standard(invalidEmail)).toBe(false);
  });

  it('should return false for email with invalid TLD', () => {
    const invalidEmail = 'test@invalid-domain.a';
    expect(service.acceptRfc5322Standard(invalidEmail)).toBe(false);
  });
});
