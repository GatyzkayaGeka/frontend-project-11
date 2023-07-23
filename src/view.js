import { createFeeds, createPost } from './create.js';
import modalCreat from './modal.js';

const deletionInformation = (elements) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
};

const formUrl = (elements, value, i18nInstance, state) => {
  const { feedback: isFeedback } = elements;
  const { state: step } = value;
  deletionInformation(elements);
  switch (step) {
    case 'success':
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t(`status.${step}`);
      elements.form.reset();
      elements.input.focus();
      elements.button.disabled = false;
      elements.input.disabled = false;
      break;
    case 'invalid':
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.add('text-danger');
      isFeedback.textContent = i18nInstance.t(`errors.${state.form.error}`);
      elements.form.reset();
      elements.input.focus();
      elements.button.disabled = false;
      elements.input.disabled = false;
      break;
    case 'sending':
      elements.button.disabled = true;
      elements.input.disabled = true;
      break;
    default:
      break;
  }
};

const readPost = (state) => {
  const { posts } = state;

  posts.forEach((post) => {
    const link = document.querySelector(`a[data-id="${post.id}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

const updatePostElement = (postId, visitedPosts) => {
  const postElement = document.querySelector(`a[data-id="${postId}"]`);

  if (postElement) {
    postElement.classList.remove('fw-bold');
    postElement.classList.remove('fw-normal');

    // Проверяем, является ли пост просмотренным
    if (visitedPosts.has(postId)) {
      postElement.classList.add('fw-normal');
    } else {
      postElement.classList.add('fw-bold');
    }
  }
};

const render = (elements, state, i18nInstance) => (path, value) => {
  switch (path) {
    case 'form':
      formUrl(elements, value, i18nInstance, state);
      break;
    case 'feeds':
      createFeeds(elements, state, i18nInstance);
      break;
    case 'posts':
      createPost(elements, state, i18nInstance);
      break;
    case 'modal.postsModal':
      modalCreat(state, elements);
      break;
    case 'modal.feedsModal':
      readPost(state);
      break;
    default:
      break;
  }
};

// export default render;
export { render, updatePostElement };
