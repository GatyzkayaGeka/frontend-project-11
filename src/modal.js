const createModal = (state, elements) => {
  console.log('state:', state); // Отладочный вывод для проверки состояния state
  console.log('elements:', elements); // Отладочный вывод для проверки объекта elements
  const { postsModal } = state.modal;
  const currentPostIds = Array.from(postsModal);

  if (currentPostIds.length > 0) {
    const currentPosts = state.posts.filter((post) => currentPostIds.includes(post.id));
    const latestPost = currentPosts[currentPosts.length - 1];

    elements.titleModal.textContent = latestPost.title;
    elements.bodyModal.textContent = latestPost.description;
    elements.buttonModal.setAttribute('href', latestPost.link);
  } else {
    elements.titleModal.textContent = '';
    elements.bodyModal.textContent = '';
    elements.buttonModal.removeAttribute('href');
  }
};

export default createModal;
