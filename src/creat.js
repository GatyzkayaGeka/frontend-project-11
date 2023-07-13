import onChange from 'on-change';
const createPost = (elements, state, i18nInstance) => {

    const divPost = document.createElement('div');
    divPost.classList.add('card', 'border-0');
  
    const divPostCap = document.createElement('div');
    divPostCap.classList.add('card-body');
  
    const h2PostCap = document.createElement('h2');
    h2PostCap.classList.add('card-title', 'h4');
  
    const ulPost = document.createElement('ul');
    ulPost.classList.add('list-group', 'border-0', 'rounded-0');

    divPost.append(divPostCap);
    divPostCap.append(h2PostCap, ulPost);
  
    state.posts.forEach((element) => {
      
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
  
      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.setAttribute('href', element.link);
      a.setAttribute('target', '_blank');
      a.setAttribute('data-id', element.id);
      a.setAttribute('rel', 'noopener noreferrer');
      a.textContent = element.title;
  
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.setAttribute('data-bs-toggle', 'modal');
      button.setAttribute('data-bs-target', '#modal');
      button.setAttribute('data-id', element.id); 
      button.textContent = i18nInstance.t('button');
      
      ulPost.append(li);
      li.append(a, button);
    });
      
    const { posts } = elements;
    posts.replaceChildren(divPost);
  
  };
  
const createFeeds = (elements, state, i18nInstance) => {
  
  const divFeeds = document.createElement('div');
  divFeeds.classList.add('card', 'border-0');
    
  const divFeedsCap = document.createElement('div');
  divFeedsCap.classList.add('card-body');
    
  const h2FeedsCap = document.createElement('h2');
  h2FeedsCap.classList.add('card-title', 'h4');
    
  const ulFeeds = document.createElement('ul');
  ulFeeds.classList.add('list-group', 'border-0', 'rounded-0');
    
  divFeeds.append(divFeedsCap);
  divFeedsCap.append(h2FeedsCap, ulFeeds);
  
  state.feeds.forEach((element) => {
      
    const liFeeds = document.createElement('li');
    liFeeds.classList.add('list-group-item', 'border-0', 'border-end-0');
  
    const h3Feeds = document.createElement('h3');
    h3Feeds.classList.add('h6', 'm-0');
    h3Feeds.textContent = element.title;
  
    const pFeeds = document.createElement('p');
    pFeeds.classList.add('m-0', 'small', 'text-black-50');
    pFeeds.textContent = element.description;
  
    ulFeeds.append(liFeeds);
    liFeeds.append(h3Feeds, pFeeds);

  });
      
  const { feeds } = elements;
  feeds.replaceChildren(divFeeds);
  
};

export { createFeeds, createPost };
