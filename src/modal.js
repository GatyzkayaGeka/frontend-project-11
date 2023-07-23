const createModal = (state, elements) => {
  const { postsModal } = state.modal;
  // Получаем первый идентификатор поста из коллекции
  const currentPostId = postsModal;

  if (currentPostId !== null) { // Изменяем проверку на "!== null"
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
