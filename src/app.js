import * as yup from 'yup';
import _ from 'lodash';
import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import ru from './loc/ru.js';
import parseRSS from './parser.js';
import render from './view.js';

// проверить на валидность url и на повтор
const validateUrl = (url, urls) => {
  const schema = yup
    .string()
    .trim() // лишние пробелы убераются
    .required() // 'Поле не должно быть пустым' потом добавоить в скопки 'must'
    .notOneOf(urls, 'addedUrlExists') // 'RSS уже существует'
    .url('invalidUrl'); // 'Ссылка должна быть валидным URL'

  return schema.validate(url);
};

const prepareUrl = (url) => {
  const originReferences = new URL('https://allorigins.hexlet.app/get');
  originReferences.searchParams.set('url', url);
  originReferences.searchParams.set('disableCache', true);
  return originReferences;
};

const app = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      debug: true,
      resources: { ru },
    })
    .then(() => {
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
          postsModal: null,
          feedsModal: new Set(),
        },
      };

      // когда будет меняться стейт но вызываем рендер, и он будет рисовать страницу
      const stateChanges = onChange(state, render(elements, state, i18nInstance));

      // Обработка изменений в состоянии модального окна

      const fetchDataForFeed = (feed) => axios
        .get(prepareUrl(feed.url))
        .then((response) => response.data)
        .catch((error) => {
          // Обработка ошибки невалидного RSS
          if (error.message === 'invalidRss') {
            console.error('Ресурс не содержит валидный RSS');
          } else {
            console.error('Ошибка при получении RSS-потока', error);
          }
          throw error; // Пробрасываем ошибку дальше, чтобы обработать ее в Promise.all
        });

      const checkRSSFeeds = () => {
        const timeUpdate = 5000;
        const updatePromises = state.feeds.map((feed) => fetchDataForFeed(feed).then((data) => {
          const rssState = parseRSS(data);

          const newPosts = rssState.posts.filter(
            (post) => !state.posts.some((existingPost) => existingPost.link === post.link),
          );

          return newPosts;
        })
          .catch((error) => {
            console.error('Ошибка при получении или парсинге RSS-потока:', error);
            // Возвращаем пустой массив, чтобы промис завершился успешно, но без новых постов
            return [];
          }));

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
            setTimeout(checkRSSFeeds, timeUpdate);
          });
      };

      // нажимания  и обработка файла для второго шага вив
      elements.form.addEventListener('submit', (e) => {
        // stateChanges.form.error = null;
        e.preventDefault();
        const formData = new FormData(e.target);
        const formDataUrl = formData.get('url');
        const urls = state.feeds.map((feed) => feed.url);
        stateChanges.form = { state: 'sending', error: '' };

        validateUrl(formDataUrl, urls)
          .then((link) => axios.get(prepareUrl(link)))

          .then((response) => {
          // Успешно загружено, обновить состояние и отрисовать элементы
            const rssState = parseRSS(response.data.contents);
            rssState.feed.id = _.uniqueId();
            rssState.feed.url = formDataUrl;
            rssState.posts = rssState.posts.map((post) => {
              post.id = _.uniqueId();
              return post;
            });

            stateChanges.feeds.push(rssState.feed);
            stateChanges.posts.unshift(...rssState.posts);
            stateChanges.form = { state: 'success', error: '' };
            console.log('state:', state); // Отладочный вывод для проверки состояния state после обновления
          })
          .catch((error) => {
            stateChanges.form = {
              state: 'invalid',
              error: error.name === 'AxiosError' ? 'networkError' : error.message,
            };
          });
      });

      elements.posts.addEventListener('click', ({ target }) => {
        const { id } = target.dataset;
        stateChanges.modal.postsModal = id;
        stateChanges.modal.feedsModal.add(id);
      });

      checkRSSFeeds(stateChanges);
    });
};

export default app;
