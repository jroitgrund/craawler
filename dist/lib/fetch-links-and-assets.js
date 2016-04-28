'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var emptyResult = { links: [], assets: [] };

// Returns, for example, all HREFs of all <a> tags, relative to a certain base URL.
var getAbsolutePathForTagAndAttribute = function getAbsolutePathForTagAndAttribute($, url, elementType, attribute) {
  return $(elementType).map(function (i, el) {
    if ($(el).attr(attribute)) {
      var rawUrl = _url2.default.resolve(url, $(el).attr(attribute));
      var parsedUrl = _url2.default.parse(rawUrl);
      parsedUrl.hash = '';
      return parsedUrl.format();
    }

    // Else
    return undefined;
  }).get().filter(function (absoluteUrl) {
    return absoluteUrl;
  });
}; // Filters out undefined, this is for empty HREFs.

var uniq = function uniq(array) {
  return array.filter(function (item, i, arr) {
    return arr.indexOf(item) === i;
  });
};

exports.default = function (requestPromise) {
  return function (url) {
    return requestPromise.head(url).catch(function () {
      return emptyResult;
    }).then(function (headers) {
      if (headers['content-type'] !== undefined && (headers['content-type'].includes('text/html') || headers['content-type'].includes('application/xhtml+xml'))) {
        return requestPromise.get(url).then(_cheerio2.default.load).then(function ($) {
          var links = getAbsolutePathForTagAndAttribute($, url, 'a', 'href');
          var assets = getAbsolutePathForTagAndAttribute($, url, 'img', 'src').concat(getAbsolutePathForTagAndAttribute($, url, 'link', 'rel'), getAbsolutePathForTagAndAttribute($, url, 'script', 'src'));
          return { links: uniq(links).sort(), assets: uniq(assets).sort() };
        }).catch(function () {
          return emptyResult;
        });
      }

      return emptyResult;
    });
  };
};