"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = function (rootUrl, urlMap) {
  var nextUrlId = 0;
  var urlIds = _defineProperty({}, rootUrl, nextUrlId);
  var nestedUrls = _defineProperty({}, rootUrl, {});
  var toProcess = [{ url: rootUrl, into: nestedUrls[rootUrl] }];
  while (toProcess.length > 0) {
    var _toProcess$shift = toProcess.shift();

    var url = _toProcess$shift.url;
    var into = _toProcess$shift.into;

    if (urlMap[url]) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = urlMap[url].links[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var link = _step.value;

          if (urlIds[link] === undefined) {
            into[link] = {};
            toProcess.push({ url: link, into: into[link] });
            urlIds[link] = ++nextUrlId;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }

  return { nestedUrls: nestedUrls, urlIds: urlIds };
};