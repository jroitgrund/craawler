import cheerio from 'cheerio';
import urlLib from 'url';

const getAbsolutePathForTagAndAttribute = ($, url, elementType, attribute) =>
  $(elementType).map((i, el) => urlLib.resolve(url, $(el).attr(attribute))).get();

export default requestPromise => url => requestPromise
  .head(url)
  .then(headers => {
    if (headers['content-type'] !== undefined &&
         (headers['content-type'] === 'text/html' ||
          headers['content-type'] === 'application/xhtml+xml')) {
      return requestPromise.get(url)
        .then(cheerio.load)
        .then($ => {
          const links = getAbsolutePathForTagAndAttribute($, url, 'a', 'href');
          const assets = getAbsolutePathForTagAndAttribute($, url, 'img', 'src').concat(
            getAbsolutePathForTagAndAttribute($, url, 'link', 'rel'),
            getAbsolutePathForTagAndAttribute($, url, 'script', 'src')
          );
          return { links: links.sort(), assets: assets.sort() };
        });
    }

    return { links: [], assets: [] };
  });
