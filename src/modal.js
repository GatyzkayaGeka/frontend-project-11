const createModal = (state, elements, postId) => {
  const latestPost = state.posts.find((post) => post.id === postId);
  elements.titleModal.textContent = latestPost.title;
  elements.bodyModal.textContent = latestPost.description;
  elements.buttonModal.setAttribute('href', latestPost.link);
};

export default createModal;
