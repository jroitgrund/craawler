'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _crawl = require('./lib/crawl');

var _crawl2 = _interopRequireDefault(_crawl);

var _fetchLinksAndAssets = require('./lib/fetch-links-and-assets');

var _fetchLinksAndAssets2 = _interopRequireDefault(_fetchLinksAndAssets);

var _format = require('./lib/format');

var _format2 = _interopRequireDefault(_format);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var crawl = (0, _crawl2.default)((0, _fetchLinksAndAssets2.default)(_requestPromise2.default));
var url = process.argv[2];

crawl(url).then(function (urlMap) {
  _fs2.default.writeFile('sitemap.html', (0, _format2.default)(url, urlMap));
});