import onChange from 'on-change';
import { createFeeds, createPost } from './creat.js';

const deletionInformation  = (elements) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
};

const formUrl = (elements, value, i18nInstance, state) => {
const { feedback: isFeedback } = elements;
deletionInformation(elements);
  switch (value) {
    case 'invalid':
      //deletionInformation(elements);
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success'); // если не будет работать и это тоже поправить
      elements.feedback.classList.add('text-danger');
      isFeedback.textContent = i18nInstance.t(`errors.${[state.form.error]}`);
      elements.form.reset();
      elements.input.focus();
      break;
    case 'success':
      //deletionInformation(elements);
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t('status.okRss');
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, state, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form.state':
      formUrl(elements, value, i18nInstance, state);
      break;
    case 'feeds':
      createFeeds(value, elements, i18nInstance);
      break;
    case 'posts':
      createPost(state, value, elements, i18nInstance);
      break;
    default:
      break;
  }
};
    
export default render;
