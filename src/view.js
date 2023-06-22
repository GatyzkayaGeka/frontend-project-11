import onChange from 'on-change';

const deletionInformation  = (elements, value) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
};

const formUrl = (elements, value) => {

  switch (value) {
    case 'valid':
      input.classList.remove('is-invalid');
      break;
    case 'invalid':
      deletionInformation(elements);
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = state.error;
      break;
    case 'success':
      deletionInformation(elements);
      elements.feedback.classList.add('text-success');
      elements.feedback.textContent = 'RSS успешно загружен';
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, state) => (path, value) => {
    formUrl(elements, value);
  };


export default render;