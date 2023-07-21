const parseRSS = (response) => {
  const domParser = new DOMParser();
  const parseData = domParser.parseFromString(response, 'text/xml');
  const errorNode = parseData.querySelector('parsererror');

  if (errorNode) {
    const err = new Error();
    err.name = errorNode.textContent;
    err.message = 'invalidUrl';
    throw err;
  }
  try {
    const feed = {
      title: parseData.querySelector('title').textContent,
      description: parseData.querySelector('description').textContent,
      // url: link,
    };

    const posts = Array.from(parseData.querySelectorAll('item')).map((el) => {
      const title = el.querySelector('title').textContent;
      const description = el.querySelector('description').textContent;
      const link = el.querySelector('link').textContent;
      return { link, title, description };
    });
    return { feed, posts };
  } catch (err) {
    err.message = 'unableToParse';
    throw err;
  }
};
export default parseRSS;
