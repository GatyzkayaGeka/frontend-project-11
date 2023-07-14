const modalCreat = (state, idPost, elements) => {
  const currentPost = state.posts.find((post) => post.id === idPost);
  
  elements.titleModal.textContent = currentPost.title;
  elements.bodyModal.textContent = currentPost.description;
  elements.buttonModal.setAttribute('href', currentPost.link);

  const link = document.querySelector(`a[data-id="${idPost}"]`);
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal', 'link-secondary');

};

export default modalCreat;
