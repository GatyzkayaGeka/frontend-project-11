import onChange from 'on-change';

const deletionInformation  = (elements) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
};

const formUrl = (elements, value, i18nInstance, state) => {
const { feedback: isFeedback } = elements;
  switch (value) {
    //case 'valid':
      //input.classList.remove('is-invalid');
      //break;
    case 'invalid':
      deletionInformation(elements);
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      isFeedback.textContent = i18nInstance.t('errors.invalidUrl');
      elements.form.reset();
      elements.input.focus();
      break;
    case 'success':
      deletionInformation(elements);
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t('state.${state.form.state}');
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