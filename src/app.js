import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import './styles.scss';
import render from './view.js';
import onChange from 'on-change';
import ru from './ru.js';
import axios from 'axios';
import parseRSS from './parser.js';



// проверить на валидность url и на повтор
const validateSS = (url, urls) => {
  const schema = yup
    .string()
    .trim() // лишние пробелы убераются
    .required() // 'Поле не должно быть пустым' потом добавоить в скопки 'must'
    .notOneOf(urls, 'addedUrlExists') // 'RSS уже существует'
    .url('invalidUrl') // 'Ссылка должна быть валидным URL'
    
  return schema.validate(url);
};
  
const addFeed = (url) => {
  const originReferences = new URL('https://allorigins.hexlet.app/get');
  originReferences.searchParams.set('url', url);
  originReferences.searchParams.set('disableCache', true);
  return originReferences;
};

// const addFeed = (url, state) => {
//   const originReferences = new URL('https://allorigins.hexlet.app/get');
//   originReferences.searchParams.set('url', url);
//   originReferences.searchParams.set('disableCache', true);
//   originReferences.toString();

//   return axios.get(originReferences)
//     .then((response) => response.data.contents)
//     .catch((er) => {
//       state.form.state = 'error';
//       state.form.error = er.message;
//     });
// };



const app = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: { ru },
  });
  // ссылки для отрисовки элементов
  const elements = {
    container: document.querySelector('.container-xxl'),
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('button[type="submit"]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    titleModal: document.querySelector('.modal-title'),
    bodyModal: document.querySelector('.modal-body'),
    buttonModal: document.querySelector('a[role="button"]'),
  };
  
  // объект состояния
  const state = { 
    form: {
      state: 'filling',
      error: '',
    },
    posts: [],
    feeds: [],
    modal: {
      postsModal: '',
      feedsModal: [],
    },
  };
  
  // когда будет меняться стейт но вызываем рендер, и он будет рисовать страницу
  const stateChanges = onChange(state, render(elements, state, i18nInstance));

  const checkRSSFeeds = () => {
    const updatePromises = state.feeds.map((feed) => {
      return axios.get(addFeed(feed.url))
        .then((response) => {
          const data = response.data;
          const rssState = parseRSS(data);
  
          const newPosts = rssState.posts.filter((post) => {
            return !state.posts.some((existingPost) => existingPost.link === post.link);
          });
  
          return newPosts;
        });
    });
  
    Promise.all(updatePromises)
      .then((newPostsArray) => {
        const newPosts = newPostsArray.flat();
  
        if (newPosts.length > 0) {
          stateChanges.posts.unshift(...newPosts);
        }
      })
      .catch((error) => {
        console.error('Ошибка при проверке RSS-потоков', error);
      })
      .finally(() => {
        setTimeout(checkRSSFeeds, 5000);
      });
  };

  // нажимания  и обработка файла для второго шага вив
  elements.form.addEventListener('submit', (e) => {
    //stateChanges.form.error = null;
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataUrl = formData.get('url');
    const urls = state.feeds.map((feed) => feed.url);

    validateSS(formDataUrl, urls)
    .then((link) => axios.get(addFeed(link)))
      // stateChanges.form.state = 'sending';
      // return addFeed(link, stateChanges);
    // })
    .then((response) => {
      // Успешно загружено, обновите состояние и отрисуйте элементы
      // const { feed, posts } = parseRSS(response.data.contents);
      const rssState = parseRSS(response.data.contents);
      // state.feeds.push(feed);
      // state.posts.push(...posts);
      // stateChanges.form.state = 'success';
      // stateChanges.posts.push(data);
      // stateChanges.feeds = state.feeds;
      // stateChanges.posts = state.posts;
      rssState.feed.id = _.uniqueId();
      rssState.feed.url = formDataUrl;
      rssState.posts.map((post) => {
        const idPost = post; 
        idPost.id = _.uniqueId(); 
        return idPost;
      });
      
      stateChanges.form = { state: 'loading', error: '' };
      stateChanges.feeds.push(rssState.feed);
      stateChanges.posts.unshift(...rssState.posts);
      stateChanges.form = { state: 'success', error: '' };
    })
    .catch((error) => {
      stateChanges.form = { state: 'invalid', error: error.message };
      if (error.name === 'AxiosError') {
        stateChanges.form = { state: 'invalid', error: 'networkError' };
      }
      // stateChanges.form.state = 'error';
      // stateChanges.form.error = error.message;
    });
  });

  elements.posts.addEventListener('click', (e) => {
    const postId = e.target.getAttribute('data-id');
    if (postId) {
      stateChanges.modal.postsModal = postId;
      const postElement = document.querySelector(`a[data-id="${postId}"]`);
      if (postElement) {
        postElement.classList.remove('fw-bold');
        postElement.classList.add('fw-normal');
      }
    }
  });

  checkRSSFeeds();
};

export default app;
