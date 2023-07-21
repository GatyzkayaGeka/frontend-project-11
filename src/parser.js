const parseRSS = (response) => {
  const domParser = new DOMParser();
  const parseData = domParser.parseFromString(response, 'text/xml');
  const errorNode = parseData.querySelector('parsererror');

  if (errorNode) {
    const err = new Error();
    err.name = errorNode.textContent;
    err.message = 'invalidRss';
    throw err;
  }
  try {
    const feed = {
      title: parseData.querySelector('title').textContent,
      description: parseData.querySelector('description').textContent,
    };

    const posts = Array.from(parseData.querySelectorAll('item')).map((el) => {
      const title = el.querySelector('title').textContent;
      const description = el.querySelector('description').textContent;
      const link = el.querySelector('link').textContent;
      const id = _.uniqueId();
      return { id, link, title, description };
    });
    return { feed, posts };
  } catch (err) {
    err.message = 'unableToParse';
    throw err;
  }
};
export default parseRSS;
