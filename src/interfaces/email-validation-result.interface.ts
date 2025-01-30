export interface EmailValidationResultInterface {
  cachedResult: boolean | null;
  invalidFormat: boolean | null;
  noMxRecords: boolean | null;
  blacklistedDomain: boolean | 'failed' | null;
  disposableAddress: boolean | null;
  deliverableAddress: boolean | 'undeclared' | null;
}
