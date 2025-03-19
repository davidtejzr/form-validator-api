import {
  showResultBadge,
  showMessage,
  showAutocomplete,
  showLoader,
  hideLoader,
  debounceValidate,
} from './input-helpers.js';
import { apiUrl, language } from './config.js';

function validateEmail(input, autocompleteEnabled = true) {
  const email = input.value;
  showLoader(input);

  if (autocompleteEnabled && email.split('@').length === 2) {
    resolveEmailAutocomplete(input, () =>
      debounceValidate(input, () => validateEmail(input, false)),
    );
  }

  fetch(`${apiUrl}/email-validator/validate-recommended`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept-Language': language,
    },
    body: new URLSearchParams({ email }),
  }).then((result) => {
    hideLoader(input);
    if (result.status === 200) {
      result.json().then((data) => {
        switch (data.level) {
          case 'RED':
            input.classList.add('validator_error');
            showResultBadge(input, 'error');
            showMessage(input, data.friendlyMessage, 'error');
            break;
          case 'YELLOW':
            input.classList.add('validator_warning');
            showResultBadge(input, 'warning');
            showMessage(input, data.friendlyMessage, 'yellow');
            break;
          case 'GREEN':
            input.classList.add('validator_success');
            showResultBadge(input, 'success');
            if (document.getElementById(input.id + '_autocomplete')) {
              const autocompleteInstance = document.getElementById(
                input.id + '_autocomplete',
              );
              autocompleteInstance.remove();
            }
            break;
        }
      });
    }
  });
}

function resolveEmailAutocomplete(input, validateFn) {
  const id = input.id + '_autocomplete';
  const emailUsername = input.value.split('@')[0];
  const domain = input.value.split('@')[1];

  if (document.getElementById(id)) {
    const autocompleteInstance = document.getElementById(id);
    autocompleteInstance.remove();
  }

  const params = new URLSearchParams();
  params.append('email', input.value);
  fetch(`${apiUrl}/email-validator/autocomplete?${params}`, {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.length > 0) {
          if (data.length === 1 && data[0] === domain) {
            return;
          }
          let autocompleteWrapper = showAutocomplete(input, id);
          for (const value in data) {
            const listItem = document.createElement('li');
            listItem.className = 'validator_autocomplete-li';
            listItem.innerText = data[value];
            autocompleteWrapper.childNodes[0].appendChild(listItem);
            listItem.addEventListener('click', () => {
              input.value = `${emailUsername}@${data[value]}`;
              autocompleteWrapper.remove();
              validateFn();
            });
          }
        }
      });
    }
  });
}

export { validateEmail, resolveEmailAutocomplete };
