const createModal = (state, elements) => {
  console.log('state:', state); // Отладочный вывод для проверки состояния state
  console.log('elements:', elements); // Отладочный вывод для проверки объекта elements
  const { postsModal } = state.modal;
  // Получаем первый идентификатор поста из коллекции
  const currentPostId = postsModal;

  if (currentPostId) {
    const currentPosts = state.posts.find((post) => post.id === currentPostId);

    elements.titleModal.textContent = currentPosts.title;
    elements.bodyModal.textContent = currentPosts.description;
    elements.buttonModal.setAttribute('href', currentPosts.link);
  } else {
    elements.titleModal.textContent = '';
    elements.bodyModal.textContent = '';
    elements.buttonModal.removeAttribute('href');
  }
};

export default createModal;
