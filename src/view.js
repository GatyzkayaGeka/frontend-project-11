import onChange from 'on-change';

const deletionInformation  = (elements, value) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
};

const formUrl = (elements, value, i18nInstance) => {
const { feedback: isFeedback } = elements;
  switch (value) {
    case 'valid':
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      deletionInformation(elements);
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      isFeedback.textContent = i18nInstance.t('errors.invalidUrl');
      break;
    case 'success':
      deletionInformation(elements);
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t('okRss');;
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, state, i18nInstance) => (path, value) => {
    formUrl(elements, value, i18nInstance);
  };

export default render;