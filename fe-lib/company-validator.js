import {
  debounceValidate,
  hideLoader,
  showAutocomplete,
  showLoader,
  showResultBadge,
} from './input-helpers.js';
import { apiUrl } from './config.js';

function validateCompanyIco(input, autocompleteEnabled = true) {
  const ico = input.value;
  showLoader(input);

  if (autocompleteEnabled) {
    resolveIcoAutocomplete(input);
  }

  fetch(`${apiUrl}/company-validator/ico/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ ico }),
  }).then((result) => {
    hideLoader(input);
    if (result.status === 200) {
      result.json().then((data) => {
        console.log(data);
        if (data.isValid) {
          setCompanyData(data);
        } else {
          input.classList.add('validator_error');
          showResultBadge(input, 'error');
        }
      });
    }
  });
}

function validateCompanyDic(input, autocompleteEnabled = true) {
  const dic = input.value;
  showLoader(input);

  if (autocompleteEnabled) {
    resolveDicAutocomplete(input);
  }

  fetch(`${apiUrl}/company-validator/dic/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ dic }),
  }).then((result) => {
    hideLoader(input);
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.isValid) {
          setCompanyData(data);
        } else {
          input.classList.add('validator_error');
          showResultBadge(input, 'error');
        }
      });
    }
  });
}

function resolveIcoAutocomplete(input) {
  const id = input.id + '_autocomplete';

  if (document.getElementById(id)) {
    const autocompleteInstance = document.getElementById(id);
    autocompleteInstance.remove();
  }

  const params = new URLSearchParams();
  params.append('ico', input.value);
  fetch(`${apiUrl}/company-validator/ico/autocomplete?${params}`, {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.length > 0) {
          let autocompleteWrapper = showAutocomplete(input, id);
          for (const value in data) {
            const listItem = document.createElement('li');
            listItem.className = 'validator_autocomplete-li';
            listItem.innerText = data[value]['ico'];
            autocompleteWrapper.childNodes[0].appendChild(listItem);
            listItem.addEventListener('click', () => {
              input.value = data[value]['ico'];
              autocompleteWrapper.remove();
              debounceValidate(input, () => validateCompanyIco(input, false));
            });
          }
        }
      });
    }
  });
}

function resolveDicAutocomplete(input) {
  const id = input.id + '_autocomplete';

  if (document.getElementById(id)) {
    const autocompleteInstance = document.getElementById(id);
    autocompleteInstance.remove();
  }

  const params = new URLSearchParams();
  params.append('dic', input.value);
  fetch(`${apiUrl}/company-validator/dic/autocomplete?${params}`, {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.length > 0) {
          let autocompleteWrapper = showAutocomplete(input, id);
          for (const value in data) {
            const listItem = document.createElement('li');
            listItem.className = 'validator_autocomplete-li';
            listItem.innerText = data[value]['dic'];
            autocompleteWrapper.childNodes[0].appendChild(listItem);
            listItem.addEventListener('click', () => {
              input.value = data[value]['dic'];
              autocompleteWrapper.remove();
              debounceValidate(input, () => validateCompanyDic(input, false));
            });
          }
        }
      });
    }
  });
}

function setCompanyData(data) {
  const companyNameInput = document.querySelector(
    'input[data-company-validator-name]',
  );
  companyNameInput.classList.add('validator_success');
  showResultBadge(companyNameInput, 'success');
  companyNameInput.value = data.companyName;

  const icoInput = document.querySelector('input[data-company-validator-ico]');
  icoInput.classList.add('validator_success');
  showResultBadge(icoInput, 'success');
  icoInput.value = data.ico;

  const vatInput = document.querySelector('input[data-company-validator-vat]');
  vatInput.classList.add('validator_success');
  showResultBadge(vatInput, 'success');
  vatInput.value = data.dic;
}

export { validateCompanyIco, validateCompanyDic };
