'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = fetch;
exports.getBody = getBody;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _formData = require('form-data');

var _formData2 = _interopRequireDefault(_formData);

function fetch(path) {
  var data = arguments[1] === undefined ? { test: 1 } : arguments[1];

  var form = new _formData2['default']();
  var keys = Object.keys(data);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var key = _step.value;

      console.log(key, data[key]);
      form.append(key, data[key]);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return new Promise(function (resolve, reject) {
    form.getLength(function (err, length) {
      if (err) {
        return reject(err);
      }

      form.submit({
        protocol: 'https:',
        host: 'api.telegram.org',
        path: '/bot' + path,
        headers: {
          'Content-Length': length
        }
      }, function (error, response) {
        if (error) {
          return reject(error);
        }

        return getBody(response).then(function (body) {
          try {
            var json = JSON.parse(body);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        })['catch'](reject);
      });
    });
  });

  // console.log(form.getHeaders());
  // return new Promise((resolve, reject) => {
  //   const req = https.request({
  //     hostname: 'api.telegram.org',
  //     method: keys.length ? 'POST' : 'GET',
  //     path: '/bot' + path,
  //     headers: form.getHeaders()
  //   }, response => {
  //     return getBody(response).then(res => {
  //       console.log(res);
  //       try {
  //         let json = JSON.parse(res);
  //         resolve(json);
  //       } catch(e) {
  //         reject(e);
  //       }
  //     }).catch(reject);
  //   });
  //
  //   form.pipe(req);
  // }).catch(err => {
  //   console.error('Error sending request', err);
  // });
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
