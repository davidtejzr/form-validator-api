const debounceTimers = new Map();

function initWrapper(element) {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  element.parentNode.appendChild(wrapper);
  wrapper.appendChild(element);

  const messageWrapper = document.createElement('span');
  messageWrapper.className = 'validator_message';
  wrapper.appendChild(messageWrapper);
}

function debounceValidate(input, next) {
  resetValidation(input);
  if (input.value === '') {
    return;
  }

  if (debounceTimers.has(input.id)) {
    clearTimeout(debounceTimers.get(input.id));
  }

  const timer = setTimeout(next, 500);
  debounceTimers.set(input.id, timer);
}

function resetValidation(input) {
  input.classList.remove('validator_error');
  input.classList.remove('validator_warning');
  input.classList.remove('validator_success');
  const wrapper = input.parentNode;
  const imgElements = wrapper.querySelectorAll('.validator_input-adornment');
  imgElements.forEach((img) => img.remove());
  wrapper.querySelector('.validator_message').innerText = '';
}

function showLoader(input) {
  const loader = document.createElement('img');
  loader.src = 'public/img/loading.gif';
  loader.className = 'validator_input-loader';
  const wrapper = input.parentNode;
  wrapper.appendChild(loader);
}

function hideLoader(input) {
  const wrapper = input.parentNode;
  const loader = wrapper.querySelector('.validator_input-loader');

  if (loader) {
    loader.remove();
  }
}

function showResultBadge(input, type) {
  const wrapper = input.parentNode;
  const badge = document.createElement('img');
  badge.src = `public/img/${type}.svg`;
  badge.className = 'validator_input-adornment';
  wrapper.appendChild(badge);
}

function showMessage(input, message, type) {
  const wrapper = input.parentNode;
  const messageWrapper = wrapper.querySelector('.validator_message');
  messageWrapper.innerText = message;
  if (type === 'error') {
    messageWrapper.style.color = '#E50046';
  } else {
    messageWrapper.style.color = '#FFB433';
  }
}

function showAutocomplete(input, id) {
  const wrapper = input.parentNode;
  const autocompleteWrapper = document.createElement('div');
  autocompleteWrapper.id = id;
  autocompleteWrapper.className = 'validator_autocomplete-wrapper';
  const autocompleteList = document.createElement('ul');
  autocompleteList.className = 'validator_autocomplete-ul';
  autocompleteWrapper.appendChild(autocompleteList);
  wrapper.appendChild(autocompleteWrapper);

  return autocompleteWrapper;
}

export {
  initWrapper,
  debounceValidate,
  resetValidation,
  showLoader,
  hideLoader,
  showResultBadge,
  showMessage,
  showAutocomplete,
};
