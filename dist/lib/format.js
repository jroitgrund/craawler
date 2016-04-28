'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jade = require('jade');

var _jade2 = _interopRequireDefault(_jade);

var _nest2 = require('./nest');

var _nest3 = _interopRequireDefault(_nest2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (rootUrl, urlMap) {
  var fn = _jade2.default.compileFile('src/lib/template.jade');

  var _nest = (0, _nest3.default)(rootUrl, urlMap);

  var nestedUrls = _nest.nestedUrls;
  var urlIds = _nest.urlIds;

  var html = fn({
    urlMap: urlMap,
    nestedUrls: nestedUrls,
    urlIds: urlIds
  });
  return html;
};