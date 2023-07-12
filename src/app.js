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
    .notOneOf(urls, 'errors.addedUrlExists') // 'RSS уже существует'
    .url('invalidUrl') // 'Ссылка должна быть валидным URL'
    .required('must') // 'Поле не должно быть пустым'
  return schema.validate(url);
};

const addFeed = (url, state, stateChanges) => {
  const proxiUrl = (url) => {
    const originReferences = new URL('https://allorigins.hexlet.app/get');
    originReferences.searchParams.set('url', url);
    originReferences.searchParams.set('disableCache', true);
    return originReferences.toString();
  };

  const dataAcquisition = (url) => {
    const result = proxiUrl(url);
    return axios.get(result);
  };

  return dataAcquisition(url)
    .then((response) => {
      const { feed, posts } = parseRSS(response.data.contents, url);
      state.feeds.push(feed);
      state.posts.push(...posts);
    })
    .catch((error) => {
      console.log(error);
      stateChanges.form.states = 'error';
      stateChanges.form.error = error.message;
    });
};

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
    input: document.querySelector('input.form-control'),
    // label: document.querySelector('label[for="url-input"]'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };
  
  // объект состояния
  const state = { 
    form: {
      state: 'filling',
      error: '',
    },
    posts: [],
    feeds: [],
  };
  
  // когда будет меняться стейт но вызываем рендер, и он будет рисовать страницу
  const stateChanges = onChange(state, render(elements, state, i18nInstance));

  // нажимания  и обработка файла для второго шага вив
  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const formDataUrl = formData.get('url');
    const urls = state.feeds.map((feed) => feed.url);

    validateSS(formDataUrl, urls)
    .then((data) => {
      stateChanges.form.state = 'success';
      stateChanges.posts.push(data);
      addFeed(formDataUrl, state, stateChanges)
      .then(() => {
        // Успешно загружено, обновите состояние и отрисуйте элементы
        stateChanges.feeds = state.feeds;
        stateChanges.posts = state.posts;
      })
      .catch((error) => {
        console.log(error);
        stateChanges.form.state = 'error';
        stateChanges.form.error = error.message;
      });
    })
    .catch(() => {
      stateChanges.form.state = 'invalid';
    });
 });
};

export default app;
