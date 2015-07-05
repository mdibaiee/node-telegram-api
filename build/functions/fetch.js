'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = fetch;
exports.getBody = getBody;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _restler = require('restler');

var _restler2 = _interopRequireDefault(_restler);

function fetch(path) {
  var data = arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    var method = Object.keys(data).length ? 'POST' : 'GET';
    var multipart = method === 'POST' ? true : false;

    _restler2['default'].request('https://api.telegram.org/bot' + path, {
      data: data, method: method, multipart: multipart
    }).on('complete', function (response) {
      try {
        var json = JSON.parse(response);
        resolve(json);
      } catch (e) {
        reject(e);
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
