import cheerio from 'cheerio';
import urlLib from 'url';

const emptyResult = { links: [], assets: [] };

// Returns, for example, all HREFs of all <a> tags, relative to a certain base URL.
const getAbsolutePathForTagAndAttribute = ($, url, elementType, attribute) =>
  $(elementType).map((i, el) => {
    if ($(el).attr(attribute)) {
      const rawUrl = urlLib.resolve(url, $(el).attr(attribute));
      const parsedUrl = urlLib.parse(rawUrl);
      parsedUrl.hash = '';
      return parsedUrl.format();
    }

    // Else
    return undefined;
  }).get().filter(absoluteUrl => absoluteUrl); // Filters out undefined, this is for empty HREFs.

const uniq = array => array.filter((item, i, arr) => arr.indexOf(item) === i);

export default requestPromise => url => requestPromise
  .head(url)
  .catch(() => emptyResult)
  .then(headers => {
    if (headers['content-type'] !== undefined &&
         (headers['content-type'].includes('text/html') ||
          headers['content-type'].includes('application/xhtml+xml'))) {
      return requestPromise.get(url)
        .then(cheerio.load)
        .then($ => {
          const links = getAbsolutePathForTagAndAttribute($, url, 'a', 'href');
          const assets = getAbsolutePathForTagAndAttribute($, url, 'img', 'src').concat(
            getAbsolutePathForTagAndAttribute($, url, 'link', 'rel'),
            getAbsolutePathForTagAndAttribute($, url, 'script', 'src')
          );
          return { links: uniq(links).sort(), assets: uniq(assets).sort() };
        })
        .catch(() => emptyResult);
    }

    return emptyResult;
  });
