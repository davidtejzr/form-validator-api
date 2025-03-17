import { debounceValidate, initWrapper } from './input-helpers.js';
import { validateEmail, validateEmailAdvanced } from './email-validator.js';
import {
  validateCompanyDic,
  validateCompanyIco,
  validateCompanyName,
} from './company-validator.js';

document.addEventListener('DOMContentLoaded', function () {
  /* Email validator */
  const emailInput = document.querySelector('input[data-email-validator]');
  initWrapper(emailInput);
  emailInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateEmail(e.target)),
  );

  /* Advanced email validator */
  const emailInput2 = document.querySelector(
    'input[data-email-validator-advanced]',
  );
  initWrapper(emailInput2);
  emailInput2.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateEmailAdvanced(e.target)),
  );

  /* Company validator */
  const companyNameInput = document.querySelector(
    'input[data-company-validator-name]',
  );
  initWrapper(companyNameInput);
  companyNameInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateCompanyName(e.target)),
  );

  const companyIcoInput = document.querySelector(
    'input[data-company-validator-ico]',
  );
  initWrapper(companyIcoInput);
  companyIcoInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateCompanyIco(e.target)),
  );

  const companyVatInput = document.querySelector(
    'input[data-company-validator-vat]',
  );
  initWrapper(companyVatInput);
  companyVatInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateCompanyDic(e.target)),
  );

  /* Address validator */
  const addressStreetInput = document.querySelector(
    'input[data-address-validator-street]',
  );
  initWrapper(addressStreetInput);
  const addressCityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  initWrapper(addressCityInput);
  const addressZipInput = document.querySelector(
    'input[data-address-validator-zip]',
  );
  initWrapper(addressZipInput, false);
});
