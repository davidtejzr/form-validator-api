import { debounceValidate, initWrapper } from './input-helpers.js';
import { validateEmail } from './email-validator.js';
import {
  resolveCompanyNameAutocomplete,
  validateCompanyDic,
  validateCompanyIco,
} from './company-validator.js';
import {
  resolveAddressCityAutocomplete,
  resolveAddressStreetHouseNumberAutocomplete,
  resolveAddressZipAutocomplete,
} from './address-validator.js';

/* DEMO feature - Advanced email validator (comment to disable) */
/* START OF DEMO FEATURE */
import {
  resetPartialResults,
  validateEmailAdvanced,
} from './demo_email-advanced-validator.js';
const emailInputDemo = document.querySelector(
  'input[data-email-validator-advanced]',
);
initWrapper(emailInputDemo);
emailInputDemo.addEventListener('input', (e) => {
  resetPartialResults();
  debounceValidate(e.target, () => validateEmailAdvanced(e.target));
});
/* END OF DEMO FEATURE */

document.addEventListener('DOMContentLoaded', function () {
  /* Email validator */
  const emailInput = document.querySelector('input[data-email-validator]');
  initWrapper(emailInput);
  emailInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateEmail(e.target)),
  );

  /* Company validator */
  const companyNameInput = document.querySelector(
    'input[data-company-validator-name]',
  );
  initWrapper(companyNameInput);
  companyNameInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => resolveCompanyNameAutocomplete(e.target)),
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
  addressStreetInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () =>
      resolveAddressStreetHouseNumberAutocomplete(e.target),
    ),
  );

  const addressCityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  initWrapper(addressCityInput);
  addressCityInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => resolveAddressCityAutocomplete(e.target)),
  );

  const addressZipInput = document.querySelector(
    'input[data-address-validator-zip]',
  );
  initWrapper(addressZipInput, false);
  addressZipInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => resolveAddressZipAutocomplete(e.target)),
  );
});
