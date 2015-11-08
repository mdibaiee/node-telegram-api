'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = webhook;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

var _fetch = require('./fetch');

var DEFAULTS = {
  server: {},
  port: 443
};

function webhook(options, bot) {
  if (options === undefined) options = {};

  options = Object.assign(DEFAULTS, options);

  return bot.api.setWebhook(options.url).then(function () {

    bot._webhookServer = _http2['default'].createServer(options.server, function (req, res) {
      return (0, _fetch.getBody)(req).then(function (data) {
        bot.emit('update', _qs2['default'].parse(data).result);

        res.end('OK');
      });
    }).listen(options.port);
  });
}

module.exports = exports['default'];
