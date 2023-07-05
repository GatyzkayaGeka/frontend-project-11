import onChange from 'on-change';

const createPost = (elements, state) => {

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

  state.post.forEach((element) => {
    
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('href', element.link);
    a.setAttribute('target', '_blank');
    a.setAttribute('data-id', element.id);
    a.setAttribute('rel', 'noopener noreferrer');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-id', element.id);

    a.textContent = element.title;
    
    ulPost.append(li);
    li.append(a, button);

  });
};

const createFeeds = (elements, state) => {

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

};


const deletionInformation  = (elements) => {
  const { input, feedback } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-success');
};

const formUrl = (elements, value, i18nInstance, state) => {
const { feedback: isFeedback } = elements;
  switch (value) {
    //case 'valid':
      //input.classList.remove('is-invalid');
      //break;
    case 'invalid':
      deletionInformation(elements);
      elements.input.classList.add('is-invalid');
      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      isFeedback.textContent = i18nInstance.t('errors.invalidUrl');
      elements.form.reset();
      elements.input.focus();
      break;
    case 'success':
      deletionInformation(elements);
      elements.feedback.classList.add('text-success');
      isFeedback.textContent = i18nInstance.t('state.${state.form.state}');
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      break;
  }
};

const render = (elements, state, i18nInstance) => (path, value) => {
    formUrl(elements, value, i18nInstance);
  };

export default render;