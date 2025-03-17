import {
  showResultBadge,
  showMessage,
  showAutocomplete,
  showLoader,
  hideLoader,
  debounceValidate,
} from './input-helpers.js';
import { apiUrl } from './config.js';

function validateEmail(input, autocompleteEnabled = true) {
  const email = input.value;
  showLoader(input);

  if (autocompleteEnabled && email.split('@').length === 2) {
    resolveEmailAutocomplete(input);
  }

  fetch(`${apiUrl}/email-validator/validate-recommended`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
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
            showMessage(input, data.statusMessage, 'error');
            break;
          case 'YELLOW':
            input.classList.add('validator_warning');
            showResultBadge(input, 'warning');
            showMessage(input, data.statusMessage, 'yellow');
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

function validateEmailAdvanced(input, autocompleteEnabled = true) {
  const email = input.value;
  showLoader(input);

  if (autocompleteEnabled && email.split('@').length === 2) {
    resolveEmailAutocomplete(input, true);
  }

  fetch(`${apiUrl}/email-validator/validate-advanced`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ email }),
  }).then((result) => {
    hideLoader(input);
    if (result.status === 200) {
      result.json().then((data) => {
        showPartialResults(input, data.partialResults);
        switch (data.level) {
          case 'RED':
            input.classList.add('validator_error');
            showResultBadge(input, 'error');
            break;
          case 'YELLOW':
            input.classList.add('validator_warning');
            showResultBadge(input, 'warning');
            if (document.getElementById(input.id + '_autocomplete')) {
              const autocompleteInstance = document.getElementById(
                input.id + '_autocomplete',
              );
              autocompleteInstance.remove();
            }
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

function resolveEmailAutocomplete(input, advanced = false) {
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
              if (advanced) {
                debounceValidate(input, () =>
                  validateEmailAdvanced(input, false),
                );
              } else {
                debounceValidate(input, () => validateEmail(input, false));
              }
            });
          }
        }
      });
    }
  });
}

function showPartialResults(input, partialResults) {
  const wrapper = document.getElementById('email-advanced-result-wrapper');

  parsePartialResult(
    wrapper.querySelector('#email-advanced-result-has-valid-format'),
    'invalidFormat',
    partialResults['invalidFormat'],
  );

  parsePartialResult(
    wrapper.querySelector('#email-advanced-result-has-mx-records'),
    'noMxRecords',
    partialResults['noMxRecords'],
  );

  parsePartialResult(
    wrapper.querySelector('#email-advanced-result-is-disposable'),
    'disposableAddress',
    partialResults['disposableAddress'],
  );

  parsePartialResult(
    wrapper.querySelector('#email-advanced-result-is-on-blacklist'),
    'blacklistedDomain',
    partialResults['blacklistedDomain'],
  );

  parsePartialResult(
    wrapper.querySelector('#email-advanced-result-is-deliverable'),
    'undeliverableAddress',
    partialResults['undeliverableAddress'],
  );
}

const PartialResultMessages = {
  invalidFormat: {
    true: 'Email není v platném formátu!',
    false: 'Email je v platném formátu',
  },
  noMxRecords: {
    true: 'Doména není schopna přijímat emaily!',
    false: 'Doména je schopna přijímat emaily',
  },
  disposableAddress: {
    true: 'Jedná se o jednorázovou adresu!',
    false: 'Nejedná se o jednorázovou adresu',
  },
  blacklistedDomain: {
    true: 'Doména je na blacklistu!',
    false: 'Doména není na blacklistu',
  },
  undeliverableAddress: {
    true: 'Emailová schránka není doručitelná!',
    false: 'Emailová schránka je doručitelná',
    undeclared: 'Nelze ověřit doručitelnost této emailové schránky',
  },
};

function parsePartialResult(element, key, value) {
  const img = element.querySelector('img');
  const text = element.querySelector('span');
  switch (value) {
    case true:
      img.src = 'public/img/cross.svg';
      text.style.fontWeight = 'bold';
      text.style.color = '#E50046';
      text.innerText = PartialResultMessages[key][true];
      break;
    case false:
      img.src = 'public/img/success.svg';
      text.style.fontWeight = 'bolder';
      text.style.color = '#89AC46';
      text.innerText = PartialResultMessages[key][false];
      break;
    case 'undeclared':
      img.src = 'public/img/warning.svg';
      text.style.fontWeight = 'bold';
      text.style.color = '#FFB433';
      text.innerText = PartialResultMessages[key]['undeclared'];
      break;
    default:
      img.src = 'public/img/pending.svg';
      text.style.fontWeight = 'normal';
      text.style.color = '#858585';
      text.innerText = PartialResultMessages[key][false];
      break;
  }
}

export { validateEmail, validateEmailAdvanced, showPartialResults };
