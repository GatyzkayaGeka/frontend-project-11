const createModal = (state, elements) => {
  const { postsModal } = state.modal;
  // Получаем первый идентификатор поста из коллекции
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
