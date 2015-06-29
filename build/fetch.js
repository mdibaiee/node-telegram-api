'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = fetch;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function fetch(path, data) {
  var post = _qs2['default'].stringify(data);

  return new Promise(function (resolve, reject) {
    var res = '';

    var req = _https2['default'].request({
      hostname: 'api.telegram.org',
      method: data ? 'POST' : 'GET',
      path: '/bot' + path,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }, function (response) {
      response.on('data', function (chunk) {
        res += chunk;
      });

      response.on('end', function () {
        try {
          var json = JSON.parse(res);
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);

    if (post) {
      req.write(post);
    }
    req.end();
  })['catch'](function (err) {
    console.error('Error sending request', err);
  });
}

module.exports = exports['default'];
