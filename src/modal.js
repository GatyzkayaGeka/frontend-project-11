const modalCreat = (state, elements) => {
  console.log('state:', state); // Отладочный вывод для проверки состояния state
  console.log('elements:', elements); // Отладочный вывод для проверки объекта elements
  const { postsModal } = state.modal;
  const currentPost = state.posts.find((post) => post.id === postsModal);

  if (currentPost) {
    elements.titleModal.textContent = currentPost.title;
    elements.bodyModal.textContent = currentPost.description;
    elements.buttonModal.setAttribute('href', currentPost.link);
  } else {
    elements.titleModal.textContent = '';
    elements.bodyModal.textContent = '';
    elements.buttonModal.removeAttribute('href');
  }
};

export default modalCreat;
