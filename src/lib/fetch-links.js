export default (cheerio, requestPromise) => url => requestPromise.head(url).then(headers => {
  if (headers['content-type'] !== undefined &&
       (headers['content-type'] === 'text/html' ||
        headers['content-type'] === 'application/xhtml+xml')) {
    return requestPromise.get(url)
      .then(cheerio.load)
      .then($ => $('a').map((i, el) => $(el).attr('href')).get());
  }

  return [];
});
