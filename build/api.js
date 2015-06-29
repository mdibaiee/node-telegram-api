// API methods
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fetch = require('./fetch');

var _fetch2 = _interopRequireDefault(_fetch);

/**
 * API class, has a function for each method of the Telegram API which take
 * an object argument, and send request to the API server
 *
 * Methods: getMe, sendMessage, forwardMessage, sendPhoto, sendAudio,
 * sendDocument, sendSticker, sendVideo, sendLocation, sendChatAction,
 * getUserProfilePhotos, getUpdates
 */

var API =
/**
 * Create a new api object with the given token
 * @param  {string} token
 */
function API(token) {
  _classCallCheck(this, API);

  this.token = token;
};

exports['default'] = API;

API.prototype.request = function request(method, data) {
  return (0, _fetch2['default'])(this.token + '/' + method, data);
};

var methods = ['getMe', 'sendMessage', 'forwardMessage', 'sendPhoto', 'sendAudio', 'sendDocument', 'sendSticker', 'sendVideo', 'sendLocation', 'sendChatAction', 'getUserProfilePhotos', 'getUpdates', 'setWebhook'];

methods.forEach(function (method) {
  API.prototype[method] = function (data) {
    return this.request(method, data);
  };
});
module.exports = exports['default'];
