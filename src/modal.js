const modalCreat = (state, elements) => {
const { postsModal } = state.modal;  
  const currentPost = state.posts.find((post) => post.id === postsModal);

  if (currentPost) {
  elements.titleModal.textContent = currentPost.title;
  elements.bodyModal.textContent = currentPost.description;
  elements.buttonModal.setAttribute('href', currentPost.link);

  }
};

export default modalCreat;
