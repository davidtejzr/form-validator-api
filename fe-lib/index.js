import { debounceValidate, initWrapper } from './input-helpers.js';
import { validateEmail, validateEmailAdvanced } from './email-validator.js';

document.addEventListener('DOMContentLoaded', function () {
  /* Email validator */
  const emailInput = document.querySelector('input[data-email-validator]');
  initWrapper(emailInput);
  emailInput.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateEmail(e.target)),
  );
  emailInput.addEventListener('change', (e) =>
    debounceValidate(e.target, () => validateEmail(e.target, false)),
  );

  /* Advanced email validator */
  const emailInput2 = document.querySelector(
    'input[data-email-validator-advanced]',
  );
  initWrapper(emailInput2);
  emailInput2.addEventListener('input', (e) =>
    debounceValidate(e.target, () => validateEmailAdvanced(e.target)),
  );
  emailInput2.addEventListener('change', (e) =>
    debounceValidate(e.target, () => validateEmailAdvanced(e.target, false)),
  );
});
