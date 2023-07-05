import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import './styles.scss';
import render from './view.js';
import onChange from 'on-change';
import ru from './ru.js';
import axios from 'axios';

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

const addFeed = (url, state) => {
  return axios
    .get(`https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const { feed, posts } = parseRSS(response, url);
      state.feeds.push(feed);
      state.posts.push(...posts);
    })
    .catch((error) => {
      console.log(error);
      stateChanges.form.state = 'error';
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
    form: document.querySelector('.rss-form'),
    input: document.querySelector('input.form-control'),
    label: document.querySelector('label[for="url-input"]'),
    button: document.querySelector('button[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    container: document.querySelector('.container-xxl'),
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
  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);

    validateSS(formData.get('url'), state.posts)
    .then((data) => {
      stateChanges.form.state = 'success';
      stateChanges.posts.push(data);
    })
    .catch(() => {
      stateChanges.form.state = 'invalid';
    });
 });
};

document.addEventListener('DOMContentLoaded', () => {
  app();
});

export default app;