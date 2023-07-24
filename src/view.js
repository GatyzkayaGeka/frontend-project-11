import { createFeeds, createPost } from './create.js';
import createModal from './modal.js';

const deletionInformation = (elements) => {
  const { button, input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
  button.disabled = false;
  input.disabled = false;
};

const handleProcessStates = (elements, value, i18nInstance, state) => {
  const { feedback: isFeedback } = elements;
  const { state: step } = value;
  deletionInformation(elements);
  switch (step) {
    case 'success':
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t(`status.${step}`);
      elements.form.reset();
      elements.input.focus();
      // elements.button.disabled = false;
      // elements.input.disabled = false;
      break;
    case 'invalid':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      isFeedback.textContent = i18nInstance.t(`errors.${state.form.error}`);
      elements.form.reset();
      elements.input.focus();
      // elements.button.disabled = false;
      // elements.input.disabled = false;
      break;
    case 'sending':
      elements.button.disabled = true;
      elements.input.disabled = true;
      break;
    default:
      break;
  }
};

const updatePostElement = (modalPostsModal) => {
  modalPostsModal.forEach((postId) => {
    const postElement = document.querySelector(`a[data-id="${postId}"]`);
    postElement.classList.remove('fw-bold');
    postElement.classList.remove('fw-normal', 'link-secondary');
  });
};

const render = (elements, state, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form':
      handleProcessStates(elements, value, i18nInstance, state);
      break;
    case 'feeds':
      createFeeds(elements, state, i18nInstance);
      break;
    case 'posts':
      createPost(elements, state, i18nInstance);
      break;
    case 'modal.feedsModal':
      updatePostElement(value);
      break;
    case 'modal.postsModal':
      createModal(state, elements, value);
      break;
    default:
      break;
  }
};

export default render;
// export { render, updatePostElement };
