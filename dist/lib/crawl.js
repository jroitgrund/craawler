'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sameDomain = function sameDomain(link1, link2) {
  return _url2.default.parse(link1).host === _url2.default.parse(link2).host;
};

var removeProtocol = function removeProtocol(url) {
  var parsedUrl = _url2.default.parse(url);
  parsedUrl.protocol = '';
  return parsedUrl.format();
};

exports.default = function (fetchLinksAndAssets) {
  return function (rootUrl) {
    var urlMap = {};
    var seenUrls = _defineProperty({}, removeProtocol(rootUrl), true);
    var recursiveFetch = function recursiveFetch(url) {
      return fetchLinksAndAssets(url).then(function (linksAndAssets) {
        if (linksAndAssets.links.length > 0 || linksAndAssets.assets.length > 0) {
          urlMap[url] = linksAndAssets;
        }

        return Promise.all(linksAndAssets.links.filter(function (link) {
          return !seenUrls[removeProtocol(link)] && sameDomain(rootUrl, link);
        }).map(function (link) {
          seenUrls[removeProtocol(link)] = true;
          return link;
        }).map(recursiveFetch));
      });
    };

    // The return value is just a bunch of nested empty arrays, what we want to return is the map.
    return recursiveFetch(rootUrl).then(function () {
      return urlMap;
    });
  };
};