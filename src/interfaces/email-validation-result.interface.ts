export interface EmailValidationResultInterface {
  cachedResult: boolean | null;
  invalidFormat: boolean | null;
  noMxRecords: boolean | null;
  blacklistedDomain: boolean | 'failed' | null;
  disposableAddress: boolean | null;
  undeliverableAddress: boolean | 'undeclared' | null;
}
