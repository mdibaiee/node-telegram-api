'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;
exports.getBody = getBody;

var _unirest = require('unirest');

var _unirest2 = _interopRequireDefault(_unirest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetch(path) {
  var data = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    var files = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = Object.keys(data)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        if (data[key].file) {
          files[key] = data[key].file;
          delete data[key];
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

    _unirest2.default.post('https://api.telegram.org/bot' + path).field(data).attach(files).end(function (response) {
      if (response.statusType === 4 || response.statusType === 5 || !response.body || !response.body.ok) {
        reject(response);
      } else {
        resolve(response.body);
      }
    });
  });
}

function getBody(stream) {
  var data = '';

  return new Promise(function (resolve, reject) {
    stream.on('data', function (chunk) {
      data += chunk;
    });

    stream.on('end', function () {
      resolve(data);
    });

    stream.on('error', reject);
  });
}
