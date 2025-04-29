import { Test, TestingModule } from '@nestjs/testing';
import { EmailFilterService } from './email-filter.service';
import { ConfigService } from '@nestjs/config';

describe('EmailFilterService', () => {
  let service: EmailFilterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailFilterService, ConfigService],
    }).compile();

    service = module.get<EmailFilterService>(EmailFilterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true for disposable domain', () => {
    const disposableDomain = 'mailinator.com';
    expect(service.isDisposableDomain(disposableDomain)).toBe(true);
  });

  it('should return false for non-disposable domain', () => {
    const disposableDomain = 'google.com';
    expect(service.isDisposableDomain(disposableDomain)).toBe(false);
  });
});
