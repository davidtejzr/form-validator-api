import {
  debounceValidate,
  hideLoader,
  showAutocomplete,
  showLoader,
  showResultBadge,
} from './input-helpers.js';
import { apiUrl } from './config.js';

function validateAddress() {
  const streetHouseNumber = document.querySelector(
    'input[data-address-validator-street]',
  );
  const city = document.querySelector('input[data-address-validator-city]');
  const zip = document.querySelector('input[data-address-validator-zip]');

  if (!streetHouseNumber.value || !city.value || !zip.value) {
    return;
  }
  showAddressLoader();

  fetch(`${apiUrl}/address-validator/partial/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      streetHouseNumber: streetHouseNumber.value,
      city: city.value,
      postalCode: zip.value,
    }),
  }).then((result) => {
    hideAddressLoader();
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.isValid) {
          setAddressData(data);
        } else {
          setAddressFieldsInvalid();
        }
      });
    }
  });
}

function resolveAddressStreetHouseNumberAutocomplete(input) {
  const id = input.id + '_autocomplete';

  if (document.getElementById(id)) {
    const autocompleteInstance = document.getElementById(id);
    autocompleteInstance.remove();
  }

  const params = new URLSearchParams();
  params.append('streetHouseNumber', input.value);
  params.append('useLucene', 'true');
  fetch(`${apiUrl}/address-validator/partial/street-autocomplete?${params}`, {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.length > 0) {
          const streetHouseNumber = `${data[0]['street']} ${data[0]['houseNumber']}`;
          if (data.length === 1 && streetHouseNumber === input.value) {
            return;
          }
          let autocompleteWrapper = showAutocomplete(input, id);
          for (const value in data) {
            const currentStreetHouseNumber = `${data[value]['street']} ${data[value]['houseNumber']}`;
            const listItem = document.createElement('li');
            listItem.className = 'validator_autocomplete-li';
            listItem.innerText = currentStreetHouseNumber;
            autocompleteWrapper.childNodes[0].appendChild(listItem);
            listItem.addEventListener('click', () => {
              input.value = currentStreetHouseNumber;

              const cityInput = document.querySelector(
                'input[data-address-validator-city  ]',
              );
              cityInput.value = data[value]['city'];

              const zipInput = document.querySelector(
                'input[data-address-validator-zip]',
              );
              zipInput.value = data[value]['postalCode'];

              autocompleteWrapper.remove();
              setAddressData(data[value]);
            });
          }
        }
      });
    }
  });
}

function resolveAddressCityAutocomplete(input) {
  const id = input.id + '_autocomplete';

  if (document.getElementById(id)) {
    const autocompleteInstance = document.getElementById(id);
    autocompleteInstance.remove();
  }

  const params = new URLSearchParams();
  params.append('city', input.value);
  fetch(`${apiUrl}/address-validator/partial/city-autocomplete?${params}`, {
    method: 'GET',
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.length > 0) {
          if (data.length === 1 && data[0]['city'] === input.value) {
            return;
          }
          let autocompleteWrapper = showAutocomplete(input, id);
          for (const value in data) {
            const listItem = document.createElement('li');
            listItem.className = 'validator_autocomplete-li';
            listItem.innerText = data[value]['city'];
            autocompleteWrapper.childNodes[0].appendChild(listItem);
            listItem.addEventListener('click', () => {
              input.value = data[value]['city'];

              const zipInput = document.querySelector(
                'input[data-address-validator-zip]',
              );
              zipInput.value = data[value]['postalCode'];

              autocompleteWrapper.remove();
              debounceValidate(input, () => validateAddress());
            });
          }
        }
      });
    }
  });
}

function resolveAddressZipAutocomplete(input) {
  const id = input.id + '_autocomplete';

  if (document.getElementById(id)) {
    const autocompleteInstance = document.getElementById(id);
    autocompleteInstance.remove();
  }

  const params = new URLSearchParams();
  params.append('postalCode', input.value);
  fetch(
    `${apiUrl}/address-validator/partial/postalcode-autocomplete?${params}`,
    {
      method: 'GET',
    },
  ).then((result) => {
    if (result.status === 200) {
      result.json().then((data) => {
        if (data.length > 0) {
          if (data.length === 1 && data[0]['postalCode'] === input.value) {
            return;
          }
          let autocompleteWrapper = showAutocomplete(input, id);
          for (const value in data) {
            const listItem = document.createElement('li');
            listItem.className = 'validator_autocomplete-li';
            listItem.innerText = data[value]['postalCode'];
            autocompleteWrapper.childNodes[0].appendChild(listItem);
            listItem.addEventListener('click', () => {
              input.value = data[value]['postalCode'];

              const cityInput = document.querySelector(
                'input[data-address-validator-city  ]',
              );
              cityInput.value = data[value]['city'];

              autocompleteWrapper.remove();
              debounceValidate(input, () => validateAddress());
            });
          }
        }
      });
    }
  });
}

function setAddressData(data) {
  const streetAndHouseNumberInput = document.querySelector(
    'input[data-address-validator-street]',
  );
  streetAndHouseNumberInput.classList.add('validator_success');
  showResultBadge(streetAndHouseNumberInput, 'success');
  streetAndHouseNumberInput.value = `${data.street} ${data.houseNumber}`;

  const cityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  cityInput.classList.add('validator_success');
  showResultBadge(cityInput, 'success');
  cityInput.value = data.city;

  const zipInput = document.querySelector('input[data-address-validator-zip]');
  zipInput.classList.add('validator_success');
  showResultBadge(zipInput, 'success');
  zipInput.value = data.postalCode;
}

function setAddressFieldsInvalid() {
  const streetAndHouseNumberInput = document.querySelector(
    'input[data-address-validator-street]',
  );
  streetAndHouseNumberInput.classList.add('validator_error');
  showResultBadge(streetAndHouseNumberInput, 'error');

  const cityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  cityInput.classList.add('validator_error');
  showResultBadge(cityInput, 'error');

  const zipInput = document.querySelector('input[data-address-validator-zip]');
  zipInput.classList.add('validator_error');
  showResultBadge(zipInput, 'error');
}

function resetAddressValidation() {
  const streetAndHouseNumberInput = document.querySelector(
    'input[data-address-validator-street]',
  );
  streetAndHouseNumberInput.classList.remove('validator_error');
  streetAndHouseNumberInput.classList.remove('validator_success');
  showResultBadge(streetAndHouseNumberInput, 'success');

  const cityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  cityInput.classList.remove('validator_error');
  cityInput.classList.remove('validator_success');
  showResultBadge(cityInput, 'success');

  const zipInput = document.querySelector('input[data-address-validator-zip]');
  zipInput.classList.remove('validator_error');
  zipInput.classList.remove('validator_success');
  showResultBadge(zipInput, 'success');
}

function showAddressLoader() {
  resetAddressValidation();
  const streetAndHouseNumberInput = document.querySelector(
    'input[data-address-validator-street]',
  );
  showLoader(streetAndHouseNumberInput);

  const cityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  showLoader(cityInput);

  const zipInput = document.querySelector('input[data-address-validator-zip]');
  showLoader(zipInput);
}

function hideAddressLoader() {
  const streetAndHouseNumberInput = document.querySelector(
    'input[data-address-validator-street]',
  );
  hideLoader(streetAndHouseNumberInput);

  const cityInput = document.querySelector(
    'input[data-address-validator-city]',
  );
  hideLoader(cityInput);

  const zipInput = document.querySelector('input[data-address-validator-zip]');
  hideLoader(zipInput);
}

export {
  resolveAddressStreetHouseNumberAutocomplete,
  resolveAddressCityAutocomplete,
  resolveAddressZipAutocomplete,
};
