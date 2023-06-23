import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import './styles.scss';
import render from './view.js';
import onChange from 'on-change';
import ru from './ru.js';

// проверить на валидность url и на повтор
const validateSS = (url, urls) => {
  const schema = yup
    .string()
    .trim() // лишние пробелы убераются
    .required() // 'Поле не должно быть пустым'
    .notOneOf(urls, 'RSS уже существует') // 'RSS уже существует'
    .url() // 'Ссылка должна быть валидным URL'
  return schema.validate(url);
};

const app = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: { ru },//: {
      //ru,
    //},
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
    formStatus: 'valid',
    urlList: [],
    error: '',
  };
  
  // когда будет меняться стейт но вызываем рендер, и он будет рисовать страницу
  const stateChanges = onChange(state, render(state, elements, i18nInstance));

  // нажимания  и обработка файла для второго шага вив
  elements.form.addEventListener('submit', (el) => {
    el.preventDefault();
    const formData = new FormData(el.target);

    validateSS(formData.get('url'), state.urlList)
    .then((data) => {
      stateChanges.form.formStatus = 'sending';
      stateChanges.urlList.push(data);
    })
    .catch(() => {
      stateChanges.form.formStatus = 'failed';
    });
});
};

export default app;