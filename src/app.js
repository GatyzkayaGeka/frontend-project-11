import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import './styles.scss';
import render from './view.js';
import onChange from 'on-change';
import ru from './ru.js';
import _ from 'lodash';

// проверить на валидность url и на повтор
const validateSS = (url, urls) => {
  const schema = yup
    .string()
    .trim() // лишние пробелы убераются
    .required('must') // 'Поле не должно быть пустым'
    .notOneOf(urls, 'addedUrlExists') // 'RSS уже существует'
    .url('invalidUrl') // 'Ссылка должна быть валидным URL'
  return schema.validate(url);
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
    container: document.querySelector('.container-xxl '),
  };
  
  // объект состояния
  const state = { 
    form: {
        state: 'filling',
        error: '',
      },
      content: {
        posts: [],
      },
  };
  
  // когда будет меняться стейт но вызываем рендер, и он будет рисовать страницу
  const stateChanges = onChange(state, render(state, elements, i18nInstance));

  // нажимания  и обработка файла для второго шага вив
  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);

    validateSS(formData.get('url'), state.content.posts)
    .then((data) => {
      stateChanges.form.state = 'sending';
      stateChanges.content.posts.push(data);
    })
    .catch(() => {
      stateChanges.form.state = 'failed';
    });
});
};

export default app;